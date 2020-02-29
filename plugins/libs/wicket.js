var Xray = require('x-ray')
var x = Xray()
const got = require('got');
var helper = require('../helpers');
var BaseUrlResolver = require('../BaseResolver');
const FormData = require('form-data');
const { CookieJar } = require('tough-cookie');

class WicketResolver extends BaseUrlResolver {
    constructor() {
        super();
        this.domains = ['https://wicket', 'http://wicket'];
    }

    async resolveInner(_urlToResolve) {
        var links = [];
        var el = await x(_urlToResolve, 'iframe@src');
        el && links.push(BaseUrlResolver.prototype.createResult(el, el, '', false));
        return links;
    }
}

module.exports = WicketResolver;