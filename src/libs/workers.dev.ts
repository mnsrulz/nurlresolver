import { BaseUrlResolver, ResolvedMediaItem } from "../BaseResolver.js";
import { parse } from 'content-disposition';

export class WorkersDevResolver extends BaseUrlResolver {
    constructor() {
        super({
            domains: [/https?:\/\/(dl.hdhub\d{0,}.workers.dev)/],
            speedRank: 95
        });
    }

    async resolveInner(_urlToResolve: string): Promise<ResolvedMediaItem[]> {
        let title = this.extractFileNameFromUrl(_urlToResolve);
        try {
            const response = await this.gotInstance.head(_urlToResolve);
            const attachmentFileName = parse(response.headers['content-disposition'] || '');
            title = attachmentFileName.parameters.filename || title;
        } catch (err) {
            //ignore
        }
        const result = {
            isPlayable: true,
            link: _urlToResolve,
            title
        } as ResolvedMediaItem;
        return [result];
    }

    async canResolve(urlToResolve: string): Promise<boolean> {
        const u = new URL(urlToResolve);
        return u.hostname.endsWith('workers.dev') || u.hostname.endsWith('r2.dev') || u.hostname.endsWith('fastdl.lol') 
            || u.hostname.endsWith('obsession.buzz') || u.hostname.endsWith('storage.googleapis.com');
    }
}