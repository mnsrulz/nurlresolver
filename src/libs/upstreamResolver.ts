import { BaseUrlResolver, ResolvedMediaItem } from "../BaseResolver.js";

export class upstreamResolver extends BaseUrlResolver {
    constructor() {
        super({
            domains: [/https?:\/\/upstream/],
            speedRank: 50,
            useCookies: true
        });
    }

    async resolveInner(_urlToResolve: string): Promise<ResolvedMediaItem | ResolvedMediaItem[]> {
        const u = new URL(_urlToResolve);
        const id = u.pathname.split('/').pop();
        u.pathname = `/d/${id}_o`;
        const response = await this.gotInstance(u.href);
        await this.wait(3000);
        const response2 = await this.postHiddenForm(response.url, response.body);
        const link = this.scrapeLinkHref(response2, '.card-body a.btn-primary');
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
