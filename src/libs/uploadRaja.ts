import { BaseUrlResolver, ResolvedMediaItem } from "../BaseResolver.js";
import { simpleCaptcha } from '../utils/helper.js';

export class UploadRajaResolver extends BaseUrlResolver {
    constructor() {
        super({
            domains: [/https?:\/\/uploadraja/],
            speedRank: 85,
            useCookies: true
        });
    }

    async resolveInner(_urlToResolve: string): Promise<ResolvedMediaItem | ResolvedMediaItem[]> {
        const resp1 = await this.gotInstance(_urlToResolve);
        const form = this.getHiddenForm(resp1.body);
        if (!form) return [];
        const captchaCode = simpleCaptcha(resp1.body, '#commonId td span');
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