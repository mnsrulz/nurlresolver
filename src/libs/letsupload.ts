import { BaseUrlResolver, ResolvedMediaItem } from "../BaseResolver";

export class LetsuploadResolver extends BaseUrlResolver {
    constructor() {
        super({
            domains: [/https?:\/\/letsupload/],
            useCookies: true
        });
    }

    async resolveInner(_urlToResolve: string): Promise<ResolvedMediaItem[]> {
        const links = [];
        const response = await this.gotInstance(_urlToResolve);
        const regexForInitialPage = /class='btn btn-free' href='([^']*)/g

        const regexForInitialPageResult = regexForInitialPage.exec(response.body);
        const link1 = regexForInitialPageResult?.[1];

        let title = this.scrapeInnerText(response.body, 'div.title');
        title = title.trim();
        if (link1) {
            await this.wait(5000);
            const response2 = await this.gotInstance(link1, { followRedirect: false });
            let el = '';
            if (response2.statusCode === 302) {
                el = response2.headers['location'] as string;
            } else {
                const regex01 = /title="Download" href="([^"]*)"/g
                const regex02 = /window\.location\.href="([^"]*)"/g
                const regex01Result = regex01.exec(response2.body);

                if (regex01Result && regex01Result?.[1]) {
                    el = regex01Result?.[1];
                } else {
                    const regex02Result = regex02.exec(response2.body);
                    regex02Result && (el = regex02Result?.[1]);
                }
            }
            if (el) {
                const result = { link: el, title: title, isPlayable: true } as ResolvedMediaItem;
                links.push(result);
            }
        }
        return links;
    }
}