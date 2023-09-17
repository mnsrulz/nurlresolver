import { BaseUrlResolver, ResolvedMediaItem } from "../BaseResolver.js";

export class streamvidResolver extends BaseUrlResolver {
    constructor() {
        super({
            domains: [/https?:\/\/streamvid/],
            speedRank: 80,
            useCookies: true
        });
    }

    async resolveInner(_urlToResolve: string): Promise<ResolvedMediaItem | ResolvedMediaItem[]> {
        const u = new URL(_urlToResolve);
        const id = u.pathname.split('/').pop();
        u.pathname = `/d/${id}_o`;
        const response = await this.gotInstance(u.href);
        const response2 = await this.postHiddenForm(response.url, response.body);
        const scriptTag = this.parseScripts(response2).find(s => s.includes('StartDownload')) || '';
        const link = /document\.location\.href="([^"]*)"/.exec(scriptTag)?.[1]
        if (link) {
            const title = this.extractFileNameFromUrl(link);
            const result = {
                link,
                title,
                isPlayable: true
            } as ResolvedMediaItem;
            return result;
        }
        return [];
    }
}
