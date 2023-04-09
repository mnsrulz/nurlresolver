import { BaseUrlResolver, ResolvedMediaItem } from "../BaseResolver.js";

export class ZUploadResolver extends BaseUrlResolver {
    constructor() {
        super({
            domains: [/https?:\/\/zupload.me/],
            useCookies: true,
            speedRank: 75
        });
    }

    async resolveInner(_urlToResolve: string): Promise<ResolvedMediaItem[]> {
        const links = [];
        const response = await this.gotInstance(_urlToResolve);
        const response2Body = await this.postHiddenForm(_urlToResolve, response.body, 1);
        const obj = this.scrapeHtml(response2Body, {
            title: 'title',
            link: {
                selector: 'a.link_button',
                attr: 'href'
            }
        }) as ResolvedMediaItem;
        obj && (obj.isPlayable = true) && (obj.title = obj.title.replace(' - Zupload.me', '')) && links.push(obj);
        return links;
    }
}
