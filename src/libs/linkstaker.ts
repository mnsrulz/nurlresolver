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
        const regex_link = /("file": "(https:[^"]*)")|(\("download"\)\.src="([^"]*))/g;
        const regex_link_result = regex_link.exec(obj.body);
        const link = regex_link_result && (regex_link_result[2] || regex_link_result[4]);
        if (link) {
            var gdriveUrl = new URL(link);
            if (gdriveUrl.hostname.toLowerCase().endsWith('googleusercontent.com')) {
                console.log(`${_urlToResolve} : googleusercontent.com link found in the page, reconstructing the drive.google.com link.`);
                const googleDocId = gdriveUrl.pathname.split('/').slice(-1)[0];
                const constructedGoogleLInk = `https://drive.google.com/file/d/${googleDocId}/view`;
                links.push({ link: constructedGoogleLInk, isPlayable: false } as ResolvedMediaItem);
            } else {
                var title = decodeURIComponent(obj.title).replace(/\+/g, ' ');
                title = title.replace(' - Google Drive', '').trim();
                var result = <ResolvedMediaItem>{
                    link: link,
                    title: title,
                    isPlayable: true
                };
                links.push(result);
            }
        } else {
            console.log(`${_urlToResolve} : No valid link found in the page.`);
        }
        return links;
    }
}