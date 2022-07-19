import { BaseUrlResolver, ResolvedMediaItem } from "../BaseResolver";

export class veryFastDownloadResolver extends BaseUrlResolver {
    constructor() {
        super({
            domains: [/https?:\/\/veryfastdownload/],
            speedRank: 95
        });
    }

    async resolveInner(_urlToResolve: string): Promise<ResolvedMediaItem[]> {
        const u = new URL(_urlToResolve);
        u.pathname = '/v3/embed2.php';
        // const response = await this.gotInstance(u.toString());
        // console.log(response.body);

        const { data } = await this.scrapeItAsync(u.toString(), {
            output: {
                selector: 'source',
                attr: 'src'
            }
        });
        const { output } = data as { output: string };
        const result = { link: output, title: 'veryfastdownload', isPlayable: true } as ResolvedMediaItem;
        return [result];
    }
}