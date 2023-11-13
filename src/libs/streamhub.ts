import { BaseUrlResolver, ResolvedMediaItem } from "../BaseResolver.js";
import { detect, unpack } from 'unpacker';
export class streamhubResolver extends BaseUrlResolver {
    constructor() {
        super({
            domains: [/https?:\/\/streamhub/],
            useCookies: true,
            speedRank: 90
        });
    }

    async resolveInner(_urlToResolve: string): Promise<ResolvedMediaItem | ResolvedMediaItem[]> {
        const u = new URL(_urlToResolve);
        const fileid = u.pathname.split('/').pop();
        u.pathname = `${fileid}`;
        const response = await this.gotInstance(u.href);
        const allScripts = this.parseScripts(response.body);

        for (const sc of allScripts) {
            if (detect(sc)) {
                const up = unpack(sc);
                const rxs = /src:"([^"]*)"/.exec(up);
                const link = rxs?.[1];
                console.log(link);
                if (link) {
                    const title = `${this.scrapePageTitle(response.body)}.mp4`;
                    const result = {
                        link,
                        title,
                        isPlayable: true
                    } as ResolvedMediaItem;
                    return [result];
                }
            }
        }

        return [];
    }
}
