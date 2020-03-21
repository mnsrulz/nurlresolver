var Xray = require('x-ray')
var x = Xray()

var BaseUrlResolver = require('../BaseResolver');

class LinkstakerResolver extends BaseUrlResolver {
    constructor() {
        super();
        this.domains = ['https://linkstaker'];
    }

    async resolveInner(_urlToResolve) {
        var links = [];
        var obj = await x(_urlToResolve, {
            title: 'title',
            body: 'body@html'
        });
        var regex_link = /"file": "(https:[^"]*)"/g;
        var link = regex_link.exec(obj.body)[1];
        if (link) {
            var title = decodeURIComponent(obj.title).replace(/\+/g, ' ');
            links.push(BaseUrlResolver.prototype.createResult(title, link, '', true));
        }
        return links;
    }
}

module.exports = LinkstakerResolver;