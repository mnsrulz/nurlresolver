import { BaseUrlResolver, ResolvedMediaItem } from "../BaseResolver";

export class LinksExtralinksResolver extends BaseUrlResolver {
    constructor() {
        super({
            domains: [/https?:\/\/links\.extralinks/]
        });
    }

    async resolveInner(_urlToResolve: string): Promise<ResolvedMediaItem[]> {
        const response = await this.gotInstance(_urlToResolve);
        return this.scrapeAllLinks(response.body, '.entry-content');        
    }
}
