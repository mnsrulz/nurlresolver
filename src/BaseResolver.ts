import got from 'got';
import FormData = require('form-data');

export abstract class BaseUrlResolver {
    protected domains: RegExp[];
    protected gotInstance = got;
    protected xInstance = require('x-ray')();
    private CookieJar = require('tough-cookie');

    constructor(options: IResolverOptions) {
        this.domains = options.domains;
        this.gotInstance = got.extend({
            cookieJar: options.useCookies ? new this.CookieJar.CookieJar() : null
        })
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
                return await this.resolveInner(urlToResolve);
            } catch (error) {
                console.log(`Error occurred while resolving: ${urlToResolve}`);
                console.log(error);
            }
        }
        return [];
    }

    async abstract resolveInner(_urlToResolve: string): Promise<ResolvedMediaItem[]>;

    createResult(title: string, link: string, poster: string, isPlayable: boolean, referer: string) {
        return {
            title,
            link,
            poster,
            isPlayable,
            referer
        };
    }

    protected postForm() {

    }

    protected async getHiddenForm(page: string, ix: number): Promise<FormData> {
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
