import { BaseUrlResolver, ResolvedMediaItem } from "../BaseResolver";

export class UpgrandResolver extends BaseUrlResolver {
    constructor() {
        super({
            domains: [/https?:\/\/upgrand/]
        });
    }

    async resolveInner(_urlToResolve: string): Promise<ResolvedMediaItem[]> {
        var links = [];
        const response = await this.gotInstance(_urlToResolve);
        const form = await this.getHiddenForm(response.body, 1);
        const response2 = await this.gotInstance.post(_urlToResolve, {
            body: form
        });
        const link = await this.xInstance(response2.body, '.downloadbtn>a@href');
        if (link) {
            const title = decodeURIComponent(new URL(link).pathname.split('/').slice(-1)[0]);
            const result = { link, title, isPlayable: true } as ResolvedMediaItem;
            links.push(result);
        }
        return links;
    }
}
