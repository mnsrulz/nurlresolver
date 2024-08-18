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
        let c = '';

        if (this.getHiddenForm(responsev1.body)) {
            c = await this.postHiddenForm(responsev1.url, responsev1.body);
        } else {
            c = responsev1.body;
        }
        const obj1: { links: ResolvedMediaItem[]; } = this.scrapeHtml(c, {
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