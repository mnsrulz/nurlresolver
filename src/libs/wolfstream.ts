import { BaseUrlResolver, ResolvedMediaItem } from "../BaseResolver.js";
import { URL } from 'url';

export class wolfstreamResolver extends BaseUrlResolver {
    constructor() {
        super({
            domains: [/https?:\/\/(wolfstream)/],
            speedRank: 90,
            useCookies: true
        });
    }

    async resolveInner(_urlToResolve: string): Promise<ResolvedMediaItem[]> {
        const links = [];
        const parsedUrl = new URL(_urlToResolve);
        const mediaId = parsedUrl.pathname.split('/')[1];
        const normalizedUrl = `${parsedUrl.origin}/d/${mediaId}_x`;
        const initialResponse = await this.gotInstance(normalizedUrl);
        await this.wait(2000);  //not needed always.. but keeping it to be safe
        const response = await this.postHiddenForm(initialResponse.url, initialResponse.body);
        const fileLink = this.scrapeLinkHref(response, '#container a');
        if (fileLink) {
            const title = this.extractFileNameFromUrl(fileLink);
            const result = { title, link: fileLink, isPlayable: true } as ResolvedMediaItem;
            result.headers = { "referer": normalizedUrl };
            links.push(result);
        }

        return links;
    }
}
