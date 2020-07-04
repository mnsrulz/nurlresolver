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
        const response = await this.gotInstance(_urlToResolve);

        if (new URL(response.url).pathname.endsWith('error.html')) {
            console.log(`${_urlToResolve} : File has been removed due to inactivity.`);
        } else {
            const regex = /class='btn btn-default' href='([^']*)'/g;
            const el = regex.exec(response.body)![1];
            if (el) {
                await this.wait(5000);
                const response2 = await this.gotInstance(el, { followRedirect: false });
                var link = response2.headers['location'];
                if (link) {
                    const title = this.extractFileNameFromUrl(link);
                    var result = { link, title, isPlayable: true } as ResolvedMediaItem;
                    links.push(result);
                }
            }
        }
        return links;
    }
}