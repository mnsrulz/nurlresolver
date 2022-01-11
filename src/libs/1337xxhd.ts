import { BaseUrlResolver, ResolvedMediaItem } from "../BaseResolver";

export class XhdResolver extends BaseUrlResolver {
    constructor() {
        super({
            domains: [/https?:\/\/1337xhd/]
        });

    }
    async resolveInner(_urlToResolve: string): Promise<ResolvedMediaItem | ResolvedMediaItem[]> {
        const responsev1 = await this.gotInstance(_urlToResolve);
        const obj1: { links: ResolvedMediaItem[]; } = this.scrapeHtml(responsev1.body, {
            links: {
                listItem: 'a',
                data: {
                    link: { attr: 'href' },
                    title: ''
                }
            }
        });
        const rx = /http(s)?:\/\/(1337xhd|t\.me)/;
        return obj1.links.filter(x => x.link.startsWith('http') && !rx.test(x.link));
    }
}
