import { BaseUrlResolver, ResolvedMediaItem } from "../BaseResolver";
// import * as unpacker from 'unpacker';

export class StreamwireResolver extends BaseUrlResolver {
    constructor() {
        super({
            domains: [/https?:\/\/streamwire/]
        });
    }

    async resolveInner(_urlToResolve: string): Promise<ResolvedMediaItem[]> {
        return [];  //not working
        // const links = [] as ResolvedMediaItem[];
        // var obj = await this.xInstance(_urlToResolve, {
        //     title: 'title',
        //     script: ['script']
        // });
        // const script = (obj.script as string[]).filter(x => unpacker.detect(x))[0];
        // if (script) {
        //     const unpacked = unpacker.unpack(script);
        //     const sourceRx = /sources:\[{src:"([^"]*)"/;
        //     const link = sourceRx.exec(unpacked)![1];
        //     const result = await this.gotInstance.head(link);   //doing this--as it's required to hit this so the media can be downloaded from any ip address            
        //     let title = link.endsWith('m3u8') ? obj.title + '.m3u8' : obj.title;
        //     links.push({ link, title, isPlayable: true } as ResolvedMediaItem);
        // }
        // return links;
    }
}