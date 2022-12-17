import { BaseUrlResolver, ResolvedMediaItem } from "../BaseResolver";

export class FreespinResolver extends BaseUrlResolver {
    constructor() {
        super({
            domains: [/https?:\/\/freespinwins\.com/]
        });
    }

    async resolveInner(_urlToResolve: string): Promise<ResolvedMediaItem[]> {
        const response = await this.gotInstance(_urlToResolve);
        const form = this.getHiddenForm(response.body);
        await this.wait(5000);
        const response2 = await this.gotInstance.post('https://freespinwins.com/links/go', {
            form: form,
            headers: {
                "X-Requested-With": "XMLHttpRequest"
            }
        });
        const result = { link: JSON.parse(response2.body).url } as ResolvedMediaItem;
        return [result];
    }
}