
import { BaseUrlResolver, ResolvedMediaItem } from "../BaseResolver.js";

export class CloudMailRuResolver extends BaseUrlResolver {
    constructor() {
        super({
            domains: [/https?:\/\/cloud\.mail\.ru/],
            speedRank: 65
        });
    }

    async resolveInner(_urlToResolve: string): Promise<ResolvedMediaItem[]> {
        const links = [] as ResolvedMediaItem[];
        const response = await this.gotInstance(_urlToResolve);
        const regex01 = /"weblink_get":({[^}]*})/gs
        const regex02 = /public\/(.*)/g
        const jsonObject = regex01.exec(response.body)?.[1] || '';
        const { url } = JSON.parse(jsonObject);
        const videoId = regex02.exec(_urlToResolve)?.[1];

        if (url && videoId) {
            const tempLink = `${url}/${videoId}`;
            const headers = await this.gotInstance.head(tempLink);
            if (headers.statusCode === 200) {
                const finalLink = headers.url;
                const title = this.extractFileNameFromUrl(finalLink);
                const result = <ResolvedMediaItem>{
                    link: finalLink,
                    title: title,
                    isPlayable: true
                };
                result.headers = { 'User-Agent': this.defaultUserAgent };
                links.push(result);
            }
        }
        return links;
    }
}