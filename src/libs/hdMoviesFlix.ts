import { BaseUrlResolver, ResolvedMediaItem } from "../BaseResolver";

export class hdMoviesFlixResolver extends BaseUrlResolver {
    constructor() {
        super({
            domains: [/https?:\/\/hdmoviesflix/]
        });
    }

    async resolveInner(_urlToResolve: string): Promise<ResolvedMediaItem[]> {
        const response = await this.gotInstance(_urlToResolve);
        let links = this.scrapeAllLinks(response.body, '.mb-container');
        return links;
    }
}