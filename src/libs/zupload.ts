import { BaseUrlResolver, ResolvedMediaItem, IResolverOptions } from "../BaseResolver";

export class ZUploadResolver extends BaseUrlResolver {
    constructor() {
        super(<IResolverOptions>{
            domains: [/https?:\/\/zupload.me/],
            useCookies: true
        });
    }

    async resolveInner(_urlToResolve: string): Promise<ResolvedMediaItem[]> {
        var links = [];
        const response = await this.gotInstance(_urlToResolve);
        const formtopost = await this.getHiddenForm(response.body, 1);
        const anotherresponse = await this.gotInstance.post(_urlToResolve, {
            body: formtopost
        });
        const obj = await this.xInstance(anotherresponse.body, {
            title: 'title',
            link: 'a.link_button@href'
        }) as ResolvedMediaItem;
        obj && (obj.isPlayable = true) && links.push(obj);
        return links;
    }
}
