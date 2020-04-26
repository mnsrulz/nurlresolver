import { BaseUrlResolver, ResolvedMediaItem } from "../BaseResolver";

export class Cric8StreamResolver extends BaseUrlResolver {
    constructor() {
        super({
            domains: [/https?:\/\/cric8\.cc\/stream/]
        });
    }

    async resolveInner(_urlToResolve: string): Promise<ResolvedMediaItem[]> {
        var links = [] as ResolvedMediaItem[];
        var response = await this.gotInstance(_urlToResolve);
        var rx = /http:\/\/cric8\.cc\/watch[^"]*/g
        var rxResult = response.body.match(rx);

        if (rxResult) {
            rxResult.forEach(el => {
                var result = { title: el, link: el } as ResolvedMediaItem;
                links.push(result);
            });
        }
        return links;
    }
}