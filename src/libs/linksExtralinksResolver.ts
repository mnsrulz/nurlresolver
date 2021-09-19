import { BaseUrlResolver, ResolvedMediaItem } from "../BaseResolver";

export class LinksExtralinksResolver extends BaseUrlResolver {
    constructor() {
        super({
            domains: [/https?:\/\/links\.extralinks/]
        });
    }

    async resolveInner(_urlToResolve: string): Promise<ResolvedMediaItem[]> {
        const response = await this.gotInstance(_urlToResolve);
        const result = this.scrapeAllLinks(response.body, '.entry-content');
        result.forEach(x => {
            //find the link query param and extract result
            const link = new URL(x.link, response.url).searchParams.get('link');
            link && (x.link = this.nodeatob(link));
        });
        return result.filter(x=>x.link.startsWith('http'));
    }
}
