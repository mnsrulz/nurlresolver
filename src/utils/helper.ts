import psl from "psl";
import scrapeIt from "scrape-it";
import got from 'got';
const map = new Map();

export const parseHiddenForm = (html: string, ix?: number) => parseForms(html).output[ix || 0];

export const parseHiddenFormV2 = (html: string, ix?: number) => transformScrapedFormToFormData(parseForms(html).output[ix || 0]);

export const getServerPublicIp = async () => {
    const result = await got('https://api.ipify.org?format=json', {
        responseType: 'json',
        resolveBodyOnly: true,
        cache: map  //cache it assuming the ip don't change often
    }) as { ip: string };
    return result.ip;
}

export const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const nodeatob = (str: string) => Buffer.from(str, 'base64').toString();
export const nodebtoa = (str: string) => Buffer.from(str).toString('base64');

export const parseForms = (html: string) => {
    const result = scrapeIt.scrapeHTML(html, {
        output: {
            listItem: 'form',
            data: {
                action: {
                    attr: 'action'
                },
                kv: {
                    listItem: 'input',
                    data: {
                        name: {
                            attr: 'name'
                        }, value: {
                            attr: 'value'
                        }
                    }
                }
            }
        }
    }) as { output: ScrapedForm[] };
    return result;
}

export const transformScrapedFormToFormData = (scrapedForm: ScrapedForm) => {
    if(!scrapedForm?.kv) return;
    const form: Record<string, string> = {};
    for (const { name, value } of scrapedForm.kv) {
        name !== undefined && value !== undefined &&
            name !== null && value !== null && (form[name] = value);
    }
    return form;
}

export const parseAllLinks = (html: string, context: string, baseUrl = '') => {
    const result: ScrapedAnchorElement[] = [];
    const { output } = scrapeIt.scrapeHTML(html, {
        output: {
            listItem: `${context} a`,
            data: {
                title: '',
                link: {
                    attr: 'href'
                }
            }
        }
    }) as { output: ScrapedAnchorElement[] };

    output.forEach(x => {
        if (baseUrl && baseUrl.startsWith('http') && !x.link?.startsWith('http')) {
            result.push({
                link: new URL(x.link, baseUrl).href,
                title: x.title
            });
        } else if (x.link?.startsWith('http')) {
            result.push({
                link: x.link,
                title: x.title
            });
        }
    });
    return result;
}

export const parseElementAttributes = (html: string, context: string, attribute: string) => {
    const { output } = scrapeIt.scrapeHTML(html, {
        output: {
            listItem: `${context}`,
            data: {
                value: {
                    attr: attribute
                }
            }
        }
    }) as { output: { value: string }[] };

    return output.map(x => x.value);
}

export const parseScripts = (html: string, context = '') => {
    const parsedScripts: { output: [{ s: string }] } = scrapeIt.scrapeHTML(html, {
        output: {
            listItem: `${context} script`,
            data: {
                s: {
                    how: 'html'
                }
            }
        }
    });
    return parsedScripts.output.map(x => x.s);
}

export const scrapeLinkHref = (html: string, selector: string) => {
    const { link }: { link: string } = scrapeIt.scrapeHTML(html, {
        link: {
            selector: selector,
            attr: 'href'
        }
    });
    return link;
}

export const scrapePageTitle = (html: string) => {
    const { title }: { title: string } = scrapeIt.scrapeHTML(html, {
        title: 'title'
    });
    return title;
}

export const scrapeInnerText = (html: string, selector: string) => {
    const { title }: { title: string } = scrapeIt.scrapeHTML(html, {
        title: selector
    });
    return title;
}

export const getSecondLevelDomain = (someUrl: string) => {
    const hostname = new URL(someUrl);
    const parsed = psl.parse(hostname.hostname) as psl.ParsedDomain;
    return parsed.sld;
}

export const isValidHttpUrl = (someUrl: string) => {
    try {
        new URL(someUrl);
    } catch (_) {
        return false;
    }
    return true;
}

export const extractFileNameFromUrl = (someUrl: string) => {
    let fileName = `${new URL(someUrl).pathname.split('/').slice(-1)[0]}`;
    fileName = decodeURIComponent(fileName);
    return fileName;
}


export interface ScrapedForm {
    action: string,
    kv: [{
        name: string,
        value: string
    }]
}

export interface ScrapedAnchorElement {
    link: string,
    title: string
}

export const parseGoogleFileId = (_url: string) => {
    const rx0 = /(drive|docs)\.google\.com\/open\?id=(.*)/
    const rx1 = /(drive|docs)\.google\.com\/file\/d\/(.*?)\//
    const rx2 = /(drive|docs)\.google\.com\/uc\?id=(.*?)&/
    const rx3 = /(drive|docs)\.google\.com\/u\/\d{0,3}?\/uc\?id=(.*?)&/
    const regexresult = rx0.exec(_url) || rx1.exec(_url) || rx2.exec(_url)  || rx3.exec(_url)
    return regexresult![2];
}