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

        //in linkrit pages it doesn't always ask to verify
        let links = await this.xInstance(response.body, '.view-well a', [{
            title: '@href',
            link: '@text'
        }]) as ResolvedMediaItem[];
        if (links && links.length > 0) return links;

        const response2Body = await this.postHiddenForm(_urlToResolve, response.body);
        links = await this.xInstance(response2Body, '.view-well a', [{
            title: '@href',
            link: '@text'
        }]) as ResolvedMediaItem[];
        return links;
    }
}