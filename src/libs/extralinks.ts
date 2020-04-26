import { BaseUrlResolver, ResolvedMediaItem } from "../BaseResolver";

export class ExtralinksResolver extends BaseUrlResolver {
    constructor() {
        super({
            domains: [/https?:\/\/extralinks/]
        });        
    }

    async resolveInner(_urlToResolve: string): Promise<ResolvedMediaItem[]> {
        let links = [] as ResolvedMediaItem[];
        var page = await this.gotInstance(_urlToResolve);
        var regex_link = /document\.getElementById\("download"\)\.src="([^"]*)/g;
        var matchesLink = regex_link.exec(page.body);
        if (matchesLink && matchesLink[1]) {
            var result = <ResolvedMediaItem>{
                link: matchesLink[1],                
                isPlayable: true
            };
            links.push(result);
        } else{
            var regex_link02 = /location\.href ="(https:\/\/drive\.google\.com[^"]*)"/g;
            var anotherMatch = regex_link02.exec(page.body);
            if (anotherMatch && anotherMatch[1]){
                var result = <ResolvedMediaItem>{
                    link: anotherMatch[1],                
                    isPlayable: false
                };
                links.push(result);
            }
        }
        return links;
    }
}