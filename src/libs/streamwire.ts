import { BaseUrlResolver, ResolvedMediaItem } from "../BaseResolver";
var _eval = require('eval');

export class StreamwireResolver extends BaseUrlResolver {
    constructor() {
        super({
            domains: [/https?:\/\/streamwire/]
        });
    }

    async resolveInner(_urlToResolve: string): Promise<ResolvedMediaItem[]> {
        var links = [] as ResolvedMediaItem[];
        var obj = await this.xInstance(_urlToResolve, {
            title: 'title',
            script: ['script']
        });
        const script = (obj.script as string[]).filter(x => x.startsWith('eval(function(p,a,c,k,e,d)'))[0];
        if (script) {
            var __: any;
            var _proxyPlayer = (_: any) => __ = _;
            _eval(script, '', {
                window: {
                    hola_player: _proxyPlayer
                }
            }, true);

            if (__) {
                var link = __.sources[0].src;
                var result = { link, title: obj.title, isPlayable: true, poster: __.poster } as ResolvedMediaItem;
                links.push(result);
            }
        }
        return links;
    }
}