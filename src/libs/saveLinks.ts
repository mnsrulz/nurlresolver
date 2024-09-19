import { BaseUrlResolver, ResolvedMediaItem } from "../BaseResolver.js";
import { parseHiddenForm } from "../utils/helper.js";

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
            const { action } = parseHiddenForm(responsev1.body);
            let response2 = await this.postHiddenForm(action, responsev1.body, 0, false);
            if (response2.statusCode == 302) {
                const newloc = response2.headers.location;
                if (newloc) {
                    c = await this.gotInstance(newloc, { resolveBodyOnly: true });
                }
            }
        } else {
            c = responsev1.body;
        }
        const obj1: { links: ResolvedMediaItem[]; } = this.scrapeHtml(c, {
            links: {
                listItem: '.container .list-none a',
                data: {
                    link: { attr: 'href' },
                    title: ''
                }
            }
        });
        return obj1.links;
    }
}