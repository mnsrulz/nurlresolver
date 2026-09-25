import { BaseUrlResolver, ResolvedMediaItem } from "../BaseResolver.js";

export class HubCloudResolver extends BaseUrlResolver {

    constructor() {
        super({
            domains: [/https?:\/\/(hubcloud)/],
            speedRank: 90
        });
    }

    async resolveInner(_urlToResolve: string): Promise<ResolvedMediaItem[]> {
        let finalUrl = _urlToResolve;
        let response = await this.gotInstance(_urlToResolve);
        const redirectUrl = this.parseElementAttributes(response.body, 'META[HTTP-EQUIV=refresh]', 'content').at(0)?.split('=').at(1);

        if (redirectUrl) {
            finalUrl = redirectUrl;
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

            const regex02 = /var pxl = "(https:\/\/pixeldrain[^"]*)";/g
            const regex02Result = regex02.exec(rsp2.body);
            const pixelDrainLink = regex02Result?.[1] || '';

            console.log('pixelDrainLink: ', pixelDrainLink);

            result_01.push({
                link: pixelDrainLink,
                title: 'PixelDrain Link'
            } as ResolvedMediaItem);

            return this.cleanupLinks(result_01).map(x => {
                const u = new URL(x.link);
                u.searchParams.append('x-nu-org', finalUrl);
                x.link = u.href;
                return x;
            });
        }

        const result = {
            link,
            title,
            isPlayable: true
        } as ResolvedMediaItem;
        return [result];
    }


}
