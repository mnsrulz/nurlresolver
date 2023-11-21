import { BaseUrlResolver, ResolvedMediaItem } from "../BaseResolver.js";

export class UploadRajaResolver extends BaseUrlResolver {
    constructor() {
        super({
            domains: [/https?:\/\/uploadraja/],
            speedRank: 85,
            useCookies: true
        });
    }

    private parseCaptchaCode(html: string): string {
        const result: { code: [{ codeValue: string, codePosition: number }] } = this.scrapeHtml(html, {
            code: {
                listItem: '#commonId td span',
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
        const resp1 = await this.gotInstance(_urlToResolve);
        const form = this.getHiddenForm(resp1.body);
        if (!form) return [];
        const captchaCode = this.parseCaptchaCode(resp1.body);
        form['code'] = captchaCode;
        await this.wait(5000);
        const resp2 = await this.gotInstance.post(resp1.url, { form: form });
        const link = this.scrapeLinkHref(resp2.body, '#direct_link a');
        if (link) {
            const title = this.extractFileNameFromUrl(link);
            return { link, title, isPlayable: true } as ResolvedMediaItem;
        }
        return [];
    }
}