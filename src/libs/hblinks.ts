import { BaseUrlResolver, ResolvedMediaItem } from "../BaseResolver";

export class HblinksResolver extends BaseUrlResolver {
    constructor() {
        super({
            domains: [/https?:\/\/hblinks/]
        });
    }

    async resolveInner(_urlToResolve: string): Promise<ResolvedMediaItem[]> {
        const regex_links = /https?:\/\/(hblinks|hdhub4u)/gi;
        const response = await this.gotInstance(_urlToResolve);
        const result = this.scrapeAllLinks(response.body, '.entry-content');
        return result
            .filter(l => l.link && !l.link.match(regex_links));
    }
}