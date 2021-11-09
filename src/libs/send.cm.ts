import { BaseUrlResolver, ResolvedMediaItem } from "../BaseResolver";

export class SemdCmResolver extends BaseUrlResolver {
    constructor() {
        super({
            domains: [/https?:\/\/send\.cm\//],
            speedRank: 90
        });
    }

    async resolveInner(_urlToResolve: string): Promise<ResolvedMediaItem[]> {
        console.log(_urlToResolve);
        var response = await this.gotInstance(_urlToResolve);
        const { link, title } = this.scrapeHtml(response.body, {
            title: 'li.nav-item',
            link: {
                selector: 'source',
                attr: 'src'
            }
        });
        const result = {
            link,
            title,
            isPlayable: true
        } as ResolvedMediaItem;
        return [result];
    }
}