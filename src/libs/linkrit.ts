import { BaseUrlResolver, ResolvedMediaItem } from "../BaseResolver";

export class LinkritResolver extends BaseUrlResolver {
    constructor() {
        super({
            domains: [/https?:\/\/linkrit\.com/, /https?:\/\/extralinks/],
            useCookies: true
        });
    }

    async resolveInner(_urlToResolve: string): Promise<ResolvedMediaItem[]> {
        const response = await this.gotInstance(_urlToResolve);

        //in linkrit pages it doesn't always ask to verify
        let links = this.scrapeAllLinks(response.body, '.view-well');
        if (links && links.length > 0) return links;

        const response2Body = await this.postHiddenForm(_urlToResolve, response.body);
        links = this.scrapeAllLinks(response2Body, '.view-well');
        return links;
    }
}