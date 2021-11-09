import { BaseUrlResolver, ResolvedMediaItem } from "../BaseResolver";
import { createContext, runInContext } from 'vm';

export class HubCloudResolverV2 extends BaseUrlResolver {

    constructor() {
        super({
            domains: [/https?:\/\/(hubcloud.link)/],
            speedRank: 90,
            useCookies: true
        });
    }

    async resolveInner(_urlToResolve: string): Promise<ResolvedMediaItem[]> {
        console.log(_urlToResolve);
        const response = await this.gotInstance(_urlToResolve);
        const res01 = await this.postHiddenForm(response.url, response.body);
        const resofres: { output: [{ s: string }] } = this.scrapeHtml(res01, {
            output: {
                listItem: `script`,
                data: {
                    s: {
                        how: 'html'
                    }
                }
            }
        });

        let link = '';
        for (const sc of resofres.output) {
            const context = createContext({
                atob: (b64Encoded: string) => {
                    return Buffer.from(b64Encoded, 'base64').toString('binary');
                },
                window: {

                },
                document: {
                    getElementById: () => {
                        onclick: () => { }
                    }
                }
            });
            try {
                runInContext(sc.s, context);
            } catch (error) {
                //console.log('error: ', error);
            }
            if (context.FinalURL) {
                link = context.FinalURL;
                break;
            }
        }

        const title = this.extractFileNameFromUrl(link);

        const result = {
            link,
            title,
            isPlayable: true
        } as ResolvedMediaItem;
        return [result];
    }
}

/*

*/

// var _0x10c8=["\x64\x6F\x77\x6E\x6C\x6F\x61\x64","\x67\x65\x74\x45\x6C\x65\x6D\x65\x6E\x74\x42\x79\x49\x64",
// "aHR0cHM6Ly9te_0x10c9ZpbGVzLmRpcmVjdGZpbGUyLndvcmtlcnMuZGV2LzZhM2ZiZmZiZ_0x10c9JkYzc0NGFkMjM5MDcxNTg0NGIyNDBkO_0x10c9QxNTkwNTA2M2RlYzE5YjEzZmEzNTQwZTIxN_0x10c9YzM_0x10c9JmN2M4OGY2NmJlYThmY2QxN_0x10c9U5NzhlMmM5M_0x10c9ZmODRiYjo6O_0x10c9JlYjdlNDY3MDk4OTg1MDBmM2UxODllOTcwZmMxYjYvMTM5NDU2NjUyMS9Id_0x10c90uRG8uSGFtYXJlLkRvLjIwMjEuMTA4MHAuSGluZGkuV0VCLURMLkRENS4xLkVTd_0x10c9IueDI2NC1IREh1YjR1LlR2Lm1rdg==",
// "\x57","\x72\x65\x70\x6C\x61\x63\x65",
// "\x6F\x6E\x63\x6C\x69\x63\x6B","\x64\x69\x73\x61\x62\x6C\x65\x64","\x6C\x6F\x63\x61\x74\x69\x6F\x6E"];
// var download=document[_0x10c8[1]](_0x10c8[0]);
// var url=_0x10c8[2];var FinalURL=atob(url[_0x10c8[4]](/_0x10c9/g,_0x10c8[3]));
// download[_0x10c8[5]]= function(){
//     download[_0x10c8[6]]= true;
//     window[_0x10c8[7]]= FinalURL;
//     setTimeout(function(){
//         download[_0x10c8[6]]= false
//     },10000)}