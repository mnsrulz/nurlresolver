import { BaseUrlResolver, ResolvedMediaItem } from "../BaseResolver";

export class ZUploadResolver extends BaseUrlResolver {
    constructor() {
        super({
            domains: [/https?:\/\/zupload.me/],
            useCookies: true,
            speedRank: 75
        });
    }

    async resolveInner(_urlToResolve: string): Promise<ResolvedMediaItem[]> {
        var links = [];
        const response = await this.gotInstance(_urlToResolve);
        const response2Body = await this.postHiddenForm(_urlToResolve, response.body, 1);
        const obj = await this.xInstance(response2Body, {
            title: 'title',
            link: 'a.link_button@href'
        }) as ResolvedMediaItem;
        obj && (obj.isPlayable = true) && (obj.title=obj.title.replace(' - Zupload.me','')) && links.push(obj);
        return links;
    }
}
