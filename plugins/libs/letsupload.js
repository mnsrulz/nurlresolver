var Xray = require('x-ray')
var x = Xray()
var helper = require('../helpers');
const got = require('got');
const { CookieJar } = require('tough-cookie');

var BaseUrlResolver = require('../BaseResolver');

class LetsuploadResolver extends BaseUrlResolver {
    constructor() {
        super();
        this.domains = ['https://letsupload'];
    }

    async resolveInner(_urlToResolve) {
        var links = [];
        const cookieJar = new CookieJar();
        const response = await got(_urlToResolve, { cookieJar });
        var regex = /class='btn btn-free' href='([^']*)/g
        var link1 = Array.from(response.body.matchAll(regex), m => m[1])[0];

        if (link1) {
            await helper.wait(3000);
            const response2 = await got(link1, { cookieJar });
            var regex01 = /title="Download" href="([^"]*)"/g
            var el = Array.from(response2.body.matchAll(regex01), m => m[1])[0];
            if (el) {
                const title = new URL(el).pathname.split('/').slice(-1)[0];
                links.push(BaseUrlResolver.prototype.createResult(title, el, '', true));
            }
        }
        return links;
    }
}

module.exports = LetsuploadResolver;