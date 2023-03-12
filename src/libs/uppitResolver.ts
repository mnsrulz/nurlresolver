import { BaseUrlResolver, ResolvedMediaItem } from "../BaseResolver";

export class uppitResolver extends BaseUrlResolver {
    constructor() {
        super({
            domains: [/https?:\/\/(uppit)/],
            speedRank: 95,
            useCookies: true
        });
    }

    async resolveInner(_urlToResolve: string): Promise<ResolvedMediaItem[]> {
        const resp = await this.gotInstance(_urlToResolve);
        const resp2 = await this.postHiddenForm(resp.url, resp.body);
        const link = this.scrapeLinkHref(resp2, '.masthead a');
        const title = this.extractFileNameFromUrl(link);
        const result = {
            isPlayable: true,
            link,
            title
        } as ResolvedMediaItem;
        return [result];
    }
}
