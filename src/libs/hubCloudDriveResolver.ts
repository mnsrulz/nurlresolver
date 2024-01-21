import { BaseUrlResolver, ResolvedMediaItem } from "../BaseResolver.js";

export class hubCloudDriveResolver extends BaseUrlResolver {
    constructor() {
        super({
            domains: [/https?:\/\/(hubcloud)\.in\/drive/],
            speedRank: 90,
            useCookies: true
        });
    }

    async resolveInner(_urlToResolve: string): Promise<ResolvedMediaItem[]> {
        const response = await this.gotInstance(_urlToResolve);
        const firstLink = this.scrapeLinkHref(response.body, '.vd a');
        const response22 = await this.gotInstance(firstLink);
        const allLinks = this.scrapeAllLinks(response22.body, 'body h2');

        return allLinks.map(x => {
            const u = new URL(x.link);
            u.searchParams.append('x-nu-org', _urlToResolve);
            x.link = u.href;
            return x;
        });
    }
}
