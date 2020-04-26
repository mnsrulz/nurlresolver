import { BaseUrlResolver, ResolvedMediaItem } from "../BaseResolver";

class WicketResolver extends BaseUrlResolver {
    constructor() {
        super({
            domains: [/https?:\/\/wicket/]
        });
    }

    async resolveInner(_urlToResolve: string): Promise<ResolvedMediaItem[]> {
        var link = await this.xInstance(_urlToResolve, 'iframe@src');
        var result = { link, title: link } as ResolvedMediaItem
        return [result];
    }
}

module.exports = WicketResolver;