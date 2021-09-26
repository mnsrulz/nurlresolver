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
        const links = [] as ResolvedMediaItem[];
        const responsev1 = await this.gotInstance(_urlToResolve);
        const obj1 = this.scrapeHtml(responsev1.body, {
            shortLink: {
                listItem: 'link',
                data: {
                    rel: {
                        attr: 'rel'
                    },
                    href: {
                        attr: 'href'
                    }
                }
            }
        }) as { shortLink: [{ rel: string, href: string }] };

        const shortLink = obj1.shortLink.find(x => x.rel == 'shortlink')?.href;
        if(!shortLink) throw new Error('Unable to parse shortlink for extramovies resolver');
        const urlInstance = url.parse(shortLink, true);
        const pageId = urlInstance && urlInstance.query["p"];
        if (!pageId) return links;

        const extramoviesBaseUrl = `https://${urlInstance.host}`;
        const apiUrl = `${extramoviesBaseUrl}/wp-json/wp/v2/posts/${pageId}`;
        const apiResponse = await this.gotInstance(apiUrl);
        const apiResponseAsJson = JSON.parse(apiResponse.body);
        const renderedContent = apiResponseAsJson.content.rendered;

        const regex_self_links = /https?:\/\/(extramovies|t.me)/gi;

        const obj = this.scrapeAllLinks(renderedContent, '');
        for (const iterator of obj) {
            const title = iterator.title;
            const link = iterator.link.startsWith('http') ? iterator.link : `${extramoviesBaseUrl}${iterator.link}`;
            if (!link) {
                continue;
            }
            const u = new URL(link);
            const regexNegate = /.*(wp-login|torrent|trailer)\.php$/ig
            if (regexNegate.exec(u.pathname)) continue;

            if (u.pathname.endsWith('drive.php')) {
                const pageText = await this.gotInstance(link);
                const regexExtralinks = /https?:\/\/extralinks[^"]*/g
                const matchesLink = regexExtralinks.exec(pageText.body);
                if (matchesLink) {
                    links.push({ title, link: matchesLink[0] } as ResolvedMediaItem);
                }
            } else if (u.pathname.endsWith('doodstream.php')) {
                const queryData = url.parse(link, true).query;
                if (queryData.url) {
                    const linktoadd = `https://dood.watch/d/${queryData.url}`;
                    links.push({ title, link: linktoadd } as ResolvedMediaItem);
                }
            }
            else if (u.pathname.endsWith('.php')) {
                const queryData = url.parse(link, true).query;
                if (queryData.link) {
                    const linktoadd = Buffer.from(queryData.link as string, 'base64').toString();
                    links.push({ title, link: linktoadd } as ResolvedMediaItem);
                } else if (queryData.id) {
                    const responseInner2 = this.gotInstance(link);

                    const result = this.scrapeAllLinks((await responseInner2).body, '');
                    result.forEach(instanceItem => instanceItem.title = title);
                    links.push(...result.filter(l => l.link && !l.link.match(regex_self_links)));
                }
            } else if (u.host.startsWith('extramovies')) {
                //just skip if the link is linking back to some more extramovies link
            } else {
                links.push({ title, link } as ResolvedMediaItem);
            }
        }

        return links;
    }
}