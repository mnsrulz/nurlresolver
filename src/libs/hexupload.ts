import { BaseUrlResolver, ResolvedMediaItem } from "../BaseResolver";


export class hexuploadResolver extends BaseUrlResolver {
    constructor() {
        super({
            domains: [/https?:\/\/(hexupload)/],
            speedRank: 85
        });
    }

    async resolveInner(_urlToResolve: string): Promise<ResolvedMediaItem[]> {
        const response = await this.gotInstance(_urlToResolve);
        const response2 = await this.postHiddenForm(response.url, response.body, 0, false);
        const finalResponse = await this.postHiddenForm(response2.url, response2.body);
        const rx = /ldl\.ld\('([^']+)','([^']+)'/;
        const rx11 = rx.exec(finalResponse);
        if (rx11?.[1] && rx11?.[1]) {
            const link = this.nodeatob(rx11?.[1]);
            const title = this.nodeatob(rx11?.[2]);
            return [
                { link, isPlayable: true, title } as ResolvedMediaItem
            ];
        }
        return [];
    }
}
