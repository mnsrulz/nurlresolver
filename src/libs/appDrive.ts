import { BaseUrlResolver, ResolvedMediaItem } from "../BaseResolver.js";

export class AppDriveResolver extends BaseUrlResolver {
    constructor() {
        super({
            domains: [/https?:\/\/appdrive/],
            useCookies: true
        });
    }
    async resolveInner(_urlToResolve: string): Promise<ResolvedMediaItem | ResolvedMediaItem[]> {
        const initialResponse = await this.gotInstance(_urlToResolve);
        const canonicalUrl = initialResponse.url;
        const keyRegex = /"key", "([^"]*)"/;
        const rxvalue = keyRegex.exec(initialResponse.body);
        const key = rxvalue?.[1];

        const resp2 = await this.gotInstance.post(canonicalUrl, {
            form: {
                action: 'direct',
                key: key,
                action_token: ''
            },
            headers: {
                'x-token': new URL(canonicalUrl).hostname,
                'Referer': canonicalUrl
            }
        }).json<{ url: string; }>();

        const resp3 = await this.gotInstance(resp2.url);
        const gdlink = this.scrapeLinkHref(resp3.body, '#gdlink');
        const urlRegex = /worker_url\s*=\s*'(https:\/\/[^']+)'/;
        const rx3respo = urlRegex.exec(resp3.body);
        const workersDev = rx3respo?.[1];
        const linksToReturn = [];
        if (gdlink) {
            linksToReturn.push({ link: gdlink, title: 'workers', parent: _urlToResolve } as ResolvedMediaItem);
        }
        if (workersDev) {
            linksToReturn.push({ link: workersDev, title: 'drive', parent: _urlToResolve } as ResolvedMediaItem);
        }
        return linksToReturn;
    }
}
