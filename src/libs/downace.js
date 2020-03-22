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
        this.domains = ['https://downace'];
    }

    async resolveInner(_urlToResolve) {
        var links = [];
        // const cookieJar = new CookieJar();
        // const response = await got(_urlToResolve, {
        //     cookieJar
        // });

        // var hidden = await helper.getHiddenForm(response.body);

        // const form = new FormData();
        // for (const key in hidden) {
        //     form.append(key, hidden[key]);
        // }
        // await helper.wait(5000);
        // const response2 = await got.post(_urlToResolve, {
        //     body: form,
        //     cookieJar: cookieJar,
        //     headers: {
        //         "Referer": _urlToResolve,
        //         "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:72.0) Gecko/20100101 Firefox/72.0"
        //     }
        // });

        // var firstLink = await x(response2.body, 'a.link_button@href');

        // const response3 = await got(firstLink, {
        //     cookieJar: cookieJar
        // });
        // var obj = await x(response3.body, { link: 'a.link_button@href', title: 'title' });
        // var title = obj.title;
        // var finalLink = obj.link;

        // links.push(BaseUrlResolver.prototype.createResult(title, finalLink, '', true));
        return links;
    }
}

module.exports = DlfilesResolver;