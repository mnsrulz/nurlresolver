import got, { GotOptions } from 'got';
import FormData = require('form-data');

export abstract class BaseUrlResolver {
    protected domains: RegExp[];
    protected gotInstance = got;
    protected xInstance = require('x-ray')();
    protected useCookies: boolean;
    private CookieJar = require('tough-cookie');

    constructor(options: IResolverOptions) {
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
                return await this.resolveInner(urlToResolve);
            } catch (error) {
                console.log(`Error occurred while resolving: ${urlToResolve}`);
                console.log(error);
            }
        }
        return [];
    }

    private setupEnvironment(): void {
        let gotoptions = <GotOptions>{};
        this.useCookies && (gotoptions.cookieJar = new this.CookieJar.CookieJar());
        this.gotInstance = got.extend(gotoptions)
    }

    async abstract resolveInner(_urlToResolve: string): Promise<ResolvedMediaItem[]>;

    protected async wait(ms: number): Promise<void> {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    protected async getHiddenForm(page: string, ix?: number): Promise<FormData> {
        const form = new FormData();
        ix = ix || 0;
        var obj1 = await this.xInstance(page, ['form@html']);
        var el = obj1[ix];
        var obj = await this.xInstance(el, {
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

    protected getSecondLevelDomain(someUrl: string): string {
        var psl = require('psl');
        var hostname = new URL(someUrl);
        var parsed = psl.parse(hostname.hostname);
        return parsed.sld;
    }

}

export interface ResolvedMediaItem {
    title: string,
    poster: string,
    isPlayable: boolean,
    link: string,
    referer: string
}

export interface IResolverOptions {
    domains: RegExp[],
    useCookies?: boolean
}
