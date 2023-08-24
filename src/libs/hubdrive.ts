import { BaseUrlResolver, ResolvedMediaItem } from "../BaseResolver.js";
import { URL } from 'url';

export class hubdriveResolver extends BaseUrlResolver {
    constructor() {
        super({
            domains: [/https?:\/\/hubdrive/],
            speedRank: 95,
            useCookies: true
        });
    }

    async resolveInner(_urlToResolve: string): Promise<ResolvedMediaItem[]> {
        const u = new URL(_urlToResolve);
        await this.gotInstance(_urlToResolve);
        const fileid = u.pathname.split('/').pop();
        u.pathname = '/ajax.php';
        u.searchParams.append('ajax', 'direct-download');
        const formToPost = {
            id: parseInt(fileid || '')
        };
        const response2 = await this.gotInstance.post(u.href, {
            form: formToPost,
            headers: {
                "accept": "application/json",
                'X-Requested-With': 'XMLHttpRequest',
            },
            throwHttpErrors: false
        }).json<{ file: string }>();
        const gdriveId = response2.file.split('=').pop();
        if (gdriveId) {
            const gdurl = `https://drive.google.com/file/d/${gdriveId}`;
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
