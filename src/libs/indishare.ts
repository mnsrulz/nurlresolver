import { BaseUrlResolver, ResolvedMediaItem } from "../BaseResolver";

export class IndishareResolver extends BaseUrlResolver {
    constructor() {
        super({
            domains: [/https?:\/\/www\.indishare/],
            useCookies: true
        });
    }

    async canResolve(_urlToResolve: string): Promise<boolean> {
        return this.getSecondLevelDomain(_urlToResolve) === 'indishare';
    }

    async resolveInner(_urlToResolve: string): Promise<ResolvedMediaItem[]> {
        let links = [];
        const response = await this.gotInstance(_urlToResolve);
        const response2 = await this.postHiddenForm(response.url, response.body);

        if (response2) {
            var link = await this.xInstance(response2, 'span#direct_link', 'a@href');
            const title = this.extractFileNameFromUrl(link);
            var result = <ResolvedMediaItem>{ link, title, isPlayable: true };
            links.push(result);
        }
        return links;
    }
}