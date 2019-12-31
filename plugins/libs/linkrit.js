var Xray = require('x-ray')
var x = Xray()
const got = require('got');
const FormData = require('form-data');
var helpers = require('../helpers');

var BaseUrlResolver = require('../BaseResolver');

class LinkritResolver extends BaseUrlResolver {
    constructor() {
        super();
        this.domains = ['https://linkrit.com'];
    }

    async resolveInner(_urlToResolve) {
        var links = [];
        const response = await got(_urlToResolve);
        var hidden = await helpers.getHiddenForm(response.body);

        const form = new FormData();
        for (const key in hidden) {
            form.append(key, hidden[key]);
        }
        const response2 = await got.post(_urlToResolve, {
            body: form
        });

        var promise = new Promise(function (resolve, reject) {
            x(response2.body, '.view-well', {
                title: ['a'],
                link: ['a@href']
            })((err, obj) => {
                var lnks = obj;
                for (let index = 0; index < obj.title.length; index++) {
                    const title = obj.title[index];
                    const link = obj.link[index];
                    links.push(BaseUrlResolver.prototype.createResult(title, link, '', false));
                }
                resolve(links);
            })
        });
        await promise;
        return links;
    }
}

module.exports = LinkritResolver;