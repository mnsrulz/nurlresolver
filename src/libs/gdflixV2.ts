import { BaseUrlResolver, ResolvedMediaItem } from "../BaseResolver.js";

export class gdflixV2Resolver extends BaseUrlResolver {
    constructor() {
        super({
            domains: [/https?:\/\/new\.gdflix/],
            speedRank: 95,
            useCookies: true
        });
    }

    async resolveInner(_urlToResolve: string): Promise<ResolvedMediaItem[]> {
        const response = await this.gotInstance(_urlToResolve);
        const allLinks = this.scrapeAllLinks(response.body, 'body .text-center');
        const validLinks= allLinks.filter(v => !v.link.startsWith('https://new.gdflix') && !v.link.startsWith('https://t.me'));
        try {
            const rx = /formData\.append\("key", "([^"]*)"/;
            const key = rx.exec(response.body)?.[1];
            const response2 = await this.gotInstance.post(_urlToResolve, {
                form: {
                    action: "direct",
                    key: key,
                    action_token: ""
                },
                headers: {
                    "x-token": "new.gdflix.cfd",
                    Referer: _urlToResolve
                },
                followRedirect: false
            }).json<{url:string}>();
            
            const response3 = await this.gotInstance(response2.url);
            const rx1 = /worker_url = '([^']*)'/
            const workerUrl = rx1.exec(response3.body)?.[1];
            if(workerUrl){
                validLinks.push({
                    link: workerUrl,
                    title: 'cfworkers'
                } as ResolvedMediaItem)
            }
        } catch (error) {
            
        }
        return validLinks;
    }
}
