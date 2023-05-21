import { BaseUrlResolver, ResolvedMediaItem } from "../BaseResolver.js";

export class filePostResolver extends BaseUrlResolver {
    constructor() {
        super({
            domains: [/https?:\/\/filepost/],
            speedRank: 90,
            useCookies: true
        });
    }

    async resolveInner(_urlToResolve: string): Promise<ResolvedMediaItem | ResolvedMediaItem[]> {
        const parsedUrl = new URL(_urlToResolve);
        const fileId = parsedUrl.pathname.split('/').pop();
        const response = await this.gotInstance(_urlToResolve);
        const csrfToken = this.parseElementAttributes(response.body, 'meta[name=csrf-token]', 'content')[0];
        const data = { download: { index: 0 } };
        const resp2 = await this.gotInstance.post(`https://filepost.io/d/${fileId}/generate_link`, {
            json: data,
            headers: {
                "x-csrf-token": csrfToken
            }
        }).json<{ url: string; }>();
        const title = this.parseElementAttributes(response.body, 'meta[name=description]', 'content')[0];
        return { link: resp2.url, title, isPlayable: true } as ResolvedMediaItem;
    }
}
