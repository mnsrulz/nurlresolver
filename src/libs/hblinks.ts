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
            link: '@href',
            title: '@text'
        }]) as ResolvedMediaItem[];
        return result.filter(l => !regex_links.exec(l.link));
    }
}