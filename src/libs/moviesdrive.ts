import { BaseUrlResolver, ResolvedMediaItem } from "../BaseResolver.js";

const rx = /http(s)?:\/\/(moviesdrive|t\.me)/;
export class MoviesdriveResolver extends BaseUrlResolver {
    constructor() {
        super({
            domains: [/https?:\/\/moviesdrive/]
        });
    }
    async resolveInner(_urlToResolve: string): Promise<ResolvedMediaItem | ResolvedMediaItem[]> {
        const resp = await fetch(_urlToResolve);        
        const body = await resp.text();                
        const obj1: { links: ResolvedMediaItem[]; } = this.scrapeHtml(body, {
            links: {
                listItem: '.page-body a',
                data: {
                    link: { attr: 'href' },
                    title: ''
                }
            }
        });
        return obj1.links.filter(x => x.link.startsWith('http') && !rx.test(x.link));
    }
}

export class mdrive extends BaseUrlResolver {
    constructor() {
        super({
            domains: [/https?:\/\/mdrive/],
            speedRank: 80
        })
    }

    async resolveInner(_urlToResolve: string): Promise<ResolvedMediaItem[] | ResolvedMediaItem> {
        const urlInstance = new URL(_urlToResolve);
        const docId = urlInstance.pathname.split('/').at(-1);
        const result = await this.gotInstance(`${urlInstance.origin}/wp-json/wp/v2/posts/${docId}`).json<{ content: { rendered: string } }>();
        const links = this.scrapeAllLinks(result.content.rendered, '');
        return links.filter(x => x.link.startsWith('http') && !rx.test(x.link));
    }
}