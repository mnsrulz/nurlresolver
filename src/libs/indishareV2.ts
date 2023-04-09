import { BaseUrlResolver, ResolvedMediaItem } from "../BaseResolver.js";

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
        const rx = /location\.replace\('(http[^']*)'/;
        const rxresult = rx.exec(resp02.body);
        const link02 = rxresult![1];
        const resp03 = await this.gotInstance(link02);
        const formResult = await this.postHiddenForm(resp03.url, resp03.body);
        const link = this.scrapeLinkHref(formResult, '#direct_link a')

        if (link) {
            const title = this.extractFileNameFromUrl(link);
            links.push({ link, title, isPlayable: true } as ResolvedMediaItem);
        }
        return links;
    }
}