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
        const roboLinkText = this.scrapeInnerText(response2.body, '#norobotlink');
        const roboLink = `https:/${roboLinkText}`;
        const parsedUrl = new URL(roboLink);
        const searchParams = parsedUrl.searchParams;
        const rx = /document\.getElementById\('ideoooolink'\)\.innerHTML.*token=([^']*)/g
        const tokenRxResult = rx.exec(response2.body);
        const token = tokenRxResult?.[1];
        if (token) {
            searchParams.set('token', token);
            const link = `${parsedUrl.origin}${parsedUrl.pathname}?${searchParams.toString()}&dl=1`;
            const result = { link, title, isPlayable: true } as ResolvedMediaItem;
            return [result];
        }
        return [];
    }
}
