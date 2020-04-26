import { BaseUrlResolver, ResolvedMediaItem } from "../BaseResolver";

export class MegaupResolver extends BaseUrlResolver {
    constructor() {
        super({
            domains: [/https?:\/\/megaup\.net/]
        });
    }

    async resolveInner(_urlToResolve: string): Promise<ResolvedMediaItem[]> {
        let links = [] as ResolvedMediaItem[];
        const response = await this.gotInstance(_urlToResolve);
        const regex = /class='btn btn-default' href='([^']*)'/g;
        var el = regex.exec(response.body)![1];
        if (el) {
            await this.wait(8000);
            const response2 = await this.gotInstance(el, { followRedirect: false });
            var finalLink = response2.headers['location'];
            if (finalLink) {
                const title = new URL(finalLink).pathname.split('/').slice(-1)[0];
                var result = <ResolvedMediaItem>{
                    link: finalLink,
                    title: title,
                    isPlayable: true
                };
                links.push(result);                
            }
        }
        return links;
    }
}