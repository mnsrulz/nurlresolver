import { BaseUrlResolver, ResolvedMediaItem } from "../BaseResolver";

export class StreamlareResolver extends BaseUrlResolver {
    constructor() {
        super({
            domains: [/https?:\/\/streamlare/],
            useCookies: true
        });
    }

    async resolveInner(_urlToResolve: string): Promise<ResolvedMediaItem | ResolvedMediaItem[]> {
        const response1 = await this.gotInstance(_urlToResolve);
        const { fileEmbed } = this.scrapeHtml(response1.body, {
            fileEmbed: {
                selector: 'file-embed',
                attr: ':file'
            }
        });
        const title = JSON.parse(fileEmbed).name;
        const jsontopost = { id: JSON.parse(fileEmbed).hashid };

        const u1 = new URL('/api/video/get', _urlToResolve);

        const response2 = await this.gotInstance.post(u1.href, {
            json: jsontopost,
            resolveBodyOnly: true
        });
        const result = JSON.parse(response2) as streamlareResponseDto;
        if (result.status == 'success') {
            const link = result.result['Original'].src;
            return { link, title, isPlayable: true } as ResolvedMediaItem;
        }
        return [];
    }
}

interface streamlareResponseDto {
    status: string,
    result: Record<string, {
        src: string
    }>
}