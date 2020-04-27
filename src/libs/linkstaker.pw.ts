import { BaseUrlResolver, ResolvedMediaItem } from "../BaseResolver";

export class LinkstakerResolver extends BaseUrlResolver {
    constructor() {
        super({
            domains: [/https?:\/\/linkstaker/]
        });
    }

    async resolveInner(_urlToResolve: string): Promise<ResolvedMediaItem[]> {
        var links = [] as ResolvedMediaItem[];
        const response = await this.gotInstance(_urlToResolve);
        var regex = /\("download"\)\.src="([^"]*)/g
        
//COMBINE BOTH LINKSTAKER IMPLEMENTATION...

        var el = regex.exec(response.body)![1];
        if (el) {
            var response2 = await this.gotInstance(el, {
                headers: {
                    'Range': 'bytes=0-1'
                }
            });
            const regexp = /filename=\"(.*)\"/gi;
            const title = regexp.exec(response2.headers['content-disposition'] as string)![1];
            var result = <ResolvedMediaItem>{
                link: el,
                title: title,
                isPlayable: true
            };
            links.push(result);
        }
        return links;
    }
}
