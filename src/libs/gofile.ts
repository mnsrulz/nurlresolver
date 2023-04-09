import { BaseUrlResolver, ResolvedMediaItem } from "../BaseResolver.js";

export class GoFileResolver extends BaseUrlResolver {
    constructor() {
        super({
            domains: [/https?:\/\/gofile\.io/],
            speedRank: 80
        });
    }

    async resolveInner(_urlToResolve: string): Promise<ResolvedMediaItem[]> {
        const initialResponse = await this.gotInstance(_urlToResolve);
        const rxp = /gofile\.io\/d\/(\w*)/;
        const gofileId = rxp.exec(initialResponse.url)?.[1]; //extract go fileid
        const token = 'tqY41X5Mei9MB0L0D25qyNVSbc7ZRjED';
        const apiUrl = `https://api.gofile.io/getContent?contentId=${gofileId}&token=${token}&websiteToken=12345`;
        const { data } = await this.gotInstance<ResponsePayload>(apiUrl, {
            resolveBodyOnly: true,
            responseType: 'json'
        });

        const firstValidFile = data.contents[Object.keys(data.contents)[0]];

        return [{
            isPlayable: true, title: firstValidFile.name, link: firstValidFile.link
        } as ResolvedMediaItem];
    }
}

interface ResponsePayload {
    data: {
        contents: Record<string, {
            name: string
            link: string
            directLink: string
        }>
    }
}