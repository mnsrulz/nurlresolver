import { BaseUrlResolver, ResolvedMediaItem } from "../BaseResolver.js";
import * as url from 'url';
import { URL } from 'url'; 

export class hdMoviesFlixResolver extends BaseUrlResolver {
    constructor() {
        super({
            domains: [/https?:\/\/(hdmoviesflix|moviesflix|themoviesflix)/]
        });
    }

    async resolveInner(_urlToResolve: string): Promise<ResolvedMediaItem[]> {
        const u = new URL(_urlToResolve);
        if (u.pathname.endsWith('download.php')) {
            const queryData = url.parse(_urlToResolve, true).query;
            const decodeUrl = new URL(this.nodeatob(`${queryData.u}`));
            return [{ title: decodeUrl.host, link: decodeUrl.href } as ResolvedMediaItem];
        } else {
            const response = await this.gotInstance(_urlToResolve);
            const links = this.scrapeAllLinks(response.body, '.page-body');
            return links;
        }
    }
}