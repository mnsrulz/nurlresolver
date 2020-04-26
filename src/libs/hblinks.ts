import { BaseUrlResolver, ResolvedMediaItem } from "../BaseResolver";

export class HblinksResolver extends BaseUrlResolver {
    constructor() {
        super({
            domains: [/https?:\/\/hblinks/]
        });
    }

    async resolveInner(_urlToResolve: string): Promise<ResolvedMediaItem[]> {
        const regex_links = /https?:\/\/(hblinks|hdhub4u)/gi;
        const links = await this.xInstance(_urlToResolve, {
            title: ['a'],
            link: ['a@href']
        }) as ResolvedMediaItem[];
        return links.filter(l => l.link.match(regex_links) === null);
    }
}