import { BaseUrlResolver, ResolvedMediaItem } from "../BaseResolver.js";

const tryParseContentLengthFromRangeHeader = (h: string | undefined) => {
    if (h) {
        return parseInt(h.split('/').pop() || '0');
    }
}

const parseFileNameFromContentDisposition = (h: string | undefined) => {
    //Content-Disposition: attachment; filename="Bunny.Video.1080p.WEB-DL.x264.mkv"
    if (h) {
        return /filename="([^"]*)"/.exec(h)?.[1];        
    }
}

export class cloudFlareStorageResolver extends BaseUrlResolver {
    fn1 = async (_urlToResolve: string) => {
        const purl = new URL(_urlToResolve);
        purl.searchParams.delete('x-nu-org');
        const newur = purl.href
        const rs = await this.gotInstance(newur, { headers: { Range: 'bytes=0-0' } });
        const title = this.extractFileNameFromUrl(_urlToResolve);

        return {
            link: newur,
            title,
            isPlayable: true,
            parent: _urlToResolve,
            size: tryParseContentLengthFromRangeHeader(rs.headers['content-range']),
            lastModified: rs.headers['last-modified'],
            contentType: rs.headers['content-type']
        } as ResolvedMediaItem;
    }

    constructor() {
        super({
            domains: [/https?:\/\/\w+\.r2\.cloudflarestorage\.com/],
            speedRank: 95
        });
    }

    async resolveInner(_urlToResolve: string): Promise<ResolvedMediaItem | ResolvedMediaItem[]> {
        try {
            return await this.fn1(_urlToResolve);
        } catch (error) {
            const xnr = new URL(_urlToResolve).searchParams.get('x-nu-org');
            if (xnr) {
                const nlinks = await this._context?.resolve(xnr);
                const whichIsResolvable = nlinks?.find(x => this.canResolve(x.link));   //this will do the trick as long as there's only one cloudflarestorage link in that page.
                if (whichIsResolvable) {
                    return this.fn1(whichIsResolvable.link);
                }
            }
        }
        return [];
    }

    async fillMetaInfo(resolveMediaItem: ResolvedMediaItem): Promise<void> {
        ////empty one
    }
}

export class pixeldraStorageResolver extends BaseUrlResolver {
    fn1 = async (_urlToResolve: string) => {
        console.log(_urlToResolve);

        const purl = new URL(_urlToResolve);
        purl.searchParams.delete('x-nu-org');
        const newur = purl.href
        const rs = await this.gotInstance.head(newur);
        const title = parseFileNameFromContentDisposition(rs.headers["content-disposition"]) || this.extractFileNameFromUrl(_urlToResolve);

        return {
            link: newur,
            title,
            isPlayable: true,
            parent: _urlToResolve,
            size: rs.headers["content-length"] && parseInt(rs.headers["content-length"]),
            lastModified: rs.headers['last-modified'],
            contentType: rs.headers['content-type']
        } as ResolvedMediaItem;
    }

    constructor() {
        super({
            domains: [/https?:\/\/pixeldra/],
            speedRank: 95
        });
    }

    async resolveInner(_urlToResolve: string): Promise<ResolvedMediaItem | ResolvedMediaItem[]> {
        try {
            return await this.fn1(_urlToResolve);
        } catch (error) {
            const xnr = new URL(_urlToResolve).searchParams.get('x-nu-org');
            if (xnr) {
                const nlinks = await this._context?.resolve(xnr);
                const whichIsResolvable = nlinks?.find(x => this.canResolve(x.link));   //this will do the trick as long as there's only one cloudflarestorage link in that page.
                if (whichIsResolvable) {
                    return this.fn1(whichIsResolvable.link);
                }
            }
        }
        return [];
    }

    async fillMetaInfo(resolveMediaItem: ResolvedMediaItem): Promise<void> {
        ////empty one
    }
}

