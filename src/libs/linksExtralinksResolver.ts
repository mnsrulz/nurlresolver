import { BaseUrlResolver, ResolvedMediaItem } from "../BaseResolver.js";

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
            if (link) {
                x.link = atob(link)
            } else {
                const id = new URL(x.link, response.url).searchParams.get('id');
                if (id) {
                    const hostname = new URL(response.url).hostname.replace('links.','');
                    x.link = `https://${hostname}/view/${atob(id)}`
                }
            }
        });
        return result.filter(x => x.link.startsWith('http'));
    }
}
