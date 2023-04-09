import { BaseUrlResolver, ResolvedMediaItem } from "../BaseResolver.js";

export class CrnewsResolver extends BaseUrlResolver {
    constructor() {
        super({
            domains: [/https?:\/\/(cr-news|solarsystem)/]
        });
    }

    async resolveInner(_urlToResolve: string): Promise<ResolvedMediaItem[]> {
        return []; //non working
        // var obj = await this.xInstance(_urlToResolve, 'div#wpsafe-link', 'a@href');
        // var u = new URL(obj);
        // var result = { link: u.searchParams.get('safelink_redirect') } as ResolvedMediaItem;
        // return [result];
    }
}