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
        var obj = await x(_urlToResolve, {
            title: ['a'],
            link: ['a@href']
        });
        for (let index = 0; index < obj.title.length; index++) {
            const title = obj.title[index];
            const link = obj.link[index];

            var regex_links = /https?:\/\/(hblinks|hdhub4u)/gi;
            if (link.match(regex_links) === null)
                links.push(BaseUrlResolver.prototype.createResult(title, link, '', false));
        }
        return links;
    }
}

module.exports = HblinksResolver;