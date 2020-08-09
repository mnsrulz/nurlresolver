import got, { GotOptions, HTTPError } from 'got';
import FormData = require('form-data');

export abstract class BaseUrlResolver {
    protected domains: RegExp[];
    protected gotInstance = got;
    protected xInstance = require('x-ray')();
    protected useCookies: boolean;
    private CookieJar = require('tough-cookie');

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
    async resolve(urlToResolve: string): Promise<ResolvedMediaItem[]> {
        let canResolve = false;
        try {
            canResolve = await this.canResolve(urlToResolve);
        } catch (error) {
            console.log('Error occurred while calling canresole BaseResolver');
        }
        if (canResolve) {
            try {
                this.setupEnvironment();
                var resolveResults = await this.resolveInner(urlToResolve);
                resolveResults.forEach(x => x.parent = x.parent || urlToResolve);
                return this.massageResolveResults(resolveResults);
            } catch (error) {
                if (error instanceof HTTPError) {
                    console.error(`${this.constructor.name}: `, 'Http error.', urlToResolve, error.message);
                } else {
                    console.error(`${this.constructor.name}: `, 'Unknown error', urlToResolve, error.message);
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

    private setupEnvironment(): void {
        let gotoptions = <GotOptions>{};
        this.useCookies && (gotoptions.cookieJar = new this.CookieJar.CookieJar());
        gotoptions.headers = {
            'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:75.0) Gecko/20100101 Firefox/75.0'
        }
        this.gotInstance = got.extend(gotoptions)
    }

    async abstract resolveInner(_urlToResolve: string): Promise<ResolvedMediaItem[]>;

    protected async wait(ms: number): Promise<void> {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    protected async postHiddenForm(urlToPost: string, page: string, ix?: number): Promise<string | undefined> {
        const form = await this.getHiddenForm(page, ix);
        if (form) {
            const response2 = await this.gotInstance.post(urlToPost, {
                body: form
            });
            return response2.body;
        }        
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

    protected getSecondLevelDomain(someUrl: string): string {
        var psl = require('psl');
        var hostname = new URL(someUrl);
        var parsed = psl.parse(hostname.hostname);
        return parsed.sld;
    }

    protected extractFileNameFromUrl(someUrl: string): string {
        let fileName = `${new URL(someUrl).pathname.split('/').slice(-1)[0]}`;
        fileName = decodeURIComponent(fileName);
        return fileName;
    }
}

export interface ResolvedMediaItem {
    title: string,
    poster: string,
    isPlayable: boolean,
    link: string,
    referer: string,
    parent: string
}

export interface BaseResolverOptions {
    domains: RegExp[],
    useCookies?: boolean
}