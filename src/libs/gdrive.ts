import { BaseUrlResolver, ResolvedMediaItem } from "../BaseResolver";
import { CookieJar } from 'tough-cookie';
export class GDriveResolver extends BaseUrlResolver {
    private googleDriveId: string;
    constructor() {
        super({
            domains: [/https?:\/\/(drive|docs)\.google\.com/],
            speedRank: 99
        });
        this.googleDriveId = '';
    }

    async resolveInner(_urlToResolve: string): Promise<ResolvedMediaItem[]> {
        var links = [];

        const rx0 = /(drive|docs)\.google\.com\/open\?id\=(.*)/
        const rx1 = /(drive|docs)\.google\.com\/file\/d\/(.*?)\//
        const rx2 = /(drive|docs)\.google\.com\/uc\?id\=(.*?)\&/

        var regexresult = rx0.exec(_urlToResolve) || rx1.exec(_urlToResolve) || rx2.exec(_urlToResolve)
        if (regexresult) {
            var normalizeDriveUrl = `https://drive.google.com/uc?id=${regexresult[2]}&export=download`;
            this.googleDriveId = regexresult[2];
            const cookieJar = new CookieJar();
            const response = await this.gotInstance(normalizeDriveUrl, {
                cookieJar,
                followRedirect: false
            });

            var downloadlink1 = await this.xInstance(response.body, {
                link: 'a#uc-download-link@href',
                title: 'span.uc-name-size a'
            });

            var driveCookie = cookieJar.getCookiesSync(normalizeDriveUrl).find(x => x.domain === 'drive.google.com');
            //DEV NOTE: While using cookieJar for got, somehow the generated link in the end is not streamable.
            //So, that is the reason for this custom cookie implementation.
            if (driveCookie) {
                var nextRequestCookies = `${driveCookie.key}=${driveCookie.value}`;
                var reqMediaConfirm = await this.gotInstance('https://drive.google.com' + downloadlink1.link,
                    {
                        headers: {
                            cookie: nextRequestCookies
                        },
                        followRedirect: false
                    });

                var link = reqMediaConfirm.headers.location;
                const title = downloadlink1.title;
                var result = { link, title, isPlayable: true } as ResolvedMediaItem;
                links.push(result);
            }
        }
        return links;
    }

    async fillMetaInfo(resolveMediaItem: ResolvedMediaItem) {
        // const headerswithrange = resolveMediaItem.headers || {};
        // headerswithrange['Range'] = 'bytes=0-0';
        // const rangeresponse = await this.gotInstance(resolveMediaItem.link, {
        //     headers: headerswithrange
        // });
        const gdriveid = this.googleDriveId;
        //google doesn't support HTTP HEAD, so another way to find the size and other meta infor is here.
        const result: { fileSize: string, modifiedDate: Date, mimeType: string } = await this.gotInstance(`https://content.googleapis.com/drive/v2beta/files/${gdriveid}?fields=fileSize%2CmodifiedDate%2CmimeType&supportsTeamDrives=true&key=AIzaSyC1eQ1xj69IdTMeii5r7brs3R90eck-m7k`,
            {
                headers: {
                    "X-Origin": "https://drive.google.com",
                },
            }).json();
        resolveMediaItem.size = result.fileSize;
        resolveMediaItem.lastModified = result.modifiedDate.toString();
        resolveMediaItem.contentType = result.mimeType;
    }
}