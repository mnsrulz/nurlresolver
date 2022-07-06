import got, { Got, HTTPError, Response } from 'got';
import scrapeIt = require("scrape-it");
import util = require('util');
import { parseAllLinks, ParseHiddenForm, transformScrapedFormToFormData, getHiddenForm, getHiddenFormActionRaw } from './utils/helper';
import { CookieJar } from 'tough-cookie';
import * as psl from 'psl';
import { UrlResolverOptions } from './UrlResolverOptions';
import _debug from 'debug';
const logger = _debug('nurl:BaseUrlResolver');

export abstract class BaseUrlResolver {
    protected domains: RegExp[];
    protected gotInstance = got;
    protected _speedRank: number;

    protected useCookies: boolean;

    protected scrapeItAsync = util.promisify(scrapeIt);
    protected scrapeHtml = scrapeIt.scrapeHTML;
    protected _cookieJar?: CookieJar;

    constructor(options: BaseResolverOptions) {
        this.domains = options.domains;
        this.useCookies = options.useCookies || false;
        this._speedRank = options.speedRank || 30;
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
            logger('Error occurred while calling canResolve BaseResolver');
        }
        if (canResolve) {
            try {
                this.setupEnvironment();
                let resolveResults: ResolvedMediaItem[] = [];
                const _resolveResults = await this.resolveInner(urlToResolve);
                resolveResults = resolveResults.concat(_resolveResults);

                resolveResults.forEach(x => x.parent = x.parent || urlToResolve);

                resolveResults.filter(x => x.isPlayable).forEach(x => x.speedRank = this._speedRank);
                if (options.extractMetaInformation) {
                    await Promise.all(resolveResults
                        .filter(x => x.isPlayable)
                        .map(this.fillMetaInfoInner, this));
                }

                return this.massageResolveResults(resolveResults);
            } catch (error) {
                if (error instanceof HTTPError) {
                    logger('http error %s %s', urlToResolve, error.message);
                } else if (error instanceof Error) {
                    logger('unknown error %s %s', urlToResolve, error.message);
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
        await this.fillMetaInfo(resolveMediaItem);
    }

    async fillMetaInfo(resolveMediaItem: ResolvedMediaItem): Promise<void> {
        const headResponse = await this.gotInstance.head(resolveMediaItem.link, {
            headers: resolveMediaItem.headers
        });
        resolveMediaItem.size = headResponse.headers['content-length'];
        resolveMediaItem.lastModified = headResponse.headers['last-modified'];
        resolveMediaItem.contentType = headResponse.headers['content-type'];
    }

    protected setupEnvironment(): void {
        const gotoptions: CustomGotOptions = {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:92.0) Gecko/20100101 Firefox/92.0'
            }
        };
        if (this.useCookies) {
            console.log('setting up the cookies jar')
            this._cookieJar = new CookieJar();
            gotoptions.cookieJar = this._cookieJar;
        }

        this.gotInstance = got.extend({
            hooks: {
                beforeRequest: [
                    (options) => {
                        console.log(`${options.method} - ${options.url.href}`)
                        options.method== 'POST' && console.log(JSON.stringify(options.form, null, 4));
                        console.log(JSON.stringify(options.headers, null, 4));
                    }
                ],
                afterResponse: [
                    (response, retryWithMergedOptions) => {
                        //console.log(JSON.stringify(response.rawHeaders, null, 4));
                        // No changes otherwise
                        return response;
                    }
                ]
            },
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:92.0) Gecko/20100101 Firefox/92.0'
            },
            cookieJar: this._cookieJar
        });
    }

    abstract resolveInner(_urlToResolve: string): Promise<ResolvedMediaItem[] | ResolvedMediaItem>;

    protected async wait(ms: number): Promise<void> {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    protected async createmyresponse(initUrl: string): Promise<MyInternalResponse> {
        return await MyInternalResponse.create(initUrl, this.gotInstance);
    }

    protected async postHiddenForm(urlToPost: string, page: string, ix?: number, resolveBody?: true): Promise<string>
    protected async postHiddenForm(urlToPost: string, page: string, ix?: number, resolveBody?: false): Promise<Response<string>>
    protected async postHiddenForm(urlToPost: string, page: string, ix?: number, resolveBody = true): Promise<string | Response<string>> {
        const form = getHiddenForm(page, ix);
        if (form) {
            const response2 = await this.gotInstance.post(urlToPost, {
                form: form,
                headers: {
                    Referer: urlToPost
                },
                followRedirect: false   //it can raise some unhandled error which can potentially cause whole application shutdown.
            });
            return resolveBody ? response2.body : response2;
        }
        throw new Error('No form found to post.');
    }

    // protected async getHiddenForm(page: string, ix?: number): Promise<Record<string, string> | undefined> {
    //     this.getHiddenForm
    // }

    protected getSecondLevelDomain(someUrl: string): string | null {
        const hostname = new URL(someUrl);
        const parsed = psl.parse(hostname.hostname) as psl.ParsedDomain;
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

    protected scrapeLinkHref(html: string, selector: string) {
        const { link } = this.scrapeHtml(html, {
            link: {
                selector: selector,
                attr: 'href'
            }
        });
        return link;
    }

    protected scrapeAllLinks(html: string, context: string, baseUrl = '') {
        const parsedLinks: ResolvedMediaItem[] = [];
        parseAllLinks(html, context).forEach(x => {
            if (baseUrl && baseUrl.startsWith('http') && !x.href.startsWith('http')) {
                parsedLinks.push({
                    link: new URL(x.href, baseUrl).href,
                    title: x.text
                } as ResolvedMediaItem);
            } else {
                parsedLinks.push({
                    link: x.href,
                    title: x.text
                } as ResolvedMediaItem);
            }
        });
        return parsedLinks;
    }

    protected nodeatob(str: string) {
        return Buffer.from(str, 'base64').toString();
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
    contentType?: string,
    speedRank: number
}

export interface BaseResolverOptions {
    domains: RegExp[],
    useCookies?: boolean,
    speedRank?: number
}

export class GenericFormBasedResolver extends BaseUrlResolver {
    private _selector: string;
    private _formIx: number;

    constructor(options: BaseResolverOptions, selector: string, formIx?: number) {
        super(options);
        this._selector = selector;
        this._formIx = formIx || 0;
    }

    async resolveInner(_urlToResolve: string): Promise<ResolvedMediaItem[]> {
        const response = await this.gotInstance(_urlToResolve);
        const response2Body = await this.postHiddenForm(response.url, response.body, this._formIx);
        const link = this.scrapeLinkHref(response2Body, this._selector);
        const title = this.extractFileNameFromUrl(link);
        const result = {
            link,
            title,
            isPlayable: true
        } as ResolvedMediaItem;
        return [result];
    }
}

interface CustomGotOptions {
    headers: Record<string, string>,
    cookieJar?: CookieJar
}

class MyInternalResponse {
    private _got: Got;
    private _response: Response<string> | undefined;
    public get lastUrl(): string | undefined {
        return this._response?.url;
    }
    public get response(): Response<string> | undefined {
        return this._response;
    }
    private constructor(got: Got) {
        this._got = got;
    }

    private async getinit(initUrl: string): Promise<MyInternalResponse> {
        const response = await this._got(initUrl);
        this._response = response;
        return this;
    }

    public static async create(initUrl: string, got: Got): Promise<MyInternalResponse> {
        const m = new MyInternalResponse(got);
        return await m.getinit(initUrl);
    }

    public async posthiddenform(ix?: number): Promise<MyInternalResponse> {
        if (!this._response || !this.lastUrl) throw new Error('unable to process empty body');
        const form = getHiddenForm(this._response.body, ix);
        const actionUrl = getHiddenFormActionRaw(this._response.body, ix);
        const finalactionUrl = new URL(actionUrl, this.lastUrl).href;
        if (form) {
            //console.log(`Posting the following form to url: ${finalactionUrl}`);
            //console.log(JSON.stringify(form, null, 4));
            const response2 = await this._got.post(finalactionUrl, {
                form: form,
                headers: {
                    Referer: this.lastUrl
                },
                followRedirect: false   //it can raise some unhandled error which can potentially cause whole application shutdown.
            });

            this._response = response2;
            return this;
        }
        throw new Error('No form found to post.');
    }
}