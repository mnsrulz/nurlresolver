import { BaseUrlResolver, ResolvedMediaItem } from "../BaseResolver";


export class UploadhubResolver extends BaseUrlResolver {
    constructor() {
        super({
            domains: [/https?:\/\/(uploadhub.ws)/],
            useCookies: true,
            speedRank: 90
        });
    }

    async resolveInner(_urlToResolve: string): Promise<ResolvedMediaItem[]> {
        const response = await this.gotInstance(_urlToResolve);        
        const response2Body = await this.postHiddenForm(response.url, response.body);
        var link = await this.xInstance(response2Body, '#direct_link', 'a@href');
        const title = this.extractFileNameFromUrl(link);
        const result = {
            link,
            title,
            isPlayable: true
        } as ResolvedMediaItem;
        return [result];
    }
}
