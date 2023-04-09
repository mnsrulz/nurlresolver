import { BaseUrlResolver, ResolvedMediaItem } from "../BaseResolver.js";

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
        // console.log('inside me..')
        // const _ = _urlToResolve.replace('/e/', '/d/');
        // console.log(_);
        // const response = await this.gotInstance(_, { resolveBodyOnly: true });
        // const rx = /download_video\('([^']*)','([^']*)','([^']*)'\)/g;

        // let m: RegExpExecArray | null;
        // if (m = rx.exec(response)) {
        //     //console.log(m[1]);
        //     console.log(m[1], m[2], m[3]);
        //     const dlLink = `${new URL(_urlToResolve).origin}/dl?op=download_orig&id=${m[1]}&mode=${m[2]}&hash=${m[3]}`;
        //     console.log(dlLink);
        //     /*
        //     https://dlmovies.link/dl?op=download_orig&id=4sbwkkevqu1m&mode=n&hash=47084043-11-76-1668484790-192a11013661a3b7504a634b2f457d32
        //     https://dlmovies.link/dl?op=download_orig&id=4sbwkkevqu1m&mode=n&hash=47084043-73-188-1668484773-23deb9f9639040d6ea8ac02269a24bbe
        //     */

        //    /*
        //    todo: solve google captcha
        //    */
        //     const response2 = await this.gotInstance(dlLink, { resolveBodyOnly: true });
        //     // await this.postHiddenForm(dlLink, response2);
        // }

        // const result: any = [];
        // return result;
    }
}
