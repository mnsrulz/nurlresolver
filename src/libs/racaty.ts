import { BaseUrlResolver, ResolvedMediaItem } from "../BaseResolver";

export class RacatyResolver extends BaseUrlResolver {
    constructor() {
        super({
            domains: [/https?:\/\/racaty/]
        });
    }

    async resolveInner(_urlToResolve: string): Promise<ResolvedMediaItem[]> {
        var links = [];
        const response = await this.gotInstance(_urlToResolve);
        const form = await this.getHiddenForm(response.body);

        const response2 = await this.gotInstance.post(_urlToResolve, {
            body: form
        });

        const link = await this.xInstance(response2.body, '#DIV_1>a@href');
        if (link) {
            const title = decodeURIComponent(new URL(link).pathname.split('/').slice(-1)[0]);
            var result = {title, link, isPlayable:true} as ResolvedMediaItem;
            links.push(result);
        }
        return links;
    }
}