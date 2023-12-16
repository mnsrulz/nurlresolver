import { BaseUrlResolver, ResolvedMediaItem } from "../BaseResolver.js";
export class streamhubResolver extends BaseUrlResolver {
    constructor() {
        super({
            domains: [/https?:\/\/streamhub/],
            useCookies: true,
            speedRank: 90
        });
    }

    async resolveInner(_urlToResolve: string): Promise<ResolvedMediaItem | ResolvedMediaItem[]> {
        const u = new URL(_urlToResolve);
        const fileid = u.pathname.split('/').pop();
        u.pathname = `/d/${fileid}_n`;
        const response = await this.gotInstance(u.href);
        await this.wait(1000);
        const response2 = await this.postHiddenForm(u.href, response.body);
        const link  = this.scrapeLinkHref(response2, '.btn-primary');
        if(link){
            const title = this.extractFileNameFromUrl(link)
            return  {
                link,
                title,
                isPlayable: true
            } as ResolvedMediaItem;   
        }
        return [];
    }
}