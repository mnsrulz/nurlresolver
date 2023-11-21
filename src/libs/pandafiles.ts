import { BaseUrlResolver, ResolvedMediaItem } from "../BaseResolver.js";
//this is the sample captcha response
// const shtml = `<div class="captcha"><tr><td align="right"><div style="width:80px;height:26px;font:bold 13px Arial;background:#ccc;text-align:left;direction:ltr;">
//     <span style="position:absolute;padding-left:43px;padding-top:6px;">3</span>
//     <span style="position:absolute;padding-left:27px;padding-top:7px;">5</span>
//     <span style="position:absolute;padding-left:60px;padding-top:3px;">9</span>
//     <span style="position:absolute;padding-left:7px;padding-top:4px;">2</span>
//     </div></td></tr></div>`;

export class PandafilesResolver extends BaseUrlResolver {
    constructor() {
        super({
            domains: [/https?:\/\/(pandafiles)/],
            useCookies: true,
            speedRank: 85
        });
    }

    private parseCaptchaCode(html: string): string {
        const result: { code: [{ codeValue: string, codePosition: number }] } = this.scrapeHtml(html, {
            code: {
                listItem: '.captcha span',
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


    async resolveInner(_urlToResolve: string): Promise<ResolvedMediaItem | ResolvedMediaItem[]> {
        const response = await this.gotInstance(_urlToResolve);
        const form = this.getHiddenForm(response.body);
        if (!form) return [];
        delete form['method_premium'];
        const resp1 = await this.gotInstance.post(response.url, { form: form });
        const captchaCode = this.parseCaptchaCode(resp1.body);
        const form2 = this.getHiddenForm(resp1.body);
        if (!form2) return []
        form2['referer'] = response.url;
        form2['code'] = captchaCode;
        const resp2 = await this.gotInstance.post(resp1.url, { form: form2 });
        const redirectlink = this.scrapeLinkHref(resp2.body, '#direct_link a');
        const headResponse = await this.gotInstance.head(redirectlink);
        const link = headResponse.url
        const title = this.extractFileNameFromUrl(link);
        const result = {
            link,
            title,
            isPlayable: true
        } as ResolvedMediaItem;
        return [result];
    }
}