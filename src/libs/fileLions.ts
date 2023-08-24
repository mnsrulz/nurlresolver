import { BaseUrlResolver, ResolvedMediaItem } from "../BaseResolver.js";

export class fileLionsResolver extends BaseUrlResolver {
    constructor() {
        super({
            domains: [/https?:\/\/(filelions|embedwish)/],
            useCookies: true,
            speedRank: 70
        });
    }

    async resolveInner(_urlToResolve: string): Promise<ResolvedMediaItem | ResolvedMediaItem[]> {
        //this site requires google verification.. leaving it here just for future ref
        return [];
        // const u = new URL(_urlToResolve);
        // const fileid = u.pathname.split('/').pop();
        // u.pathname = `d/${fileid}_n`;
        // const response = await this.gotInstance(u.href);
        // const resp2 = await this.postHiddenForm(response.url, response.body);
        // console.log(resp2);

        // const link = this.scrapeLinkHref(resp2, '.text-center a');
        // if (link) {
        //     const title = this.extractFileNameFromUrl(link);
        //     const result = {
        //         link,
        //         title,
        //         isPlayable: true
        //     } as ResolvedMediaItem;
        //     return [result];
        // }
        // return [];
    }
}
