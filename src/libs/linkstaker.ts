import { BaseUrlResolver, ResolvedMediaItem } from "../BaseResolver";

export class LinkstakerResolver extends BaseUrlResolver {
    constructor() {
        super({
            domains: [/https?:\/\/linkstaker/]
        });
    }

    async resolveInner(_urlToResolve: string): Promise<ResolvedMediaItem[]> {
        var links = [];
        var obj = await this.xInstance(_urlToResolve, {
            title: 'title',
            body: 'body@html'
        });
        var regex_link = /"file": "(https:[^"]*)"/g;
        var link = regex_link.exec(obj.body)![1];
        if (link) {
            var title = decodeURIComponent(obj.title).replace(/\+/g, ' ');
            var result = <ResolvedMediaItem>{
                link: link,
                title: title,
                isPlayable: true
            };
            links.push(result);
        }
        return links;
    }
}