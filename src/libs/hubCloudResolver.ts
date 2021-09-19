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
        let link = this.scrapeLinkHref(response.body, 'a#download');
        if (!link) {
            const regex01 = /var url = '(https[^']*)';/g
            const regex01Result = regex01.exec(response.body);
            link = regex01Result![1];
        }
        const title = this.extractFileNameFromUrl(link);
        const result = {
            link,
            title,
            isPlayable: true
        } as ResolvedMediaItem;
        return [result];
    }
}
