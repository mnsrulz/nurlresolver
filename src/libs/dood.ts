import { BaseUrlResolver, ResolvedMediaItem } from "../BaseResolver.js";
export class DoodResolver extends BaseUrlResolver {
    constructor() {
        super({
            domains: [/https?:\/\/dood/],
            speedRank: 55,
            useCookies: true
        });
    }

    async resolveInner(_urlToResolve: string): Promise<ResolvedMediaItem | ResolvedMediaItem[]> {
        let finalRequestUrl = '';
        const r = await fetch(_urlToResolve).then(r => { finalRequestUrl = r.url; return r.text(); });
        await this.wait(5000);
        const b2Link = new URL(this.scrapeLinkHref(r, '.download-content a'), finalRequestUrl).href;
        const r2 = await fetch(b2Link).then(r => r.text());
        const link = /window\.open\('(http[^']*)'/.exec(r2)?.[1];
        if (link) {
            const title = this.extractFileNameFromUrl(link);
            const result = { link, title: title, isPlayable: true } as ResolvedMediaItem;
            result.headers = { 'Referer': _urlToResolve };
            return result;
        } else {
            return [];
        }
    }
}