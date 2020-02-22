var Xray = require('x-ray')
var x = Xray()
var helper = require('../helpers');
const got = require('got');
const { CookieJar } = require('tough-cookie');
var _eval = require('eval')
var BaseUrlResolver = require('../BaseResolver');

class Cric8WatchResolver extends BaseUrlResolver {
    constructor() {
        super();
        this.domains = ['http://cric8.cc/watch', 'https://cric8/watch'];
    }

    async resolveInner(_urlToResolve) {
        var links = [];

        var obj = await x(_urlToResolve, {
            script: 'script'
        });

        var sc = obj.script;

        if (typeof btoa === 'undefined') {
            global.btoa = function (str) {
                return new Buffer(str, 'binary').toString('base64');
            };
        }

        if (typeof atob === 'undefined') {
            global.atob = function (b64Encoded) {
                return new Buffer(b64Encoded, 'base64').toString('binary');
            };
        }
        var link = ''
        function dw(input) {
            const rx = /atob\('([^']*)/
            const rxResponse = rx.exec(input)
            if (rxResponse) {
                link = atob(rxResponse[1]);
            }
        }

        try {
            var res = _eval(sc, '', {
                document: {
                    write: dw
                }
            }, true);
        } catch (error) {
            console.log('Error occurred in the cric8ccwatch resolve method');
            console.log(error);
            var ex = error;
        }

        if (link) {
            links.push(BaseUrlResolver.prototype.createResult(link, link, '', true, _urlToResolve));
        }
        return links;
    }
}

module.exports = Cric8WatchResolver;