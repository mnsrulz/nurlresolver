import { BaseUrlResolver, ResolvedMediaItem } from "../BaseResolver";

export class YouruploadResolver extends BaseUrlResolver {
    constructor() {
        super({
            domains: [/https?:\/\/yourupload\.com/, /https?:\/\/www\.yourupload\.com/]
        });
    }

    async resolveInner(_urlToResolve: string): Promise<ResolvedMediaItem[]> {
        const links = [];
        const mediaIdRegex = /yourupload\.com\/(watch|embed)\/([0-9A-Za-z]+)/g
        const videoId = mediaIdRegex.exec(_urlToResolve)![2];
        const normalizedUrl = `http://www.yourupload.com/embed/${videoId}`;
        const response = await this.gotInstance(normalizedUrl);
        const fileSourceRegex = /file\s*:\s*(?:\'|\")(.+?)(?:\'|\")/g
        const fileLink = fileSourceRegex.exec(response.body)![1];

        if (!fileLink.endsWith('novideo.mp4')) {
            const title = await this.xInstance(response.body, 'title');
            const link = new URL(fileLink, normalizedUrl).href;
            const result = { title, link, isPlayable: true } as ResolvedMediaItem;
            result.headers = { "referer": normalizedUrl };
            links.push(result);
        }

        return links;
    }
}