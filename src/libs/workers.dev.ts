import { BaseUrlResolver, ResolvedMediaItem } from "../BaseResolver";

export class WorkersDevResolver extends BaseUrlResolver {
    constructor() {
        super({
            domains: [/https?:\/\/(dl.hdhub\d{0,}.workers.dev)/]            
        });
    }

    async resolveInner(_urlToResolve: string): Promise<ResolvedMediaItem[]> {        
        var result = {
            isPlayable: true,
            link: _urlToResolve
        } as ResolvedMediaItem;        
        return [result];
    }
}