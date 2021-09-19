import { BaseUrlResolver, ResolvedMediaItem } from "../BaseResolver";


export class HubCloudResolver extends BaseUrlResolver {

    constructor() {
        super({
            domains: [/https?:\/\/(hubcloud.link)/],
            speedRank: 90
        });
    }

    async resolveInner(_urlToResolve: string): Promise<ResolvedMediaItem[]> {
        const response = await this.gotInstance(_urlToResolve);
        const link = this.scrapeLinkHref(response.body, 'a#download');
        const title = this.extractFileNameFromUrl(link);
        const result = {
            link,
            title,
            isPlayable: true
        } as ResolvedMediaItem;
        return [result];
    }
}
