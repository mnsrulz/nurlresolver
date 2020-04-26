import { BaseUrlResolver, ResolvedMediaItem } from "../BaseResolver";

export class DoodResolver extends BaseUrlResolver {
    constructor() {
        super({
            domains: [/https?:\/\/dood/]
        });
    }

    async resolveInner(_urlToResolve: string): Promise<ResolvedMediaItem[]> {
        var result = await this.xInstance(_urlToResolve, {
            title: 'title',
            link: 'div.download-content a@href'
        }) as ResolvedMediaItem;
        this.wait(2000);
        var downloadLinkPage = await this.gotInstance(result.link);
        var contentPage = downloadLinkPage.body;
        const regex01 = /window\.open\('(https[^']*)'/
        var finalDownloadLink = regex01.exec(contentPage)![1];
        result.isPlayable = true;
        result.link = finalDownloadLink;
        result.referer = _urlToResolve;
        return [result];
    }
}