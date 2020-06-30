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
            title = title.replace(' - Google Drive', '').trim();
            var result = <ResolvedMediaItem>{
                link: link,
                title: title,
                isPlayable: true
            };
            links.push(result);

            var gdriveUrl = new URL(link);
            if (gdriveUrl.hostname.toLowerCase().endsWith('googleusercontent.com')) {
                const googleDocId = gdriveUrl.pathname.split('/').slice(-1)[0];
                const constructedGoogleLInk = `https://drive.google.com/file/d/${googleDocId}/view`;
                links.push({ link: constructedGoogleLInk, isPlayable: false } as ResolvedMediaItem);
            }
        }
        return links;
    }
}