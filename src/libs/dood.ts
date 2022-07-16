import { BaseUrlResolver, ResolvedMediaItem } from "../BaseResolver";

export class DoodResolver extends BaseUrlResolver {
    constructor() {
        super({
            domains: [/https?:\/\/dood/],
            speedRank: 55,
            useCookies: true
        });
    }

    async resolveInner(_urlToResolve: string): Promise<ResolvedMediaItem[]> {
        const identifier = new URL(_urlToResolve).pathname.split('/').pop();
        const result = await this.gotInstance(`https://dood.so/d/${identifier}`); //dood.so works but not watch
        await this.wait(1000);  //this could be trickier
        const allLinks = this.scrapeAllLinks(result.body, '.download-content', result.url);
        const response2 = await this.gotInstance(allLinks[0].link);
        const rx = /window\.open\('(http[^']*)'/
        const matches = rx.exec(response2.body);
        const link = matches?.[1];

        if (link) {
            const title = this.extractFileNameFromUrl(link);
            const result = { link, title: title, isPlayable: true } as ResolvedMediaItem;
            result.headers = { 'Referer': response2.url };
            return [result];
        } else {
            return [];
        }
    }
}