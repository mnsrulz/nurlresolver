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
        u.pathname = `d/${fileid}`;
        const response = await this.gotInstance(u.href);
        await this.wait(5000);

        const resp2 = await this.postHiddenForm(response.url, response.body);

        const link = this.scrapeLinkHref(resp2, '.downloadbtn');
        if (link) {
            const title = this.extractFileNameFromUrl(link);
            const result = {
                link,
                title,
                isPlayable: true
            } as ResolvedMediaItem;
            return [result];
        }
        return [];
    }
}
