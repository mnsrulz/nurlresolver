import { BaseUrlResolver, ResolvedMediaItem } from "../BaseResolver";

export class StreamwireResolver extends BaseUrlResolver {
    constructor() {
        super({
            domains: [/https?:\/\/streamwire/]
        });
    }

    async resolveInner(_urlToResolve: string): Promise<ResolvedMediaItem[]> {
        var links = [] as ResolvedMediaItem[];
        var unpackstr = '';
        var obj = await this.xInstance(_urlToResolve, {
            title: 'title',
            script: ['script']
        });
        const script = (obj.script as string[]).filter(x => x.startsWith('eval(function(p,a,c,k,e,d)'))[0];        
        //have to deal with unpacker in ts
        // const unpack = helper.unPack(script);
        // var regex = /src:"(https[^"]*)/g
        // var el = unpack && regex.exec(unpack)[1];
        // if (el) {
        //     var title = obj.title;
        //     links.push(BaseUrlResolver.prototype.createResult(title, el, '', true));
        // }
        return links;
    }
}