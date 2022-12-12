import { BaseUrlResolver, ResolvedMediaItem } from "../BaseResolver";
import { URL } from 'url'; 

export class YouruploadResolver extends BaseUrlResolver {
    constructor() {
        super({
            domains: [/https?:\/\/yourupload\.com/, /https?:\/\/www\.yourupload\.com/],
            speedRank: 60
        });
    }

    async resolveInner(_urlToResolve: string): Promise<ResolvedMediaItem[]> {
        const links = [];
        const mediaIdRegex = /yourupload\.com\/(watch|embed)\/([0-9A-Za-z]+)/g
        const videoId = mediaIdRegex.exec(_urlToResolve)?.[2];
        const normalizedUrl = `http://www.yourupload.com/embed/${videoId}`;
        const response = await this.gotInstance(normalizedUrl);
        const fileSourceRegex = /file\s*:\s*(?:'|")(.+?)(?:'|")/g
        const fileLink = fileSourceRegex.exec(response.body)?.[1];

        if (fileLink && !fileLink?.endsWith('novideo.mp4') && !fileLink.endsWith('watermark.png')) {
            const { title } = this.scrapeHtml(response.body, {
                title: 'title'
            }) as { title: string };
            const link = new URL(fileLink, normalizedUrl).href;
            const result = { title, link, isPlayable: true } as ResolvedMediaItem;
            result.headers = { "referer": normalizedUrl };
            links.push(result);
        }

        return links;
    }
}