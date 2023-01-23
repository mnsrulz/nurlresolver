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

export class StreamtapeResolver extends BaseUrlResolver {
    constructor() {
        super({
            domains: [/https?:\/\/streamtape/],
            useCookies: true
        });
    }

    async resolveInner(_urlToResolve: string): Promise<ResolvedMediaItem[]> {
        console.log(_urlToResolve)
        const resp = await this.gotInstance(_urlToResolve);
        console.log(resp.headers);

        await this.wait(1000);

//const rx = /document.*((?=id\=)[^\"']+)/;


// const rxrespo = rx.exec(resp.body);
// console.log(rxrespo);

        const tx = this.scrapeText(resp.body, '#norobotlink');
        console.log(tx);

        //const turl = `https:/${tx}&dl=1`;
        const turl = `https:/${tx}`;
        console.log(`turl: ${turl}`);
        const resp2 = await this.gotInstance.head(turl, {
            followRedirect: false
        });
        console.log(resp2.statusCode);
        console.log(resp2.headers);
        const resp3 = await this.gotInstance.head(turl, {
            followRedirect: false
        });
        console.log(resp3.statusCode);
        console.log(resp3.headers);
        console.log('ended...')
        // const u = new URL(turl);
        // console.log(u.href);
        return [];
    }
}