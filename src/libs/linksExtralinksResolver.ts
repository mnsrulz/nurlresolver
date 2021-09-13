import { BaseUrlResolver, ResolvedMediaItem } from "../BaseResolver";

export class LinksExtralinksResolver extends BaseUrlResolver {
    constructor() {
        super({
            domains: [/https?:\/\/links\.extralinks/]
        });
    }

    async resolveInner(_urlToResolve: string): Promise<ResolvedMediaItem[]> {
        const result = await this.xInstance(_urlToResolve, '.entry-content a', [{
            link: '@href',
            title: '@text'
        }]) as ResolvedMediaItem[];
        return result;
    }
}
