import { BaseUrlResolver, ResolvedMediaItem } from "../BaseResolver.js";

export class NinjastreamResolver extends BaseUrlResolver {
    constructor() {
        super({
            domains: [/https?:\/\/ninjastream/],
            useCookies: true
        });
    }

    async resolveInner(_urlToResolve: string): Promise<ResolvedMediaItem | ResolvedMediaItem[]> {
        const response1 = await this.gotInstance(_urlToResolve);
        const { fileEmbed, csrfToken } = this.scrapeHtml(response1.body, {
            fileEmbed: {
                selector: 'file-watch',
                attr: 'v-bind:file'
            },
            csrfToken: {
                selector: 'meta[name="csrf-token"]',
                attr: 'content'
            }
        }) as { fileEmbed: string, csrfToken: string };
        const title = JSON.parse(fileEmbed).name;
        const jsontopost = { id: JSON.parse(fileEmbed).hashid };

        const u1 = new URL('/api/video/get', _urlToResolve);
        const response2 = await this.gotInstance.post(u1.href, {
            json: jsontopost,
            resolveBodyOnly: true,
            headers: {
                'x-csrf-token': csrfToken,
                "x-requested-with": "XMLHttpRequest",
                'referer': _urlToResolve
            }
        });

        const result = JSON.parse(response2);
        if (result.status == 'success') {
            const link = `${result.result['playlist']}`;
            return { link, title, isPlayable: true } as ResolvedMediaItem;
        }
        return [];
    }
}