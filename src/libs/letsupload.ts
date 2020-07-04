import { BaseUrlResolver, ResolvedMediaItem } from "../BaseResolver";

export class LetsuploadResolver extends BaseUrlResolver {
    constructor() {
        super({
            domains: [/https?:\/\/letsupload/],
            useCookies: true
        });
    }

    async resolveInner(_urlToResolve: string): Promise<ResolvedMediaItem[]> {
        var links = [];
        const response = await this.gotInstance(_urlToResolve);
        var regex = /class='btn btn-free' href='([^']*)/g
        var link1 = regex.exec(response.body)![1];
        let title = await this.xInstance(response.body, 'div.title');
        title = title.trim();
        if (link1) {
            await this.wait(3000);
            const response2 = await this.gotInstance(link1, { followRedirect: false });
            var el = '';
            if (response2.statusCode === 302) {
                el = response2.headers['location'] as string;
            } else {
                const regex01 = /title="Download" href="([^"]*)"/g
                el = regex01.exec(response2.body)![1];
            }
            if (el) {
                //const title = this.extractFileNameFromUrl(el);
                var result = { link: el, title: title, isPlayable: true } as ResolvedMediaItem;
                links.push(result);
            }
        }
        return links;
    }
}