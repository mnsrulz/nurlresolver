import { BaseUrlResolver, ResolvedMediaItem } from "../BaseResolver.js";

export class UploadFlixResolver extends BaseUrlResolver {
    constructor() {
        super({
            domains: [/https?:\/\/(dl\.)?uploadflix/],
            speedRank: 85
        });
    }

    async resolveInner(_urlToResolve: string): Promise<ResolvedMediaItem[] | ResolvedMediaItem> {
        const resp = await this.gotInstance(_urlToResolve);
        const link = this.scrapeLinkHref(resp.body, '.download a');
        if(link){
            const title = this.extractFileNameFromUrl(link)
            return  {
                link,
                title,
                isPlayable: true
            } as ResolvedMediaItem;   
        }
        return [];
    }
}