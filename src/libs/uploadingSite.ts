import { BaseUrlResolver, ResolvedMediaItem } from "../BaseResolver.js";
import { simpleCaptcha } from '../utils/helper.js';

export class UploadingSiteResolver extends BaseUrlResolver {
    constructor() {
        super({
            domains: [/https?:\/\/uploadingsite/],
            speedRank: 90,
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
        const resp2 = await this.gotInstance.post(resp1.url, { form: form, followRedirect: false });
        const link = resp2.headers['location'];

        if (link) {
            const title = this.extractFileNameFromUrl(link);
            return { link, title, isPlayable: true } as ResolvedMediaItem;
        }
        return [];
    }
}
