import { BaseUrlResolver, ResolvedMediaItem } from "../BaseResolver";
import * as url from 'url';

export class ExtraMoviesResolver extends BaseUrlResolver {
    constructor() {
        super({
            domains: [/https?:\/\/extramovies/]
        });
    }

    async resolveInner(_urlToResolve: string): Promise<ResolvedMediaItem[]> {
        const pathname = new URL(_urlToResolve).pathname;
        if (pathname === '/') return [];

        //else do the processing here
        var links = [] as ResolvedMediaItem[];

        var obj1 = await this.xInstance(_urlToResolve, {
            shortLink: 'link[rel="shortlink"]@href'
        });

        var shortLink = obj1.shortLink;

        var urlInstance = shortLink && url.parse(shortLink, true);
        var pageId = urlInstance && urlInstance.query["p"];
        if (!pageId) return links;

        var extramoviesBaseUrl = `https://${urlInstance.host}`;
        var apiUrl = `${extramoviesBaseUrl}/wp-json/wp/v2/posts/${pageId}`;
        var apiResponse = await this.gotInstance(apiUrl);
        var apiResponseAsJson = JSON.parse(apiResponse.body);
        var renderedContent = apiResponseAsJson.content.rendered;

        const regex_self_links = /https?:\/\/(extramovies|t.me)/gi;

        var obj = await this.xInstance(renderedContent, 'a', [{
            link: '@href',
            title: '@text'
        }]) as ResolvedMediaItem[];
        // var obj = await this.xInstance(renderedContent, {
        //     title: ['a'],
        //     link: ['a@href']
        // });
        for (const iterator of obj) {
            const title = iterator.title;
            const link = iterator.link.startsWith('http') ? iterator.link : `${extramoviesBaseUrl}${iterator.link}`;
            if (!link) {
                continue;
            }
            var u = new URL(link);
            var regexNegate = /.*(wp-login|torrent|trailer)\.php$/ig
            if (regexNegate.exec(u.pathname)) continue;

            if (u.pathname.endsWith('drive.php')) {
                var pageText = await this.gotInstance(link);
                var regexExtralinks = /https?:\/\/extralinks[^"]*/g
                var matchesLink = regexExtralinks.exec(pageText.body);
                if (matchesLink) {
                    links.push({ title, link: matchesLink[0] } as ResolvedMediaItem);
                }
            } else if (u.pathname.endsWith('doodstream.php')) {
                var queryData = url.parse(link, true).query;
                if (queryData.url) {
                    var linktoadd = `https://dood.watch/d/${queryData.url}`;
                    links.push({ title, link: linktoadd } as ResolvedMediaItem);
                }
            }
            else if (u.pathname.endsWith('.php')) {
                var queryData = url.parse(link, true).query;
                if (queryData.link) {
                    var linktoadd = Buffer.from(queryData.link as string, 'base64').toString();
                    links.push({ title, link: linktoadd } as ResolvedMediaItem);
                } else if (queryData.id) {
                    const result = await this.xInstance(link, 'a', [{
                        link: '@href'
                    }]) as ResolvedMediaItem[];
                    result.forEach(instanceItem => instanceItem.title = title);
                    links = links.concat(result.filter(l => l.link && !l.link.match(regex_self_links)));
                }
            } else if (u.host.startsWith('extramovies')) {
                //just skip if the link is linking back to some more extramovies link
            } else {
                links.push({ title, link } as ResolvedMediaItem);
            }
        }

        // for (let index = 0; index < obj.title.length; index++) {

        // }
        return links;
    }
}