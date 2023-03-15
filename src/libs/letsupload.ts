import { BaseUrlResolver, ResolvedMediaItem } from "../BaseResolver";

export class LetsuploadResolver extends BaseUrlResolver {
    constructor() {
        super({
            domains: [/https?:\/\/letsupload/],
            useCookies: true
        });
    }

    async resolveInner(_urlToResolve: string): Promise<ResolvedMediaItem[]> {
        const links = [];
        const response = await this.gotInstance(_urlToResolve);
        const regexForInitialPage = /window.location = '([^']*)/g
        const regexForInitialPageResult = regexForInitialPage.exec(response.body);
        const link1 = regexForInitialPageResult?.[1];
        if (link1) {
            const response2 = await this.gotInstance(link1, { followRedirect: false });
            const rxFileId = /showFileInformation\(([\d]*[^\)])\)/g
            const regexForInitialPageResult = rxFileId.exec(response2.body);
            const fileId = regexForInitialPageResult?.[1];
            const finalLink = `https://letsupload.io/account/direct_download/${fileId}`;
            const resp3 = await this.gotInstance.head(finalLink, {followRedirect: false});
            if(resp3.statusCode==302 && resp3.headers.location){
                const link = resp3.headers.location;
                const title = this.extractFileNameFromUrl(link);
                const result = { link, title, isPlayable: true } as ResolvedMediaItem;
                links.push(result);
            }
        }
        return links;
    }
}