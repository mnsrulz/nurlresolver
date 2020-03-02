var Xray = require('x-ray')
var x = Xray()
const got = require('got');
var helper = require('../helpers');
var BaseUrlResolver = require('../BaseResolver');
const FormData = require('form-data');
const { CookieJar } = require('tough-cookie');

class DlfilesResolver extends BaseUrlResolver {
    constructor() {
        super();
        this.domains = ['https://dlfiles'];
    }

    async resolveInner(_urlToResolve) {
        var links = [];
        const cookieJar = new CookieJar();
        const response = await got(_urlToResolve, {
            cookieJar,
            timeout: 3000
        });

        var hidden = await helper.getHiddenForm(response.body, 1);

        const form = new FormData();
        for (const key in hidden) {
            form.append(key, hidden[key]);
        }
        const response2 = await got.post(_urlToResolve, {
            body: form,
            cookieJar: cookieJar
        });

        var firstLink = await x(response2.body, 'a.link_button@href');

        const response3 = await got(firstLink, {
            cookieJar: cookieJar
        });
        var obj = await x(response3.body, { link: 'a.link_button@href', title: 'title' });
        var title = obj.title;
        var finalLink = obj.link;

        links.push(BaseUrlResolver.prototype.createResult(title, finalLink, '', true));
        return links;
    }
}

module.exports = DlfilesResolver;