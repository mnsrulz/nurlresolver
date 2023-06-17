import { BaseUrlResolver, ResolvedMediaItem } from "../BaseResolver.js";
import { URL } from 'url';

export class gdflixResolver extends BaseUrlResolver {
    constructor() {
        super({
            domains: [/https?:\/\/gdflix/],
            speedRank: 95,
            useCookies: true
        });
    }

    async resolveInner(_urlToResolve: string): Promise<ResolvedMediaItem[]> {
        const u = new URL(_urlToResolve);
        const response = await this.gotInstance(_urlToResolve);
        const fileid = u.pathname.split('/')[2];
        const newurl = `https://${u.hostname}/file/${fileid}`;
        const regexToFindKey = /formData.append\("key", "([^"]*)"/;
        const regexToFindKeyResult = regexToFindKey.exec(response.body);
        const formToPost = {
            action: 'direct',
            key: `${regexToFindKeyResult?.[1]}`,
            action_token: ''
        };
        const response2 = await this.gotInstance.post(newurl, {
            form: formToPost,
            headers: {
                'x-token': u.hostname,
                'Referer': u.href
            },
            throwHttpErrors: false
        }).json<{ error: boolean; url: string; }>();
        if (!response2.error) {
            const response3 = await this.gotInstance(response2.url);
            const gdurl = this.scrapeLinkHref(response3.body, '#gdlink');
            //console.log(gdurl);
            const result = await this._context?.resolveRecursive(gdurl, this._resolverOptions);
            //alright so here we construct two result one for gdflix and one for google drive
            if (result && result.length > 0) {
                const clonedResult = Object.assign({}, result[0]);
                clonedResult.parent = _urlToResolve;
                return [clonedResult, ...result];
            }
        }
        return [];
    }

    async fillMetaInfo(resolveMediaItem: ResolvedMediaItem): Promise<void> {
        //do nothing...
    }
}
