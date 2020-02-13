var Xray = require('x-ray')
var x = Xray()
const got = require('got');
var BaseUrlResolver = require('../BaseResolver');

class YouruploadResolver extends BaseUrlResolver {
    constructor() {
        super();
        this.domains = ['https://www.yourupload.com', 'https://yourupload.com'];
    }

    async resolveInner(_urlToResolve) {
        var links = [];
        const mediaIdRegex = /yourupload\.com\/(watch|embed)\/([0-9A-Za-z]+)/g
        const mediaIdRegexResponse = mediaIdRegex.exec(_urlToResolve);
        if (mediaIdRegexResponse) {
            const videoId = mediaIdRegexResponse[2];
            const normalizedUrl = `http://www.yourupload.com/embed/${videoId}`;
            const response = await got(normalizedUrl);
            const regex00 = /file\s*:\s*(?:\'|\")(.+?)(?:\'|\")/g
            var regexresponse00 = regex00.exec(response.body);
            if (regexresponse00) {
                const title = await x(response.body, 'title');
                var finalLink2 = new URL(regexresponse00[1], normalizedUrl).href;
                const headers = {
                    'referer': normalizedUrl
                }
                console.log('yourupload resolver require referrer header to pass')
                var linkGen = BaseUrlResolver.prototype.createResult(title, finalLink2, '', true);
                linkGen.headers = headers;
                links.push(linkGen);
            }
        }
        return links;
    }
}

module.exports = YouruploadResolver;