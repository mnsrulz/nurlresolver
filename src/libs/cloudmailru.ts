
import { BaseUrlResolver, ResolvedMediaItem } from "../BaseResolver";

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
        //var title = await this.xInstance(response.body, 'title');
        const regex01 = /"weblink_get"\s*:\s*\[.+?"url"\s*:\s*"([^"]+)/gs
        const regexWeblinkVideo = /"weblink_video"\s*:\s*\[.+?"url"\s*:\s*"([^"]+)/gs
        const regex03 = /public\/(.*)/g
        const link1 = regex01.exec(response.body)?.[1];
        const link3 = regex03.exec(_urlToResolve)?.[1];
        const webLinkVideo = regexWeblinkVideo.exec(response.body)?.[1];
        if (link1 && link3 && webLinkVideo) {
            const tempLink = `${link1}/${link3}`;
            const headers = await this.gotInstance.head(tempLink);
            if (headers.statusCode === 200) {
                const finalLink = headers.url;
                const title = this.extractFileNameFromUrl(finalLink);
                const result = <ResolvedMediaItem>{
                    link: finalLink,
                    title: title,
                    isPlayable: true
                };
                links.push(result);
            }
        }
        return links;
    }
}