import { BaseUrlResolver, ResolvedMediaItem } from "../BaseResolver";

export class MegaupResolver extends BaseUrlResolver {
    constructor() {
        super({
            domains: [/https?:\/\/megaup\.net/],
            useCookies: true
        });
    }

    async resolveInner(_urlToResolve: string): Promise<ResolvedMediaItem[]> {
        let links = [] as ResolvedMediaItem[];
        var el = '';
        const response = await this.gotInstance(_urlToResolve);
        const regex = /class='btn btn-default' href='([^']*)'/g;
        el = regex.exec(response.body)![1];

        if (el) {
            await this.wait(5000);
            const response2 = await this.gotInstance(el, { followRedirect: false });
            var link = response2.headers['location'];
            if (link) {
                const title = `${new URL(link).pathname.split('/').slice(-1)[0]}`;
                var result = { link, title, isPlayable: true } as ResolvedMediaItem;
                links.push(result);
            }
        }
        return links;
    }
}