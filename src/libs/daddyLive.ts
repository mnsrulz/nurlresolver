import { BaseUrlResolver, ResolvedMediaItem } from "../BaseResolver";

export class DaddyliveResolver extends BaseUrlResolver {
    constructor() {
        super({
            domains: [/https?:\/\/daddylive/]
        });
    }

    async resolveInner(_urlToResolve: string): Promise<ResolvedMediaItem[]> {
        const regex_links = /https:\/\/daddylive/
        var results = await this.xInstance(_urlToResolve, {
            link: ['iframe@src']
        }) as string[];
        return results.filter(l => !l.match(regex_links)).map(link => {
            return { link, title: link } as ResolvedMediaItem
        });
    }
}