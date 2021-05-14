import { BaseUrlResolver, ResolvedMediaItem } from "../BaseResolver";

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
        const gofileId = rxp.exec(initialResponse.url)![1]; //extract go fileid
        const apiUrl = `https://api.gofile.io/getUpload?c=${gofileId}`;
        const { data } = await this.gotInstance<ResponsePayload>(apiUrl, {
            resolveBodyOnly: true,
            responseType: 'json'
        });
        const firstValidFile = data.files[Object.keys(data.files)[0]];

        return [{
            isPlayable: true, title: firstValidFile.name, link: firstValidFile.link
        } as ResolvedMediaItem];
    }
}

interface ResponsePayload {
    data: {
        files: Record<string, {
            name: string
            link: string
        }>
    }
}