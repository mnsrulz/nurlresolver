import { BaseUrlResolver, ResolvedMediaItem } from "../BaseResolver";

export class LinkritResolver extends BaseUrlResolver {
    constructor() {
        super({
            domains: [/https?:\/\/linkrit\.com/, /https?:\/\/extralinks/],
            useCookies: true
        });
    }

    async resolveInner(_urlToResolve: string): Promise<ResolvedMediaItem[]> {
        const response = await this.gotInstance(_urlToResolve);
        const form = await this.getHiddenForm(response.body);
        const response2 = await this.gotInstance.post(_urlToResolve, {
            body: form
        });
        const links = await this.xInstance(response2.body, '.view-well a', [{
            title: '@href',
            link: '@text'
        }]) as ResolvedMediaItem[];
        return links;
    }
}