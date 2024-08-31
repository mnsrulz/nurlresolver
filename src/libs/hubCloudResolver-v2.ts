import { BaseUrlResolver, ResolvedMediaItem } from "../BaseResolver.js";
import { createContext, runInContext } from 'vm';

export class HubCloudResolverV2 extends BaseUrlResolver {

    constructor() {
        super({
            domains: [/https?:\/\/(hubcloud)/],
            speedRank: 90,
            useCookies: true
        });
    }

    async resolveInner(_urlToResolve: string): Promise<ResolvedMediaItem[]> {
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
                    getElementById: ()=> {
                        return {
                            onclick: () => { return false; }
                        }
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
