import { BaseUrlResolver, ResolvedMediaItem } from "../BaseResolver.js";

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

    async canResolve(urlToResolve: string): Promise<boolean> {
        const u = new URL(urlToResolve);
        return u.hostname.endsWith('workers.dev') || u.hostname.endsWith('r2.dev');
    }
}