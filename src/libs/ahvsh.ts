import { BaseUrlResolver, ResolvedMediaItem } from "../BaseResolver.js";
import { URL } from 'url';

export class ahvshResolver extends BaseUrlResolver {
    constructor() {
        super({
            domains: [/https?:\/\/ahvsh\.com/],
            speedRank: 80,
            useCookies: true
        });
    }

    async resolveInner(_urlToResolve: string): Promise<ResolvedMediaItem[]> {
        const links = [];
        const mediaIdRegex = /ahvsh\.com\/(w|d)\/([0-9A-Za-z]+)/g;
        const videoId = mediaIdRegex.exec(_urlToResolve)?.[2];
        const normalizedUrl = `http://ahvsh.com/d/${videoId}_h`;
        const initialResponse = await this.gotInstance(normalizedUrl);
        //submit-btn
        const response = await this.postHiddenForm(initialResponse.url, initialResponse.body);
        const fileLink = this.scrapeLinkHref(response, '.submit-btn');
        if (fileLink) {
            const title = this.extractFileNameFromUrl(fileLink);
            const link = new URL(fileLink, normalizedUrl).href;
            const result = { title, link, isPlayable: true } as ResolvedMediaItem;
            result.headers = { "referer": normalizedUrl };
            links.push(result);
        }

        return links;
    }
}
