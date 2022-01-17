import { BaseUrlResolver, ResolvedMediaItem } from "../BaseResolver";

export class VideobinResolver extends BaseUrlResolver {
    constructor() {
        super({
            domains: [/https?:\/\/(videobin)/],
            useCookies: true,
            speedRank: 50
        });
    }

    async resolveInner(_urlToResolve: string): Promise<ResolvedMediaItem | ResolvedMediaItem[]> {
        const response = await this.gotInstance(_urlToResolve);
        const matches = /sources: \[([^\]]*)/.exec(response.body);
        const hrefmatches = matches?.[1].match(/http[^"]*/g);
        const resultoreturn = [];
        if (hrefmatches) {
            for (const link of hrefmatches) {
                if (link.indexOf('m3u8') > 0) continue;
                const title = this.extractFileNameFromUrl(link);
                const result = {
                    link,
                    title,
                    isPlayable: true
                } as ResolvedMediaItem;
                resultoreturn.push(result);
            }
        }
        return resultoreturn;
    }
}
