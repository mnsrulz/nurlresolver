var Xray = require('x-ray')
var x = Xray()
const url = require('url');

var BaseUrlResolver = require('../BaseResolver');

class CrnewsResolver extends BaseUrlResolver {
    constructor() {
        super();
        this.domains = ['https://cr-news', 'https://solarsystem'];
    }

    async resolveInner(_urlToResolve) {
        var links = [];
        var promise = new Promise(function (resolve, reject) {
            x(_urlToResolve, 'div#wpsafe-link', 'a@href')((err, obj) => {
                var u = new URL(obj);
                var link = u.searchParams.get('safelink_redirect');
                links.push(BaseUrlResolver.prototype.createResult('', link, '', false));
                resolve(links);
            })

        });
        await promise;
        return links;
    }
}

module.exports = CrnewsResolver;