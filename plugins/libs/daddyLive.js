var Xray = require('x-ray')
var x = Xray()
const got = require('got');
var helper = require('../helpers');
var BaseUrlResolver = require('../BaseResolver');
const FormData = require('form-data');
const { CookieJar } = require('tough-cookie');

class DaddyliveResolver extends BaseUrlResolver {
    constructor() {
        super();
        this.domains = ['https://daddylive', 'http://daddylive'];
    }

    async resolveInner(_urlToResolve) {
        var links = [];
        var obj1 = await x(_urlToResolve, ['iframe@src']);
        obj1.forEach(el => {
            const rx = /https:\/\/daddylive/
            if(!rx.exec(el)) {
                links.push(BaseUrlResolver.prototype.createResult(el, el, '', false));
            }
        });
        return links;
    }
}

module.exports = DaddyliveResolver;