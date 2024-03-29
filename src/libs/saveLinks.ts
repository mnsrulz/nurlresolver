import { BaseUrlResolver, ResolvedMediaItem } from "../BaseResolver.js";

export class SaveLinksResolver extends BaseUrlResolver {
    constructor() {
        super({
            domains: [/https?:\/\/savelinks/],
            useCookies: true
        });
    }
    async resolveInner(_urlToResolve: string): Promise<ResolvedMediaItem | ResolvedMediaItem[]> {
        const canonicalUrl = new URL(_urlToResolve);
        canonicalUrl.hostname = 'savelinks.me';
        const responsev1 = await this.gotInstance(canonicalUrl.href);
        const fomruploadresp = await this.postHiddenForm(responsev1.url, responsev1.body);
        const obj1: { links: ResolvedMediaItem[]; } = this.scrapeHtml(fomruploadresp, {
            links: {
                listItem: '.view-well a',
                data: {
                    link: { attr: 'href' },
                    title: ''
                }
            }
        });
        return obj1.links;
    }
}
