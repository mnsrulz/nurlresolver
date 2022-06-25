import { BaseUrlResolver, ResolvedMediaItem } from "../BaseResolver";

export class dlmoviesResolver extends BaseUrlResolver {
    constructor() {
        super({
            domains: [/https?:\/\/dlmovies/],
            useCookies: true
        });
    }

    async resolveInner(_urlToResolve: string): Promise<ResolvedMediaItem | ResolvedMediaItem[]> {
        return [];


        //this one is not working...
        console.log('inside me..')
        const _ = _urlToResolve.replace('/e/', '/d/');
        console.log(_);
        const response = await this.gotInstance(_, { resolveBodyOnly: true });
        const rx = /download_video\('([^']*)','([^']*)','([^']*)'\)/g;
        let m: RegExpExecArray | null;
        while (m = rx.exec(response)) {
            //   console.log(m[1], m[2], m[3]);
            const dlLink = `${new URL(_urlToResolve).origin}/dl?op=download_orig&id=${m[1]}&mode=${m[2]}&hash=${m[3]}`;
            const response2 = await this.gotInstance(dlLink, { resolveBodyOnly: true });
            await this.postHiddenForm(dlLink, response2);
        }

        const result: any = [];        
        return result;
    }
}
