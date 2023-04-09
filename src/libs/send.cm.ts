import { BaseUrlResolver, ResolvedMediaItem } from "../BaseResolver.js";

export class SemdCmResolver extends BaseUrlResolver {
    constructor() {
        super({
            domains: [/https?:\/\/send\.cm\//],
            speedRank: 80
        });
    }

    async resolveInner(_urlToResolve: string): Promise<ResolvedMediaItem[]> {
        const results = [];
        const response = await this.gotInstance(_urlToResolve);
        const { headers } = await this.postHiddenForm('https://send.cm', response.body, 0, false);
        if (headers.location) {
            const link = headers.location;
            const title = this.extractFileNameFromUrl(link);
            const result = {
                link,
                title,
                isPlayable: true
            } as ResolvedMediaItem;
            result.headers = { 'referer': _urlToResolve };
            results.push(result);
        }
        return results;
    }
}