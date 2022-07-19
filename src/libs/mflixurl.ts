import { BaseUrlResolver, ResolvedMediaItem } from "../BaseResolver";

export class mflixUrlResolver extends BaseUrlResolver {
    constructor() {
        super({
            domains: [/https?:\/\/mflixurl/]
        });
    }

    async resolveInner(_urlToResolve: string): Promise<ResolvedMediaItem[]> {
        const response = await this.gotInstance(_urlToResolve);
        const links = this.scrapeAllLinks(response.body, 'center', response.url);
        return links;
    }
}

