var Xray = require('x-ray')
var x = Xray()
const helper = require('../helpers');

const got = require('got');
const { CookieJar } = require('tough-cookie');
const FormData = require('form-data');

var BaseUrlResolver = require('../BaseResolver');

class MegaupResolver extends BaseUrlResolver {
    constructor() {
        super();
        this.domains = ['https://megaup.net'];
    }

    async resolveInner(_urlToResolve) {
        var links = [];
        const cookieJar = new CookieJar();
        const response = await got(_urlToResolve, { cookieJar });
        var regex = /class='btn btn-default' href='([^']*)'/g;
        var el = regex.exec(response.body)[1];
        if (el) {
            await helper.wait(8000);
            const response2 = await got(el, { cookieJar, followRedirect: false });
            var locationHeader = response2.headers['location'];
            if (locationHeader) {
                const title = new URL(locationHeader).pathname.split('/').slice(-1)[0];
                links.push(BaseUrlResolver.prototype.createResult(title, locationHeader, '', true));
            }
        }
        return links;
    }
}

module.exports = MegaupResolver;