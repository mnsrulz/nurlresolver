import { BaseUrlResolver, ResolvedMediaItem } from "../BaseResolver";

export class StreamlareResolver extends BaseUrlResolver {
    constructor() {
        super({
            domains: [/https?:\/\/streamlare/],
            useCookies: true,
            speedRank: 75
        });
    }

    async resolveInner(_urlToResolve: string): Promise<ResolvedMediaItem | ResolvedMediaItem[]> {
        const response1 = await this.gotInstance(_urlToResolve);
        const { fileEmbed } = this.scrapeHtml(response1.body, {
            fileEmbed: {
                selector: 'file-embed',
                attr: ':file'
            }
        }) as {fileEmbed: string};
        const title = `${JSON.parse(fileEmbed).name}.mp4`;
        const jsontopost = { id: JSON.parse(fileEmbed).hashid };

        const u1 = new URL('/api/video/get', _urlToResolve);

        const response2 = await this.gotInstance.post(u1.href, {
            json: jsontopost,
            resolveBodyOnly: true
        });
        const result = JSON.parse(response2) as streamlareResponseDto;
        if (result.status == 'success') {
            const link = decryptString(result.result['Original'].src);
            return { link, title, isPlayable: true } as ResolvedMediaItem;
        }
        return [];
    }


}

const decryptString = (s: string) => {
    const encodedString = Buffer.from(s, 'base64').toString('binary');  //atob
    let result = '';
    for (let i = 0; i < encodedString.length; i++) {
        const tempResult = 51 ^ encodedString.charCodeAt(i);
        result += String.fromCharCode(tempResult);
    }
    return result;
}

interface streamlareResponseDto {
    status: string,
    result: Record<string, {
        src: string
    }>
}