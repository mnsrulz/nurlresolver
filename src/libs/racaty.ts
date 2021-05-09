import { BaseUrlResolver, ResolvedMediaItem } from "../BaseResolver";

export class RacatyResolver extends BaseUrlResolver {
    constructor() {
        super({
            domains: [/https?:\/\/racaty/],
            speedRank: 60
        });
    }

    async resolveInner(_urlToResolve: string): Promise<ResolvedMediaItem[]> {
        const response = await this.gotInstance(_urlToResolve);
        const response2Body = await this.postHiddenForm(response.url, response.body);
        var result = await this.xInstance(response2Body, {link: 'a#uniqueExpirylink@href'}) as ResolvedMediaItem;
        result.title = this.extractFileNameFromUrl(result.link);
        result.isPlayable = true;
        return [result];
    }
}