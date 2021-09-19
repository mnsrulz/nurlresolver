import { BaseUrlResolver, ResolvedMediaItem } from "../BaseResolver";

export class DlfilesResolver extends BaseUrlResolver {
    constructor() {
        super({
            domains: [/https?:\/\/dlfiles/],
            useCookies: true,
            speedRank: 55
        });
    }

    async resolveInner(_urlToResolve: string): Promise<ResolvedMediaItem[]> {
        return [];  //not working
        // const response = await this.gotInstance(_urlToResolve);
        // const response2Body = await this.postHiddenForm(_urlToResolve, response.body, 1);
        // var firstLink = await this.xInstance(response2Body, 'a.link_button@href');
        // const response3 = await this.gotInstance(firstLink);
        // var result = await this.xInstance(response3.body, { link: 'a.link_button@href', title: 'title' }) as ResolvedMediaItem;
        // result.title = result.title.replace(' - Dlfiles.online', '')
        // result.isPlayable = true;
        // result.headers = { "X-Real-IP": await this.getServerPublicIp() };   //this is the special header required (sometimes) to play this media from any ipaddresses
        // return [result];
    }
}