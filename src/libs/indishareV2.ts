import { BaseUrlResolver, ResolvedMediaItem } from "../BaseResolver";

export class indishareResolverV2 extends BaseUrlResolver {
    constructor() {
        super({
            domains: [/https?:\/\/dl\d{1,2}.indishare/],
            useCookies: true,
            speedRank: 55
        });
    }

    async resolveInner(_urlToResolve: string): Promise<ResolvedMediaItem[]> {
        const links: ResolvedMediaItem[] = [];
        const resp01 = await this.gotInstance(_urlToResolve, {
            throwHttpErrors: false
        });
        const link01 = this.scrapeLinkHref(resp01.body, 'section .container a');
        const resp02 = await this.gotInstance(link01);
        const links02 = this.scrapeLinkHref(resp02.body, 'body a');
        const resp03 = await this.gotInstance(links02);
        const resp04 = await this.postHiddenForm(links02, resp03.body)
        const link = this.scrapeLinkHref(resp04, '#direct_link a')
        if (link) {
            const title = this.extractFileNameFromUrl(link);
            links.push({ link, title, isPlayable: true } as ResolvedMediaItem);
        }
        return links;
    }
}