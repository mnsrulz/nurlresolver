import { BaseUrlResolver, ResolvedMediaItem } from "../BaseResolver.js";



export class AllLinksHubResolver extends BaseUrlResolver {
    constructor() {
        super({
            domains: [/https?:\/\/link\.allinkshub/],
            useCookies: true
        });
    }
    async resolveInner(_urlToResolve: string): Promise<ResolvedMediaItem | ResolvedMediaItem[]> {
        const responsev1 = await this.gotInstance(_urlToResolve);
        const al = this.parseAllLinks(responsev1.body, '.entry-content');
        return al.map(m => {
            const link = this.nodeatob(new URL(m.link).searchParams.get('id') || '');
            const title = m.title;
            return { link, title, parent: _urlToResolve } as ResolvedMediaItem;
        });
    }
}
