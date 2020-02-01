var Xray = require('x-ray')
var x = Xray()
const got = require('got');
var BaseUrlResolver = require('../BaseResolver');
const { CookieJar } = require('tough-cookie');

class GDriveResolver extends BaseUrlResolver {
    constructor() {
        super();
        this.domains = ['https://drive.google.com'];
    }

    async resolveInner(_urlToResolve) {
        var links = [];

        const rx0 = /drive\.google\.com\/open\?id\=(.*)/
        const rx1 = /drive\.google\.com\/file\/d\/(.*?)\//
        const rx2 = /drive\.google\.com\/uc\?id\=(.*?)\&/

        var regexresult = rx0.exec(_urlToResolve) || rx1.exec(_urlToResolve) || rx2.exec(_urlToResolve)

        var normalizeDriveUrl = `https://drive.google.com/uc?id=${regexresult[1]}&export=download`;

        const cookieJar = new CookieJar();
        const response = await got(normalizeDriveUrl, { cookieJar });

        var downloadlink1 = await x(response.body, {
            link: 'a#uc-download-link@href',
            title: 'span.uc-name-size'
        });

        var reqMediaConfirm = await got.get('https://drive.google.com' + downloadlink1.link,
            {
                cookieJar,
                followRedirect: false
            });

        var finalLink = reqMediaConfirm.headers.location;
        const title = downloadlink1.title;
        links.push(BaseUrlResolver.prototype.createResult(title, finalLink, '', true));
        return links;
    }


}

module.exports = GDriveResolver;