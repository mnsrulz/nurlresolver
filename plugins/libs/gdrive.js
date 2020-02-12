var Xray = require('x-ray')
var x = Xray()
const got = require('got');
var BaseUrlResolver = require('../BaseResolver');
const { CookieJar } = require('tough-cookie');

class GDriveResolver extends BaseUrlResolver {
    constructor() {
        super();
        this.domains = ['https://drive.google.com', 'https://docs.google.com'];
    }

    async resolveInner(_urlToResolve) {
        var links = [];

        const rx0 = /(drive|docs)\.google\.com\/open\?id\=(.*)/
        const rx1 = /(drive|docs)\.google\.com\/file\/d\/(.*?)\//
        const rx2 = /(drive|docs)\.google\.com\/uc\?id\=(.*?)\&/

        var regexresult = rx0.exec(_urlToResolve) || rx1.exec(_urlToResolve) || rx2.exec(_urlToResolve)
        if (regexresult) {
            var normalizeDriveUrl = `https://drive.google.com/uc?id=${regexresult[2]}&export=download`;

            const cookieJar = new CookieJar();
            const response = await got(normalizeDriveUrl, {
                cookieJar,
                followRedirect: false
            });

            var downloadlink1 = await x(response.body, {
                link: 'a#uc-download-link@href',
                title: 'span.uc-name-size'
            });

            var driveCookie = cookieJar.getCookiesSync(normalizeDriveUrl).find(x => x.domain === 'drive.google.com');
            //DEV NOTE: While using cookieJar for got, somehow the generated link in the end is not streamable.
            //So, that is the reason for this custom cookie implementation.
            var nextRequestCookies = `${driveCookie.key}=${driveCookie.value}`;
            var reqMediaConfirm = await got.get('https://drive.google.com' + downloadlink1.link,
                {
                    headers: {
                        cookie: nextRequestCookies
                    },
                    followRedirect: false
                });

            var finalLink = reqMediaConfirm.headers.location;
            const title = downloadlink1.title;
            links.push(BaseUrlResolver.prototype.createResult(title, finalLink, '', true));
        }
        return links;
    }
}

module.exports = GDriveResolver;