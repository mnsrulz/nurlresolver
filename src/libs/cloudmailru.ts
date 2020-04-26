import { BaseUrlResolver, ResolvedMediaItem } from "../BaseResolver";

export class CloudMailRuResolver extends BaseUrlResolver {
    constructor() {
        super({
            domains: [/https?:\/\/cloud\.mail\.ru/]
        });
    }

    async resolveInner(_urlToResolve: string): Promise<ResolvedMediaItem[]> {
        var links = [];
        try {
            const response = await this.gotInstance(_urlToResolve);
            var title = await this.xInstance(response.body, 'title');
            var regex01 = /"weblink_get"\s*:\s*\[.+?"url"\s*:\s*"([^"]+)/gs
            var regex03 = /public\/(.*)/g
            var link1 = regex01.exec(response.body)![1];
            var link3 = regex03.exec(_urlToResolve)![1];

            if (link1 && link3) {
                var finalLink = `${link1}/${link3}`;
                var headers = await this.gotInstance.head(finalLink);

                if (headers.statusCode === 200) {
                    var result = <ResolvedMediaItem>{
                        link: finalLink,
                        title: title,
                        isPlayable: true
                    };
                    links.push(result);
                }
            }
        } catch (error) {
            console.log(`Error occurred while parsing cloudmailru link: ${_urlToResolve}`);
        }
        return links;
    }
}