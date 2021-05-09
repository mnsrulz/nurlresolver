import { BaseUrlResolver, ResolvedMediaItem } from "../BaseResolver";


export class DesiuploadResolver extends BaseUrlResolver {
    constructor() {
        super({
            domains: [/https?:\/\/(dl\d{0,}.desiupload)/],
            useCookies: true,
            speedRank: 55
        });
    }

    async resolveInner(_urlToResolve: string): Promise<ResolvedMediaItem[]> {
        const response = await this.gotInstance(_urlToResolve);
        const response2Body = await this.postHiddenForm(response.url, response.body, 1);
        var link = await this.xInstance(response2Body, '.downloadbtn', 'a@href');
        const title = this.extractFileNameFromUrl(link);
        const result = {
            link,
            title,
            isPlayable: true
        } as ResolvedMediaItem;
        return [result];
    }
}
