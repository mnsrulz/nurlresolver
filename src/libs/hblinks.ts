import { BaseUrlResolver, ResolvedMediaItem } from "../BaseResolver";

export class HblinksResolver extends BaseUrlResolver {
    constructor() {
        super({
            domains: [/https?:\/\/hblinks/]
        });
    }

    async resolveInner(_urlToResolve: string): Promise<ResolvedMediaItem[]> {
        const regex_links = /https?:\/\/(hblinks|hdhub4u)/gi;
        const result = await this.xInstance(_urlToResolve,'a', [{
            title: '@href',
            link: '@text'
        }]) as ResolvedMediaItem[];
        return result.filter(l => !l.link.match(regex_links));
    }
}