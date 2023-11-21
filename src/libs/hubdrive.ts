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

    async resolveInner(_urlToResolve: string): Promise<ResolvedMediaItem | ResolvedMediaItem[]> {
        const u = new URL(_urlToResolve);
        await this.gotInstance(_urlToResolve);
        const resp1 = await this.gotInstance(_urlToResolve);
        const title = this.scrapePageTitle(resp1.body);
        const fileid = u.pathname.split('/').pop();
        u.pathname = '/ajax.php';
        u.searchParams.append('ajax', 'direct-download');
        const formToPost = {
            id: parseInt(fileid || '')
        };
        const { file, code } = await this.gotInstance.post(u.href, {
            form: formToPost,
            headers: {
                "accept": "application/json",
                'X-Requested-With': 'XMLHttpRequest',
            },
            throwHttpErrors: false
        }).json<{ file: string, code: string }>();

        if (file && code == '200') {
            const resp2 = await this.gotInstance(new URL(file, u.origin));
            const link = this.scrapeLinkHref(resp2.body, '.card-body .btn-primary');

            if (link) {
                return { link, title, isPlayable: true } as ResolvedMediaItem;
            }
        }
        return [];
    }
}
