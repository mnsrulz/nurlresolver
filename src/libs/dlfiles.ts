import { BaseUrlResolver, ResolvedMediaItem } from "../BaseResolver";

export class DlfilesResolver extends BaseUrlResolver {
    constructor() {
        super({
            domains: [/https?:\/\/dlfiles/],
            useCookies: true
        });
    }

    async resolveInner(_urlToResolve: string): Promise<ResolvedMediaItem[]> {
        const response = await this.gotInstance(_urlToResolve);
        const form = await this.getHiddenForm(response.body, 1);
        const response2 = await this.gotInstance.post(_urlToResolve, {
            body: form
        });
        var firstLink = await this.xInstance(response2.body, 'a.link_button@href');
        const response3 = await this.gotInstance(firstLink);
        var result = await this.xInstance(response3.body, { link: 'a.link_button@href', title: 'title' }) as ResolvedMediaItem;
        result.title = result.title.replace(' - Dlfiles.online', '')
        result.isPlayable = true;
        return [result];
    }
}