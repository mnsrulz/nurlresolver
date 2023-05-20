import { BaseUrlResolver, ResolvedMediaItem } from "../BaseResolver.js";

export class FilepressResolver extends BaseUrlResolver {
    constructor() {
        super({
            domains: [/https?:\/\/filepress/],
            speedRank: 95
        });
    }

    async resolveInner(_urlToResolve: string): Promise<ResolvedMediaItem[]> {
         //it redirects and links change
         const initialResponse = await this.gotInstance(_urlToResolve);
         const workingUrl = initialResponse.url;
         const parsedUrl = new URL(workingUrl);
         const fileId = parsedUrl.pathname.split('/').pop();
         const apiResponse = await this.gotInstance.post(`https://${parsedUrl.hostname}/api/file/downlaod/`, {
             json: {
                 id: fileId,
                 method: "publicDownlaod"
             },
             headers: {
                 "referer": workingUrl
             }
         }).json<{ data: string }>();
         
        if (apiResponse.data) {
            const gdurl = `https://drive.google.com/file/d/${apiResponse.data}/view`;
            const result = await this._context?.resolve(gdurl);
            //alright so here we construct two result one for filepress and one for google drive
            if (result && result.length > 0) {
                const clonedResult = Object.assign({}, result[0]);
                clonedResult.parent = _urlToResolve;
                return [clonedResult, ...result];
            }
        }
        return [];
    }
}