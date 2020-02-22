var Xray = require('x-ray')
var x = Xray()
var helper = require('../helpers');
const got = require('got');
const { CookieJar } = require('tough-cookie');

var BaseUrlResolver = require('../BaseResolver');

class Cric8StreamResolver extends BaseUrlResolver {
    constructor() {
        super();
        this.domains = ['http://cric8.cc/stream', 'https://cric8/stream'];
    }

    async resolveInner(_urlToResolve) {
        var links = [];
        var response = await got(_urlToResolve);
        var rx = /http:\/\/cric8\.cc\/watch[^"]*/g
        var rxResult = response.body.match(rx);

        if (rxResult) {
            rxResult.forEach(el => {
                links.push(BaseUrlResolver.prototype.createResult(el, el, '', false));
            });
        }
        return links;
    }
}

module.exports = Cric8StreamResolver;