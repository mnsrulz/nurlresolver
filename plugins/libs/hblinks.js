var Xray = require('x-ray')
var x = Xray()

var BaseUrlResolver = require('../BaseResolver');

class HblinksResolver extends BaseUrlResolver {
    constructor() {
        super();
        this.domains = ['https://hblinks.pw'];
    }

    async resolveInner(_urlToResolve) {
        var links = [];
        var promise = new Promise(function (resolve, reject) {
            x(_urlToResolve, {
                title: ['a'],
                link: ['a@href']
            })((err, obj) => {
                for (let index = 0; index < obj.title.length; index++) {
                    const title = obj.title[index];
                    const link = obj.link[index];

                    var regex_links = /https?:\/\/(hblinks|hdhub4u)/gi;
                    if (link.match(regex_links) === null)
                        links.push(BaseUrlResolver.prototype.createResult(title, link, '', false));
                }
                resolve(links);
            })
        });
        await promise;
        return links;
    }
}

module.exports = HblinksResolver;