import { BaseUrlResolver, ResolvedMediaItem } from "../BaseResolver";


export class streamtapeResolver extends BaseUrlResolver {
    constructor() {
        super({
            domains: [/https?:\/\/streamtape/],
            speedRank: 90,
            useCookies: true
        });
    }

    async resolveInner(_urlToResolve: string): Promise<ResolvedMediaItem[]> {
        const initialUrl = new URL(_urlToResolve);
        initialUrl.pathname = initialUrl.pathname.replace('/e/', '/v/'); //replace the embed video to download link
        const response2 = await this.gotInstance(initialUrl.href);
        const title = this.scrapeInnerText(response2.body, '.video-title h2');
        const roboLink = this.scrapeInnerText(response2.body, '#norobotlink');
        if (roboLink) {
            const link = `https:/${roboLink}&dl=1`;
            console.log(link);
            const result = { link, title, isPlayable: true } as ResolvedMediaItem;
            return [result];
        }
        return [];
    }
}
