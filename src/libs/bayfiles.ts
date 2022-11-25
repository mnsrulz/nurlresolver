import { BaseUrlResolver, ResolvedMediaItem } from "../BaseResolver";

export class bayfilesResolver extends BaseUrlResolver {
    constructor() {
        super({
            domains: [/https?:\/\/(bayfiles|anonfiles)/],
            speedRank: 70
        });
    }

    async resolveInner(_urlToResolve: string): Promise<ResolvedMediaItem[]> {
        const response = await this.gotInstance(_urlToResolve);
        const link = this.scrapeLinkHref(response.body, '#download-url');
        //console.log(link);
        if (link) {
            const title = this.extractFileNameFromUrl(link);
            return [
                { link, isPlayable: true, title } as ResolvedMediaItem
            ];
        }
        return [];
    }
}
