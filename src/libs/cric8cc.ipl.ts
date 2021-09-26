import { BaseUrlResolver, ResolvedMediaItem } from "../BaseResolver";

export class Cric8ccIplStreamResolver extends BaseUrlResolver {
    constructor() {
        super({
            domains: [/https?:\/\/(www\.)?cric8\.cc\/ipl[\d]{0,}\.php/]
        });
    }

    async resolveInner(_urlToResolve: string): Promise<ResolvedMediaItem[]> {
        return []; //non working
        // var response = await this.gotInstance(_urlToResolve);
        // const scriptTag = await this.xInstance(response.body, 'script');
        // const rxforvar = /\[([^\]]*)/;
        // const rxfortokenvlaue = /([\d]{1,})\)/
        // const rxexecresult = rxforvar.exec(scriptTag)![1];
        // const tokenvalue = rxfortokenvlaue.exec(scriptTag)![1];
        // const YPd = rxexecresult.split(',');
        // let Whs = '';
        // YPd.forEach((value) => {
        //     Whs += String.fromCharCode(parseInt(this.nodeatob(value).replace(/\D/g, '')) - parseInt(tokenvalue));
        // });
        // const decodedOutputScript = decodeURIComponent(escape(Whs));
        // const regexForFinalLink = /source: '([^']*)'/
        // const link = regexForFinalLink.exec(decodedOutputScript)![1];
        // const result = { link, isPlayable: true } as ResolvedMediaItem;
        // result.headers = { "Referer": _urlToResolve };
        // return [result];
    }
}