import { BaseUrlResolver, ResolvedMediaItem } from "../BaseResolver";

export class ClicknUploadResolver extends BaseUrlResolver {
    constructor() {
        super({
            domains: [/https?:\/\/clicknupload/],
            speedRank: 80,
            useCookies: true
        });
    }

    async resolveInner(_urlToResolve: string): Promise<ResolvedMediaItem | ResolvedMediaItem[]> {
        const response = await this.gotInstance(_urlToResolve);
        const response2 = await this.postHiddenForm(response.url, response.body, 0, false);
        const parsedCode = this.parseCaptchaCode(response2.body);
        const formToPost = await this.getHiddenForm(response2.body, 0);

        if (formToPost) {
            formToPost['code'] = parsedCode;
            formToPost['adblock_detected'] = 0;
        }

        const urlToPost = response2.url;
        
        await this.wait(15000);
        const response3 = await this.gotInstance.post(urlToPost, {
            form: formToPost,
            headers: {
                Referer: urlToPost
            },
            followRedirect: false   //it can raise some unhandled error which can potentially cause whole application shutdown.
        });

        const output:{download: string} = this.scrapeHtml(response3.body, {
            download: {
                selector: '#downloadbtn',
                attr: 'onclick'
            }
        });

        const rxResult = /window\.open\('([^']*)'/.exec(output.download);
        if(rxResult){
            const link = rxResult[1];
            const title = this.extractFileNameFromUrl(link);
            const result = {
                link,
                title,
                isPlayable: true
            } as ResolvedMediaItem;
            return [result];
        }
        return [];
    }

    private parseCaptchaCode(html:string): string{
        const result: {code: [{codeValue: string, codePosition: number}]} = this.scrapeHtml(html, {
            // code: "td[align=right]",
            // codeValues: {
            //   listItem: 'td[align=right] span'
            // },
            code: {
              listItem: 'td[align=right] span',
              data: {
                codeValue: {},
                codePosition: {
                  attr: 'style',
                  convert: (x) => {
                    const rxResult = /padding-left:(\d*)px/.exec(x);
                    return rxResult && parseInt(rxResult[1]);
                  }
                }
              }
            },
            // tag: {
            //   listItem: 'td[align=right] span',
            //   data: {
            //     code: {
            //       selector: '',
            //       how: (i: cheerio.Selector) => {
            //         const vals = Object.values(i);
            //         const codeValue = vals['0']['children'][0]['data'];
            //         const styleAttribute = vals['0']['attribs']['style'];
            //         const rxResult = /padding-left:(\d*)px/.exec(styleAttribute);
            //         const position = rxResult && parseInt(rxResult[1]);
            //         return {
            //           codeValue, position
            //         };
            //       }
            //     }
            //   },
            // }
          });

          return result.code
          .sort((a, b) => a.codePosition - b.codePosition)
          .map(x=>x.codeValue)
          .join('');
    }
}
