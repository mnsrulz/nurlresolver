import got, { HTTPError, Response } from 'got';
import scrapeIt = require("scrape-it");
import util = require('util');
import * as helper from './utils/helper';
import { CookieJar } from 'tough-cookie';
import { UrlResolverOptions } from './UrlResolverOptions';
import _debug from 'debug';
import { URL } from 'url';
import { performance } from "perf_hooks";
const logger = _debug('nurl:BaseUrlResolver');

export abstract class BaseUrlResolver {
    protected domains: RegExp[];
    protected gotInstance = got;
    protected _speedRank: number;

    protected useCookies: boolean;

    protected scrapeItAsync = util.promisify(scrapeIt);
    protected scrapeHtml = scrapeIt.scrapeHTML;
    protected _cookieJar?: CookieJar;
    protected defaultUserAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/111.0';

    protected getSecondLevelDomain = helper.getSecondLevelDomain;
    protected isValidHttpUrl = helper.isValidHttpUrl;
    protected getHiddenForm = helper.parseHiddenFormV2;
    protected scrapeLinkHref = helper.scrapeLinkHref;
    protected scrapePageTitle = helper.scrapePageTitle;
    protected scrapeInnerText = helper.scrapeInnerText;
    protected parseAllLinks = helper.parseAllLinks;
    protected parseElementAttributes = helper.parseElementAttributes;
    protected extractFileNameFromUrl = helper.extractFileNameFromUrl;
    protected wait = helper.wait;
    protected nodeatob = helper.nodeatob;
    protected getServerPublicIp = helper.getServerPublicIp;
    protected parseScripts = helper.parseScripts;
    protected scrapeAllLinks(html: string, context: string, baseUrl = '') {
        return helper.parseAllLinks(html, context, baseUrl)
            .map(x => { return { link: x.link, title: x.title } as ResolvedMediaItem });
    }

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
            let status = 'ERROR';
            const startTime = performance.now();
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
                const result = this.massageResolveResults(resolveResults);
                status = result.length > 0 ? 'OK' : 'NOT FOUND';
                return result;
            } catch (error) {
                if (error instanceof HTTPError) {
                    logger('http error %s %s', urlToResolve, error.message);
                } else if (error instanceof Error) {
                    logger('unknown error %s %s', urlToResolve, error.message);
                }
            }
            finally {
                const timeTook = (performance.now() - startTime);
                logger('%s %s %sms', status, urlToResolve, timeTook.toFixed(0));
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

    private setupEnvironment(): void {
        const gotOptions: CustomGotOptions = {
            headers: {
                'User-Agent': this.defaultUserAgent
            }, timeout: {
                request: 10000  //by default let every individual request time out after 10 seconds
            }, retry: {
                limit: 0
            }
        };
        if (this.useCookies) {
            this._cookieJar = new CookieJar();
            gotOptions.cookieJar = this._cookieJar;
        }

        this.gotInstance = got.extend(gotOptions);
    }

    abstract resolveInner(_urlToResolve: string): Promise<ResolvedMediaItem[] | ResolvedMediaItem>;

    protected async postHiddenForm(urlToPost: string, page: string, ix?: number, resolveBody?: true): Promise<string>
    protected async postHiddenForm(urlToPost: string, page: string, ix?: number, resolveBody?: false): Promise<Response<string>>
    protected async postHiddenForm(urlToPost: string, page: string, ix?: number, resolveBody = true): Promise<string | Response<string>> {
        const form = this.getHiddenForm(page, ix);
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
    cookieJar?: CookieJar,
    timeout?: {
        request?: number,
        connect?: number
    },
    retry?: {
        limit?: number
    }
}