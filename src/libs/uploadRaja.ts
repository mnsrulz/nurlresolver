import { BaseUrlResolver, ResolvedMediaItem } from "../BaseResolver";

export class UploadRajaResolver extends BaseUrlResolver {
    constructor() {
        super({
            domains: [/https?:\/\/uploadraja/]
        });
    }

    async resolveInner(_urlToResolve: string): Promise<ResolvedMediaItem[]> {
        const response = await this.gotInstance(_urlToResolve);
        const response2Body = await this.postHiddenForm(response.url, response.body);
        var result = await this.xInstance(response2Body, { link: 'a.download@href'}) as ResolvedMediaItem;
        result.title = this.extractFileNameFromUrl(result.link);
        result.isPlayable = true;
        return [result];
    }
}