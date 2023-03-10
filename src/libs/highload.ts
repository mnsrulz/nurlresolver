import { BaseUrlResolver, ResolvedMediaItem } from "../BaseResolver";
import { createContext, runInContext } from 'vm';
import { parseScripts } from '../utils/helper';

//got this from the https://highload.to/assets/js/master.js
const masterScript = `
var cdefebcecd = fcaacedbfacf.replace("RmVhZmRhYWRlYQ", "");
var ddedaaaafe = atob(cdefebcecd);
var res = afbaefbafbae.replace("NzZhYTdhNDE5NjVmNmQ0MDgyOTJhNDhlZjU1OTJiN2Q", "");
var res2 = res.replace("MjMyM2U3MmUwMTM3ZTkxODVmMWE2MWY0OTlhZDE2Mjc=", "");
var decode = atob(res2);
`;

export class highloadResolver extends BaseUrlResolver {
    constructor() {
        super({
            domains: [/https?:\/\/(highload)/],
            speedRank: 70
        });
    }

    async resolveInner(_urlToResolve: string): Promise<ResolvedMediaItem[]> {
        const links: ResolvedMediaItem[] = [];
        const response = await this.gotInstance(_urlToResolve);
        const parsedScripts = parseScripts(response.body);

        const context = createContext({
            atob: (b64Encoded: string) => {
                return Buffer.from(b64Encoded, 'base64').toString('binary');
            },
            navigator: { userAgent: '' },
            window: {
                navigator: {},
            },
            document: {
                write: () => console.log,
                getElementsByTagName: console.log,
                addEventListener: console.log,
                getElementById: console.log
            }
        });

        for (const sc of parsedScripts) {
            try {
                runInContext(sc, context);
            } catch (error) {
                //console.log('error: ', (error as Error));
            }
        }

        runInContext(masterScript, context);

        if (context.decode) {
            const link = `${context.decode}`;
            const title = this.extractFileNameFromUrl(_urlToResolve);
            links.push({ link, isPlayable: true, title } as ResolvedMediaItem)
        }
        return links;
    }
}