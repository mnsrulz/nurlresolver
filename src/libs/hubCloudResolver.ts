import { BaseUrlResolver, ResolvedMediaItem } from "../BaseResolver.js";

const cleanupLinks = (links: ResolvedMediaItem[]) => {
    const mappedLinks = []
    for (const link of links) {
        const { hostname } = new URL(link.link);
        if (['tinyurl.com', 'www.google.com', 't.me', 'www-google-com.cdn.ampproject.org', 'one.one.one.one'].includes(hostname)) continue;
        mappedLinks.push(link);
    }
    return mappedLinks;
}
export class HubCloudResolver extends BaseUrlResolver {

    constructor() {
        super({
            domains: [/https?:\/\/(hubcloud)/],
            speedRank: 90
        });
    }

    async resolveInner(_urlToResolve: string): Promise<ResolvedMediaItem[]> {
        let response = await this.gotInstance(_urlToResolve);
        const redirectUrl = this.parseElementAttributes(response.body, 'META[HTTP-EQUIV=refresh]', 'content').at(0)?.split('=').at(1);

        if (redirectUrl) {
            response = await this.gotInstance(redirectUrl);
        }

        let link = this.scrapeLinkHref(response.body, '.vd a');
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
            return cleanupLinks(result_01);
        }

        const result = {
            link,
            title,
            isPlayable: true
        } as ResolvedMediaItem;
        return [result];
    }


}
