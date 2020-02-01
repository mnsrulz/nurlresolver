var Xray = require('x-ray')
var x = Xray()
var got = require('got');
var BaseUrlResolver = require('../BaseResolver');
var url = require('url');

class ExtraMoviesResolver extends BaseUrlResolver {
    constructor() {
        super();
        this.domains = ['https://extramovies'];
    }

    async resolveInner(_urlToResolve) {
        const pathname = new URL(_urlToResolve).pathname;
        if (pathname === '/') return this.resolveInnerBase(_urlToResolve);

        //else do the processing here
        var links = [];

        var obj1 = await x(_urlToResolve, {
            shortLink: 'link[rel="shortlink"]@href'
        });

        var shortLink = obj1.shortLink;
        var urlInstance = url.parse(shortLink, true);
        var pageId = urlInstance.query["p"];
        var extramoviesBaseUrl = `https://${urlInstance.host}`;
        var apiUrl = `${extramoviesBaseUrl}/wp-json/wp/v2/posts/${pageId}`;
        var apiResponse = await got(apiUrl);
        var apiResponseAsJson = JSON.parse(apiResponse.body);
        var renderedContent = apiResponseAsJson.content.rendered;

        var obj = await x(renderedContent, {
            title: ['a'],
            link: ['a@href']
        });

        for (let index = 0; index < obj.title.length; index++) {
            const title = obj.title[index];
            const link = obj.link[index].startsWith('http') ? obj.link[index] : `${extramoviesBaseUrl}${obj.link[index]}`;
            var u = new URL(link);
            var regexNegate = /.*(wp-login|torrent|trailer)\.php$/ig
            if (regexNegate.exec(u.pathname)) continue;

            if (u.pathname.endsWith('drive.php')) {
                var pageText = await got(link);
                var regexExtralinks = /https:\/\/extralinks[^"]*/g
                var matchesLink = regexExtralinks.exec(pageText.body);
                if (matchesLink) {
                    links.push(BaseUrlResolver.prototype.createResult(title, matchesLink[0], '', false));
                }
            } else if (u.pathname.endsWith('.php')) {
                var queryData = url.parse(link, true).query;
                var linktoadd = '';
                if (queryData.link) {
                    linktoadd = Buffer.from(queryData.link, 'base64').toString()
                    links.push(BaseUrlResolver.prototype.createResult(title, linktoadd, '', false));
                } else {
                    //ignore other links
                    // linktoadd = link;
                }
            } else{
                links.push(BaseUrlResolver.prototype.createResult(title, link, '', false));
            }

        }
        return links;
    }

    async resolveInnerBase(_urlToResolve) {
        var origin = new URL(_urlToResolve).origin;
        var counter = 1;
        var promises = [];
        var links = [];
        while (counter <= 30) {
            var promise = (async () => {
                var page = counter;
                var obj = await x(`${origin}/page/${page}`, 'div.imag', [
                    {
                        title: 'h2',
                        link: 'a@href',
                        poster: 'img@src'
                    }
                ]);
                var items = obj.map(el => BaseUrlResolver.prototype.createResult(el.title, el.link, el.poster, false));
                links.push({ page, items });
            })();
            promises.push(promise);
            counter++;
        }
        await Promise.all(promises);
        links.sort((a, b) => a.page - b.page);
        let arr = links.map(x => x.items);
        return [].concat(...arr);
        // return [].concat(links.map(x=>x.items));
        // return links;
    }
}

module.exports = ExtraMoviesResolver;