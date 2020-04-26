import { BaseUrlResolver, ResolvedMediaItem } from "../BaseResolver";

export class YouruploadResolver extends BaseUrlResolver {
    constructor() {
        super({
            domains: [/https?:\/\/yourupload\.com/, /https?:\/\/www\.yourupload\.com/]
        });
    }

    async resolveInner(_urlToResolve: string): Promise<ResolvedMediaItem[]> {
        var links = [];
        const mediaIdRegex = /yourupload\.com\/(watch|embed)\/([0-9A-Za-z]+)/g
        const mediaIdRegexResponse = mediaIdRegex.exec(_urlToResolve);
        if (mediaIdRegexResponse) {
            const videoId = mediaIdRegexResponse[2];
            const normalizedUrl = `http://www.yourupload.com/embed/${videoId}`;
            const response = await this.gotInstance(normalizedUrl);
            const regex00 = /file\s*:\s*(?:\'|\")(.+?)(?:\'|\")/g
            var regexresponse00 = regex00.exec(response.body);
            if (regexresponse00) {
                const title = await this.xInstance(response.body, 'title');
                var link = new URL(regexresponse00[1], normalizedUrl).href;
                console.log('yourupload resolver require referrer header to pass')
                var result = { title, link, isPlayable: true, referer: normalizedUrl } as ResolvedMediaItem;
                links.push(result);
            }
        }
        return links;
    }
}