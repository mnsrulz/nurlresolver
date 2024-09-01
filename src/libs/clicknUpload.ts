import debug from 'debug';
const _debug = debug('nurl:ClicknUploadResolver');

import { BaseUrlResolver, ResolvedMediaItem } from "../BaseResolver.js";
import { simpleCaptcha } from '../utils/helper.js';

export class ClicknUploadResolver extends BaseUrlResolver {
    constructor() {
        super({
            domains: [/https?:\/\/clicknupload/],
            speedRank: 70,
            useCookies: true
        });
    }

    async resolveInner(_urlToResolve: string): Promise<ResolvedMediaItem | ResolvedMediaItem[]> {
        const response = await this.gotInstance(_urlToResolve);
        const response2 = await this.postHiddenForm(response.url, response.body, 0, false);
        const parsedCode = simpleCaptcha(response2.body, 'td[align=right] span');
        const formToPost = this.getHiddenForm(response2.body, 0);

        if (formToPost) {
            formToPost['code'] = parsedCode;
            formToPost['adblock_detected'] = '0';
        }

        const urlToPost = response2.url;
        let elapsedSecond = 1;
        const logTimer = setInterval(() => { 
            _debug(`Waiting ${elapsedSecond}/10 seconds for ${_urlToResolve}`) 
            elapsedSecond=elapsedSecond+3;
        }, 3000);

        await this.wait(15000);
        clearInterval(logTimer);

        const response3 = await this.gotInstance.post(urlToPost, {
            form: formToPost,
            headers: {
                Referer: urlToPost
            },
            throwHttpErrors: false,
            followRedirect: false   //it can raise some unhandled error which can potentially cause whole application shutdown.
        });

        const link = this.scrapeLinkHref(response3.body, '#downloadbtn.downloadbtn .downloadbtn');
        
        if (link) {
            const title = this.extractFileNameFromUrl(link);
            const result = {
                link,
                title,
                isPlayable: true
            } as ResolvedMediaItem;
            return [result];
        }
        return [];
    }
}
