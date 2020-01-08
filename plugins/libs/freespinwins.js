var Xray = require('x-ray')
var x = Xray()
const got = require('got');
const FormData = require('form-data');
var helpers = require('../helpers');

const { CookieJar } = require('tough-cookie');
var BaseUrlResolver = require('../BaseResolver');

class FreespinResolver extends BaseUrlResolver {
    constructor() {
        super();
        this.domains = ['https://freespinwins.com'];
    }

    async resolveInner(_urlToResolve) {
        var links = [];
        const cookieJar = new CookieJar();
        const response = await got(_urlToResolve, { cookieJar });
        var hidden = await helpers.getHiddenForm(response.body);

        const form = new FormData();
        for (const key in hidden) {
            form.append(key, hidden[key]);
        }
        await helpers.wait(5000);
        const response2 = await got.post('https://freespinwins.com/links/go', {
            body: form,
            cookieJar: cookieJar,
            headers: {
                "X-Requested-With": "XMLHttpRequest"
            }
        });
        var link = JSON.parse(response2.body).url;
        links.push(BaseUrlResolver.prototype.createResult('', link, '', false));
        return links;
    }
}

module.exports = FreespinResolver;