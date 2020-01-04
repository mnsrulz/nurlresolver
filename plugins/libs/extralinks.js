var Xray = require('x-ray')
var x = Xray()
var got = require('got');

var BaseUrlResolver = require('../BaseResolver');

class ExtralinksResolver extends BaseUrlResolver {
    constructor() {
        super();
        this.domains = ['https://extralinks'];
    }

    async resolveInner(_urlToResolve) {
        var links = [];
        var page = await got(_urlToResolve);
        var regex_link = /document\.getElementById\("download"\)\.src="([^"]*)/g;
        var matchesLink = regex_link.exec(page.body);
        if (matchesLink && matchesLink[1]) {
            links.push(BaseUrlResolver.prototype.createResult('', matchesLink[1], '', true));
        }
        return links;
    }
}

module.exports = ExtralinksResolver;