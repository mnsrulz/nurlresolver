import { BaseUrlResolver, ResolvedMediaItem } from "../BaseResolver.js";
export class WicketResolver extends BaseUrlResolver {
    constructor() {
        super({
            domains: [/https?:\/\/wicket/]
        });
    }

    async resolveInner(_urlToResolve: string): Promise<ResolvedMediaItem[]> {
        const { data } = await this.scrapeItAsync(_urlToResolve, {
            output: {
                selector: 'iframe',
                attr: 'src'
            }
        });
        const { output } = data as { output: string };
        const result = { link: output, title: output } as ResolvedMediaItem;
        return [result];
    }
}