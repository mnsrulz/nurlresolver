import { BaseUrlResolver, ResolvedMediaItem } from "../BaseResolver";
var CookieJar = require('tough-cookie');
class GDriveResolver extends BaseUrlResolver {
    constructor() {
        super({
            domains: [/https?:\/\/(drive|docs)\.google\.com/]
        });
    }

    async resolveInner(_urlToResolve: string): Promise<ResolvedMediaItem[]> {
        var links = [];

        const rx0 = /(drive|docs)\.google\.com\/open\?id\=(.*)/
        const rx1 = /(drive|docs)\.google\.com\/file\/d\/(.*?)\//
        const rx2 = /(drive|docs)\.google\.com\/uc\?id\=(.*?)\&/

        var regexresult = rx0.exec(_urlToResolve) || rx1.exec(_urlToResolve) || rx2.exec(_urlToResolve)
        if (regexresult) {
            var normalizeDriveUrl = `https://drive.google.com/uc?id=${regexresult[2]}&export=download`;

            const cookieJar = new CookieJar();
            const response = await this.gotInstance(normalizeDriveUrl, {
                cookieJar,
                followRedirect: false
            });

            var downloadlink1 = await this.xInstance(response.body, {
                link: 'a#uc-download-link@href',
                title: 'span.uc-name-size'
            });

            var driveCookie = cookieJar.getCookiesSync(normalizeDriveUrl).find((x: { domain: string; }) => x.domain === 'drive.google.com');
            //DEV NOTE: While using cookieJar for got, somehow the generated link in the end is not streamable.
            //So, that is the reason for this custom cookie implementation.
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
        return links;
    }
}

module.exports = GDriveResolver;