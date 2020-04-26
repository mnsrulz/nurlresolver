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
        const response = await this.gotInstance(_urlToResolve);
        const title = await this.xInstance(response.body, "meta[name='description']@content");
        const form = await this.getHiddenForm(response.body);
        const response2 = await this.gotInstance.post(_urlToResolve, {
            body: form
        });
        var finalLink = await this.xInstance(response2.body, 'span#direct_link', 'a@href');

        var result = <ResolvedMediaItem>{
            link: finalLink,
            title: title,
            isPlayable: true
        };
        return [result];
    }
}

module.exports = IndishareResolver;