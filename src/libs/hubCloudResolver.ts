import { BaseUrlResolver, ResolvedMediaItem } from "../BaseResolver.js";


export class HubCloudResolver extends BaseUrlResolver {

    constructor() {
        super({
            domains: [/https?:\/\/(hubcloud)/],
            speedRank: 90
        });
    }

    async resolveInner(_urlToResolve: string): Promise<ResolvedMediaItem[]> {
        const response = await this.gotInstance(_urlToResolve);
        let link = this.scrapeLinkHref(response.body, 'a#download');
        if (!link) {
            const regex01 = /var url = '(https[^']*)';/g
            const regex01Result = regex01.exec(response.body);
            link = regex01Result?.[1] || '';
        }

        const title = this.extractFileNameFromUrl(link);

        if (title.endsWith('.php')) {
            //it's  a redirect
            const rsp2 = await this.gotInstance(link);
            const result_01 = this.scrapeAllLinks(rsp2.body, '.card-body');
            return result_01;
        }

        const result = {
            link,
            title,
            isPlayable: true
        } as ResolvedMediaItem;
        return [result];
    }
}
