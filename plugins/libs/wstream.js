var Xray = require('x-ray')
var x = Xray()
var helper = require('../helpers');
const got = require('got');
const { CookieJar } = require('tough-cookie');

var BaseUrlResolver = require('../BaseResolver');

class StreamwireResolver extends BaseUrlResolver {
    constructor() {
        super();
        this.domains = ['https://wstream', 'https://streamcdn'];
    }

    async resolveInner(_urlToResolve) {
        var links = [];
        var unpackstr = '';

        const goresponse = await got(_urlToResolve, {
            headers: {
                Referer: _urlToResolve,
                'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:73.0) Gecko/20100101 Firefox/73.0'
            },
            followRedirect: false
        });

        var obj = await x(goresponse.body, {
            title: 'title',
            script: ['script']
        });
        const scripts = obj.script.filter(x => x.startsWith('eval(function(p,a,c,k,e,d)'));
        scripts.forEach(el => {
            const unpack = helper.unPack(el);
            var regex = /source:"(https[^"]*)/g
            const regexResponse = regex.exec(unpack);
            if (regexResponse) {
                var el = regexResponse[1];
                var u = new URL(el);
                if (u.port === "8443") {
                    el = "http://" + u.hostname + ":8080" + u.pathname + u.search
                }
                links.push(BaseUrlResolver.prototype.createResult(el, el, '', true));
            }
        });
        return links;
    }
}

module.exports = StreamwireResolver;