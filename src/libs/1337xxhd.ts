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
                listItem: '.su-button-center a',
                data: {
                    link: { attr: 'href' },
                    text: ''
                }
            }
        });
        return obj1.links.filter(x => !x.link.startsWith('https://t.me'));
    }
}
