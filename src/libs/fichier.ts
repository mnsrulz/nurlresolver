import { BaseUrlResolver, ResolvedMediaItem } from "../BaseResolver.js";

export class fichierResolver extends BaseUrlResolver {
    constructor() {
        super({
            domains: [/https?:\/\/1fichier/],
            useCookies: true,
            speedRank: 85
        });
    }

    async resolveInner(_urlToResolve: string): Promise<ResolvedMediaItem[]> {
        const response = await this.gotInstance(_urlToResolve);
        //document.querySelectorAll('.premium tr:first-child td.normal:last-child')
        const title = this.scrapeInnerText(response.body, '.premium tr:first-child td.normal:last-child');
        const response2 = await this.postHiddenForm(response.url, response.body);
        const link = this.scrapeLinkHref(response2, 'a.btn-general');
        if (link) {
            return [
                { link, isPlayable: true, title: title } as ResolvedMediaItem
            ];
        }
        return [];
    }
}
