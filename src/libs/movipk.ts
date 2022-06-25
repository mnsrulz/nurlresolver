import { BaseUrlResolver, ResolvedMediaItem } from "../BaseResolver";

export class movipkResolver extends BaseUrlResolver {
    constructor() {
        super({
            domains: [/https?:\/\/(www\.)?movi\.pk/]
        });
    }

    async resolveInner(_urlToResolve: string): Promise<ResolvedMediaItem | ResolvedMediaItem[]> {
        const result = [];
        const response = await this.gotInstance(_urlToResolve, { resolveBodyOnly: true });

        const { links } = this.scrapeHtml(response, {
            links: {
                listItem: '.movieplay iframe',
                data: {
                    link: {
                        attr: 'src'
                    }
                }
            }
        });

        for (const { link } of links) {
            result.push({ link } as ResolvedMediaItem);
        }

        return result;
    }
}
