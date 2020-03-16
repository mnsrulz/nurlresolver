var Xray = require('x-ray')
var x = Xray()
const got = require('got');
var helper = require('../helpers');
var BaseUrlResolver = require('../BaseResolver');
const FormData = require('form-data');
const { CookieJar } = require('tough-cookie');

class IndishareResolver extends BaseUrlResolver {
    constructor() {
        super();
        this.domains = ['https://www.indishare'];
    }

    async canResolve(_urlToResolve) {
        return helper.getSecondLevelDomain(_urlToResolve) === 'indishare';
    }

    async resolveInner(_urlToResolve) {
        var links = [];
        const cookieJar = new CookieJar();
        const response = await got(_urlToResolve, { cookieJar });
        const title = await x(response.body, "meta[name='description']@content");

        var hidden = await helper.getHiddenForm(response.body);

        const form = new FormData();
        for (const key in hidden) {
            form.append(key, hidden[key]);
        }
        const response2 = await got.post(_urlToResolve, {
            body: form,
            cookieJar: cookieJar
        });
        var finalLink = await x(response2.body, 'span#direct_link', 'a@href');
        links.push(BaseUrlResolver.prototype.createResult(title, finalLink, '', true));
        return links;
    }
}

module.exports = IndishareResolver;