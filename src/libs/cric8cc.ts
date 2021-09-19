import { BaseUrlResolver, ResolvedMediaItem } from "../BaseResolver";

export class Cric8StreamResolver extends BaseUrlResolver {
    constructor() {
        super({
            domains: [/https?:\/\/(www.)?cric8\.cc\/watch/]
        });
    }

    async resolveInner(_urlToResolve: string): Promise<ResolvedMediaItem[]> {
        return [];  //non wrokring
        // var response = await this.gotInstance(_urlToResolve);
        // const result = await this.xInstance(response.body, 'iframe', [{ link: '@src' }]) as ResolvedMediaItem[];
        // console.log(result);
        // return result;
    }
}