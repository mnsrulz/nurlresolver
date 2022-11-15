import { BaseUrlResolver, ResolvedMediaItem } from "../BaseResolver";
import * as url from 'url';

export class hdMoviesFlixResolver extends BaseUrlResolver {
    constructor() {
        super({
            domains: [/https?:\/\/hdmoviesflix/]
        });
    }

    async resolveInner(_urlToResolve: string): Promise<ResolvedMediaItem[]> {
        const u = new URL(_urlToResolve);
        if (u.pathname.endsWith('download.php')) {
            const queryData = url.parse(_urlToResolve, true).query;
            const decodeUrl = new URL(atob(`${queryData.u}`));
            return [{ title: decodeUrl.host, link: decodeUrl.href } as ResolvedMediaItem];
        } else {
            const response = await this.gotInstance(_urlToResolve);
            let links = this.scrapeAllLinks(response.body, '.mb-container');
            return links;
        }
    }
}