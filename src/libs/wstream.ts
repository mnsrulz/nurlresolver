import { BaseUrlResolver, ResolvedMediaItem } from "../BaseResolver";
import * as unpacker from 'unpacker';

export class WstreamResolver extends BaseUrlResolver {
    constructor() {
        super({
            domains: [/https?:\/\/(wstream|streamcdn)/]
        });
    }

    async resolveInner(_urlToResolve: string): Promise<ResolvedMediaItem[]> {
        var response = await this.gotInstance(_urlToResolve, {
            headers: {
                Referer: _urlToResolve
            }
        });

        var obj = await this.xInstance(response.body, {
            title: 'title',
            script: ['script']
        });
        const script = (obj.script as string[]).filter(x => unpacker.detect(x))[0];
        if (script) {
            const unpacked = unpacker.unpack(script);
            const rxForStream = /source:"([^"]*)"/;
            const link = rxForStream.exec(unpacked)![1];
            const url = new URL(link);
            url.port = '8080';
            url.protocol = 'http';  //https is not supported in some of the browser
            //let's pass the original too, just in case if that starts to work will remove in future.
            const httpsResult = { link, title: 'https', isPlayable: true } as ResolvedMediaItem;
            const httpResult = { link: url.href, title: 'http', isPlayable: true } as ResolvedMediaItem;
            return [httpResult, httpsResult];
        }
        return [];
    }
}