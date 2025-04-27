import { BaseUrlResolver, ResolvedMediaItem } from "../BaseResolver.js";

export class nexdriveResolver extends BaseUrlResolver {
    constructor() {
        super({
            domains: [/https?:\/\/nexdrive/],
            speedRank: 70
        });
    }

    async resolveInner(_urlToResolve: string): Promise<ResolvedMediaItem[]> {
        const response = await this.gotInstance(_urlToResolve);        
        return this.scrapeAllLinks(response.body, '.entry-inner');
    }
}
