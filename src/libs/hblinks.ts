import { BaseUrlResolver, ResolvedMediaItem } from "../BaseResolver";

export class HblinksResolver extends BaseUrlResolver {
    constructor() {
        super({
            domains: [/https?:\/\/hblinks/]
        });
    }

    async resolveInner(_urlToResolve: string): Promise<ResolvedMediaItem[]> {
        const regex_links = /https?:\/\/(hblinks|hdhub4u)/gi;
        const result = await this.xInstance(_urlToResolve, {
            titles: ['a'],
            links: ['a@href']
        }) as { titles: string[], links: string[] };
        return result.links.map((link, ix) => {
            return { link, title: result.titles[ix] } as ResolvedMediaItem;
        }).filter(l => !l.link.match(regex_links));        
    }
}