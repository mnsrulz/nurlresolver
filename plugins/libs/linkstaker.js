var Xray = require('x-ray')
var x = Xray()

var BaseUrlResolver = require('../BaseResolver');

class ClicknuploadResolver extends BaseUrlResolver {
    constructor() {
        super();
        this.domains = ['https://linkstaker.xyz'];
    }

    async resolveInner(_urlToResolve) {
        var links = [];
        var promise = new Promise(function (resolve, reject) {
            x(_urlToResolve, {
                title: 'title',
                body: 'body@html'
            })((err, obj) => {
                var regex_link = /"file": "(https:[^"]*)"/g;
                var link = Array.from(obj.body.matchAll(regex_link), m => m[1])[0];
                if (link) {
                    var title = decodeURIComponent(obj.title).replace(/\+/g, ' ');
                    links.push(BaseUrlResolver.prototype.createResult(title, link, '', true));
                }
                resolve(links);
            })
        });
        await promise;
        return links;
    }
}

module.exports = ClicknuploadResolver;