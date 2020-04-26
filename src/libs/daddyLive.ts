import { BaseUrlResolver, ResolvedMediaItem } from "../BaseResolver";

export class DaddyliveResolver extends BaseUrlResolver {
    constructor() {
        super({
            domains: [/https?:\/\/daddylive/]
        });
    }

    async resolveInner(_urlToResolve: string): Promise<ResolvedMediaItem[]> {
        const rx = /https:\/\/daddylive/
        var results = await this.xInstance(_urlToResolve, {
            title: ['iframe@src'], link: ['iframe@src']
        }) as ResolvedMediaItem[];
        return results.filter(x => !rx.exec(x.link));
    }
}