import got from 'got';
import { BaseUrlResolver, ResolvedMediaItem } from "./BaseResolver";
import { getHiddenForm } from './utils/helper';

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
        this.useCookies = true;
        this.setupEnvironment();
        const init = await this.createmyresponse(_urlToResolve);
        const hiddenform = getHiddenForm(init.response?.body || '');
        const useridvalue = hiddenform['userid'];
        const postbackurl = hiddenform['post_location'];
        //console.log(useridvalue, postbackurl);
        // await this.wait(5000);
        await init.posthiddenform();
        await this.gotInstance('https://www.mealob.com/', {
            headers: {
                'referer': 'https://www.mealob.com/'
            }
        });

        await init.posthiddenform(1);
        // const hiddenform2 = getHiddenForm(init.response?.body || '', 1);
        // console.log(JSON.stringify(hiddenform2, null, 4));
        // return [];

        // await this.gotInstance.post(postbackurl, {
        //     headers: {
        //         'referer': 'https://www.mealob.com/'
        //     }
        // });

        const hiddenform2 = getHiddenForm(init.response?.body || '', 0);
        console.log(JSON.stringify(hiddenform2, null, 4));

return [];
        // await this.gotInstance(postbackurl, {
        //     headers: {
        //         'referer': postbackurl
        //     }
        // });

        await this.wait(10000);
        const resp2 = await this.gotInstance.post(`https://www.mealob.com/?70abb6cd=${useridvalue}`, {
            followRedirect: false,
            headers: {
                'referer': postbackurl
            }
        });
        console.log(resp2.statusCode);
        console.log(resp2.body);


        // const resp2 = await resp1.posthiddenform();
        // console.log(resp2.response?.body);

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
