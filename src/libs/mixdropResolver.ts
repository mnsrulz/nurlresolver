import { BaseUrlResolver, ResolvedMediaItem } from "../BaseResolver.js";
import { createContext, runInContext } from 'vm';

export class mixdropResolver extends BaseUrlResolver {
    constructor() {
        super({
            domains: [/https?:\/\/mixdrop/],
            speedRank: 70
        });
    }

    async resolveInner(_urlToResolve: string): Promise<ResolvedMediaItem[]> {
        const u = new URL(_urlToResolve);
        if(u.pathname.startsWith('/f/'))
            u.pathname = u.pathname.replace('/f/','/e/');
        const response = await this.gotInstance(u.href);
        const parsedScripts = this.parseScripts(response.body);
        for (const s of parsedScripts) {
            if (s.trimStart().startsWith('MDCore')) {
                const context = createContext({
                    MDCore: {}
                });
                runInContext(s, context);
                const link = context.MDCore.wurl.startsWith('http') ? context.MDCore.wurl : `https:${context.MDCore.wurl}`;
                const title = this.scrapeInnerText(response.body, '.title a');
                const result = { link, title: `${title}.mp4`, isPlayable: true } as ResolvedMediaItem;
                return [result];
            }
        }
        return [];
    }
}
