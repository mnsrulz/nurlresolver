import { BaseUrlResolver, ResolvedMediaItem } from "../BaseResolver";

export class DoodResolver extends BaseUrlResolver {
    constructor() {
        super({
            domains: [/https?:\/\/dood/],
            speedRank: 55
        });
    }

    async resolveInner(_urlToResolve: string): Promise<ResolvedMediaItem[]> {
        var result = await this.xInstance(_urlToResolve, {
            title: 'title',
            link: 'div.download-content a@href'
        }) as ResolvedMediaItem;
        await this.wait(1000);  //lets wait for one second.
        var downloadLinkPage = await this.gotInstance(result.link);
        var contentPage = downloadLinkPage.body;
        const regex01 = /window\.open\('(https[^']*)'/
        var finalDownloadLink = regex01.exec(contentPage)![1];
        result.isPlayable = true;
        result.title = this.extractFileNameFromUrl(finalDownloadLink);
        result.link = finalDownloadLink;
        result.headers = { "referer": _urlToResolve };
        return [result];
    }
}