var Xray = require('x-ray')
var x = Xray()
const got = require('got');
var BaseUrlResolver = require('../BaseResolver');

class LinkstakerResolver extends BaseUrlResolver {
    constructor() {
        super();
        this.domains = ['https://linkstaker'];
    }

    async resolveInner(_urlToResolve) {
        var links = [];
        const response = await got(_urlToResolve);
        var regex = /\("download"\)\.src="([^"]*)/g
        
//COMBINE BOTH LINKSTAKER IMPLEMENTATION...

        var el = regex.exec(response.body)[1];
        if (el) {
            var response2 = await got(el, {
                headers: {
                    'Range': 'bytes=0-1'
                }
            });
            const regexp = /filename=\"(.*)\"/gi;
            const title = regexp.exec(response2.headers['content-disposition'])[1];
            links.push(BaseUrlResolver.prototype.createResult(title, el, '', true));
        }
        return links;
    }
}

module.exports = LinkstakerResolver;