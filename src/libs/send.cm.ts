import { BaseUrlResolver, ResolvedMediaItem } from "../BaseResolver.js";

export class SemdCmResolver extends BaseUrlResolver {
    constructor() {
        super({
            domains: [/https?:\/\/send\.cm\//],
            speedRank: 80
        });
    }

    async resolveInner(_urlToResolve: string): Promise<ResolvedMediaItem> {
        const body = await fetch(_urlToResolve).then(r => r.text());
        const link = this.parseElementAttributes(body, '#vjsplayer source', 'src')[0];
        const title = this.extractFileNameFromUrl(link);
        const result = { link, title, isPlayable: true } as ResolvedMediaItem;
        result.headers = { 'referer': _urlToResolve };
        return result;
    }
}