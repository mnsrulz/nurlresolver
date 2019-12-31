var Xray = require('x-ray')
var x = Xray()
var helper = require('../helpers');

const got = require('got');
const { CookieJar } = require('tough-cookie');
const FormData = require('form-data');

var BaseUrlResolver = require('../BaseResolver');

class ZuploadResolver extends BaseUrlResolver {
    constructor() {
        super();
        this.domains = ['https://zupload.me'];
    }

    async resolveInner(_urlToResolve) {
        var links = [];
        const cookieJar = new CookieJar();
        const response = await got(_urlToResolve, { cookieJar });
        const hidden = await helper.getHiddenForm(response.body, 1);

        const form = new FormData();
        for (const key in hidden) {
            form.append(key, hidden[key]);
        }
        const response2 = await got.post(_urlToResolve, {
            body: form,
            cookieJar: cookieJar
        });

        const obj = await x(response2.body, {
            title: 'title',
            link: 'a.link_button@href'
        });
        if (obj) {
            links.push(BaseUrlResolver.prototype.createResult(obj.title, obj.link, '', true));
        }
        return links;
    }
}

module.exports = ZuploadResolver;