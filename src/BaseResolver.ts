import got, { HTTPError } from 'got';
import * as FormData from 'form-data';
import * as xray from '@manishrawat4u/x-ray';
import { CookieJar } from 'tough-cookie';
import * as psl from 'psl';
import { UrlResolverOptions } from './UrlResolverOptions';
const debug = require('debug')('nurl:BaseUrlResolver');

export abstract class BaseUrlResolver {
    protected domains: RegExp[];
    protected gotInstance = got;

    protected xInstance = xray();
    protected useCookies: boolean;

    constructor(options: BaseResolverOptions) {
        this.domains = options.domains;
        this.useCookies = options.useCookies || false;

    }
    /**
     * @param {string} urlToResolve
     * Override this method if you want to implement can resolve function
     */
    async canResolve(urlToResolve: string): Promise<boolean> {
        return this.domains.some((innerUrl) => {
            return innerUrl.test(urlToResolve);
        });
    }

    /**
     *
     * @param {string} urlToResolve
     */
    async resolve(urlToResolve: string,
        options: Partial<UrlResolverOptions>
    ): Promise<ResolvedMediaItem[]> {
        let canResolve = false;
        try {
            canResolve = await this.canResolve(urlToResolve);
        } catch (error) {
            debug('Error occurred while calling canResolve BaseResolver');
        }
        if (canResolve) {
            try {
                this.setupEnvironment();
                const resolveResults = await this.resolveInner(urlToResolve);
                resolveResults.forEach(x => x.parent = x.parent || urlToResolve);

                if (options.extractMetaInformation) {
                    await Promise.all(resolveResults
                        .filter(x => x.isPlayable)
                        .map(this.fillMetaInfoInner, this));
                }

                return this.massageResolveResults(resolveResults);
            } catch (error) {
                if (error instanceof HTTPError) {
                    debug('http error %s %s', urlToResolve, error.message);
                } else {
                    debug('unknown error %s %s', urlToResolve, error.message);
                }
            }
        }
        return [];
    }

    private massageResolveResults(resolveResults: ResolvedMediaItem[]): ResolvedMediaItem[] {
        return resolveResults.map(x => {
            x.link = new URL(x.link).href;  //normalizing the url like escaping spaces
            return x;
        });
    }

    private async fillMetaInfoInner(resolveMediaItem: ResolvedMediaItem) {
        try {
            await this.fillMetaInfo(resolveMediaItem);
        } catch (error) {
            console.error(`${this.constructor.name}: `, 'Http error', resolveMediaItem.link, error.message);
        }

    }

    async fillMetaInfo(resolveMediaItem: ResolvedMediaItem) {
        const headResponse = await this.gotInstance.head(resolveMediaItem.link, {
            headers: resolveMediaItem.headers
        });
        resolveMediaItem.size = headResponse.headers['content-length'];
        resolveMediaItem.lastModified = headResponse.headers['last-modified'];
        resolveMediaItem.contentType = headResponse.headers['content-type'];
    }

    private setupEnvironment(): void {
        let gotoptions: any = {};
        this.useCookies && (gotoptions.cookieJar = new CookieJar());
        gotoptions.headers = {
            'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:75.0) Gecko/20100101 Firefox/75.0'
        }
        this.gotInstance = got.extend(gotoptions);
    }

    abstract resolveInner(_urlToResolve: string): Promise<ResolvedMediaItem[]>;

    protected async wait(ms: number): Promise<void> {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    protected async postHiddenFormV2(page: string, ix?: number): Promise<string> {
        ix = ix || 0;        
        const pageForms = await this.xInstance(page, ['form@action']);
        const requestedFormActionLink = pageForms[ix];
        return await this.postHiddenForm(requestedFormActionLink, page, ix);        
    }

    protected async postHiddenForm(urlToPost: string, page: string, ix?: number): Promise<string> {
        const form = await this.getHiddenForm(page, ix);
        if (form) {
            const response2 = await this.gotInstance.post(urlToPost, {
                body: form,
                headers: {
                    Referer: urlToPost
                },
                followRedirect: false   //it can raise some unhandled error which can potentially cause whole application shutdown.
            });
            return response2.body;
        }
        throw new Error('No form found to post.');
    }

    protected async getHiddenForm(page: string, ix?: number): Promise<FormData | undefined> {
        ix = ix || 0;
        const pageForms = await this.xInstance(page, ['form@html']);
        const requestedForm = pageForms[ix];
        if (requestedForm) {
            let form = new FormData();
            var obj = await this.xInstance(requestedForm, {
                n: ['*@name'],
                v: ['*@value']
            });
            for (let index = 0; index < obj.n.length; index++) {
                const n = obj.n[index];
                const v = obj.v[index];
                n !== undefined && v !== undefined &&
                    n !== null && v !== null && form.append(n, v);
            }
            return form;
        }
    }

    protected getSecondLevelDomain(someUrl: string): string | null {
        var hostname = new URL(someUrl);
        var parsed = psl.parse(hostname.hostname) as psl.ParsedDomain;
        return parsed.sld;
    }

    protected extractFileNameFromUrl(someUrl: string): string {
        let fileName = `${new URL(someUrl).pathname.split('/').slice(-1)[0]}`;
        fileName = decodeURIComponent(fileName);
        return fileName;
    }

    protected async getServerPublicIp(): Promise<string> {
        const result = await this.gotInstance('https://api.ipify.org?format=json', {
            responseType: 'json',
            resolveBodyOnly: true,
        }) as { ip: string };
        return result.ip;
    }
}

export interface ResolvedMediaItem {
    title: string,
    poster: string,
    isPlayable: boolean,
    link: string,
    parent: string,
    headers: Record<string, string>,
    size?: string,
    lastModified?: string,
    contentType?: string
}

export interface BaseResolverOptions {
    domains: RegExp[],
    useCookies?: boolean
}