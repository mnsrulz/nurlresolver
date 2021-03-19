import { BaseUrlResolver, ResolvedMediaItem } from "../BaseResolver";


export class HubCloudResolver extends BaseUrlResolver {

    constructor() {
        super({
            domains: [/https?:\/\/(hubcloud.link)/]
        });
    }

    async resolveInner(_urlToResolve: string): Promise<ResolvedMediaItem[]> {
        const response = await this.gotInstance(_urlToResolve);
        var link = await this.xInstance(response.body, 'a#download@href');
        const title = this.extractFileNameFromUrl(link);
        const result = {
            link,
            title,
            isPlayable: true
        } as ResolvedMediaItem;
        return [result];
    }
}
