import got from 'got';
import { BaseUrlResolver, ResolvedMediaItem } from "./BaseResolver";

export class MyV2 extends BaseUrlResolver {
    /**
     *
     */
    constructor() {
        super({
            domains: [],
            speedRank: 1,
            useCookies: true
        });

    }
    async resolveInner(_urlToResolve: string): Promise<ResolvedMediaItem | ResolvedMediaItem[]> {
        const init = await this.createmyresponse(_urlToResolve);
        const resp1 = await init.posthiddenform();
        await this.wait(5000);
        const resp2 = await resp1.posthiddenform();
        console.log(resp2.response?.body);

        //         const response = await this.gotInstance(_urlToResolve);
//         const r2 = await this.postHiddenFormV2(_urlToResolve);
// console.log(r2.body)
        
// const r3 = await this.postHiddenFormV2(r2.url);
// console.log(r3)

        // helper.
        // const f = helper.ParseForms(response.body);
        // console.log(JSON.stringify({f:f, h:response.headers}));
        // console.log(JSON.stringify(response.headers, null, 4));
        return [];
    }
}
