import { BaseUrlResolver, ResolvedMediaItem } from "../BaseResolver";

export class WorkersDevResolver extends BaseUrlResolver {
    constructor() {
        super({
            domains: [/https?:\/\/(dl.hdhub\d{0,}.workers.dev)/],
            speedRank: 95
        });
    }

    async resolveInner(_urlToResolve: string): Promise<ResolvedMediaItem[]> {
        const title = this.extractFileNameFromUrl(_urlToResolve);
        const result = {
            isPlayable: true,
            link: _urlToResolve,
            title
        } as ResolvedMediaItem;
        return [result];
    }
}