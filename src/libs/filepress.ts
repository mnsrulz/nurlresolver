import { BaseUrlResolver, ResolvedMediaItem } from "../BaseResolver.js";

export class FilepressResolver extends BaseUrlResolver {
    constructor() {
        super({
            domains: [/https?:\/\/([^\.]*\.)?filepress/],
            speedRank: 95
        });
    }

    async resolveInner(_urlToResolve: string): Promise<ResolvedMediaItem[]> {
        //it redirects and links change
        const initialResponse = await this.gotInstance(_urlToResolve, {
            throwHttpErrors: false  //we are expecting 403 forbidden errors due to CF protection
        });
        const workingUrl = initialResponse.url;
        const parsedUrl = new URL(workingUrl);
        const originalFileId = parsedUrl.pathname.split('/').pop();
        const downloadV1 = await this.gotInstance.post(`https://${parsedUrl.hostname}/api/file/downlaod/`, {
            json: {
                id: originalFileId,
                method: "publicDownlaod"
            },
            headers: {
                "referer": workingUrl
            }
        }).json<{ data: string, statusCode: string }>();

        const fileId = downloadV1.statusCode == '200' ? downloadV1.data : originalFileId;

        const apiResponse = await this.gotInstance.post(`https://${parsedUrl.hostname}/api/file/downlaod2/`, {
            json: {
                id: fileId,
                method: "publicUserDownlaod"
            },
            headers: {
                "referer": workingUrl
            }
        }).json<{ data: string }>();
        
        if (apiResponse.data) {
            const gdurl = `https://drive.google.com/file/d/${apiResponse.data}/view`;
            const result = await this._context?.resolveRecursive(gdurl, this._resolverOptions);
            //alright so here we construct two result one for filepress and one for google drive
            if (result && result.length > 0) {
                const clonedResult = Object.assign({}, result[0]);
                clonedResult.parent = _urlToResolve;
                return [clonedResult, ...result];
            }
        }
        return [];
    }
    async fillMetaInfo(resolveMediaItem: ResolvedMediaItem): Promise<void> {
        //do nothing...
    }
}