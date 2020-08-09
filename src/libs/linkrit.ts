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
        const response2Body = await this.postHiddenForm(_urlToResolve, response.body);
        const links = await this.xInstance(response2Body, '.view-well a', [{
            title: '@href',
            link: '@text'
        }]) as ResolvedMediaItem[];
        return links;
    }
}