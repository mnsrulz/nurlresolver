import { BaseUrlResolver, ResolvedMediaItem } from "../BaseResolver.js";
import { gDriveV2Resolver } from './gdriveV2.js';

export class FilepressResolver extends BaseUrlResolver {
    constructor() {
        super({
            domains: [/https?:\/\/filepress/],
            speedRank: 99
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
            const gdResolver = new gDriveV2Resolver();
            const gdurl = `https://drive.google.com/file/d/${apiResponse.data}/view`;
            const result = await gdResolver.resolve(gdurl, {});
            //alright so here we construct two result one for filepress and one for google drive
            if (result.length > 0) {
                const clonedResult = Object.assign({}, result[0]);
                clonedResult.parent = _urlToResolve;
                return [result[0], clonedResult];
            }
        }
        return [];
    }
}