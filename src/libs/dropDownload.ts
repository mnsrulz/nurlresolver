import { BaseUrlResolver, ResolvedMediaItem } from "../BaseResolver.js";


export class dropDownloadResolver extends BaseUrlResolver {
    constructor() {
        super({
            domains: [/https?:\/\/(drop.download)/],
            speedRank: 50,
            useCookies: true
        });
    }

    async resolveInner(_urlToResolve: string): Promise<ResolvedMediaItem[]> {
        const response = await this.gotInstance(_urlToResolve);
        const formToPost = this.getHiddenForm(response.body);
        if (!formToPost) return [];
        
        formToPost['method_free'] = 'Free Download >>';
        const urlToPost = response.url;
        const response2 = await this.gotInstance.post(urlToPost, {
            form: formToPost,
            headers: {
                Referer: urlToPost
            },
            followRedirect: false //it can raise some unhandled error which can potentially cause whole application shutdown.
        });

        const captcha = this.parseCaptchaCode(response2.body);
        const form2ToPost = this.getHiddenForm(response2.body);
        if (form2ToPost) {
            form2ToPost['code'] = captcha;
            form2ToPost['adblock_detected'] = '0';
        }
        const response3 = await this.gotInstance.post(response2.url, {
            form: form2ToPost,
            headers: {
                Referer: urlToPost
            },
            followRedirect: false //it can raise some unhandled error which can potentially cause whole application shutdown.
        });

        const link = this.scrapeLinkHref(response3.body, 'a.btn-download');
        if (link) {
            const title = this.extractFileNameFromUrl(link);
            return [
                { link, isPlayable: true, title } as ResolvedMediaItem
            ];
        }
        return [];
    }

    //this is same as clicknupload captch
    private parseCaptchaCode(html: string): string {
        const result: { code: [{ codeValue: string; codePosition: number; }]; } = this.scrapeHtml(html, {
            code: {
                listItem: 'td[align=right] span',
                data: {
                    codeValue: {},
                    codePosition: {
                        attr: 'style',
                        convert: (x) => {
                            const rxResult = /padding-left:(\d*)px/.exec(x);
                            return rxResult && parseInt(rxResult[1]);
                        }
                    }
                }
            }
        });

        return result.code
            .sort((a, b) => a.codePosition - b.codePosition)
            .map(x => x.codeValue)
            .join('');
    }
}
