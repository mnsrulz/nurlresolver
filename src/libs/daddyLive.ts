import { BaseUrlResolver, ResolvedMediaItem } from "../BaseResolver.js";

export class DaddyliveResolver extends BaseUrlResolver {
    constructor() {
        super({
            domains: [/https?:\/\/daddylive.live\/(channels|embed)/]
        });
    }

    async resolveInner(_urlToResolve: string): Promise<ResolvedMediaItem[]> {
        return []; //non working
        // const regexForChannelId = /https:\/\/daddylive.live\/(channels|embed)\/(.*)/
        // const channelId = regexForChannelId.exec(_urlToResolve)![2];
        // const normalizedUrl = `https://daddylive.live/embed/${channelId}`;
        // var result = await this.xInstance(normalizedUrl, {
        //     link: 'iframe@src'
        // }) as ResolvedMediaItem;
        // return [result];
    }
}