import { BaseUrlResolver, ResolvedMediaItem } from "../BaseResolver";

export class ExtralinksResolver extends BaseUrlResolver {
    constructor() {
        super({
            domains: [/https?:\/\/extralinks/]
        });        
    }

    async resolveInner(_urlToResolve: string): Promise<ResolvedMediaItem[]> {
        const links = [] as ResolvedMediaItem[];
        const page = await this.gotInstance(_urlToResolve);
        const regex_link = /document\.getElementById\("download"\)\.src="([^"]*)/g;
        const matchesLink = regex_link.exec(page.body);
        if (matchesLink && matchesLink[1]) {
            const result = <ResolvedMediaItem>{
                link: matchesLink[1],                
                isPlayable: true
            };
            links.push(result);
        } else{
            const regex_link02 = /location\.href ="(https:\/\/drive\.google\.com[^"]*)"/g;
            const anotherMatch = regex_link02.exec(page.body);
            if (anotherMatch && anotherMatch[1]){
                const result = <ResolvedMediaItem>{
                    link: anotherMatch[1],                
                    isPlayable: false
                };
                links.push(result);
            }
        }
        return links;
    }
}