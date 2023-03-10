import scrapeIt = require("scrape-it");

export const parseHiddenForm = (html: string, ix?: number) => parseForms(html).output[ix || 0];

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
    const form: Record<string, string> = {};
    for (const { name, value } of scrapedForm.kv) {
        name !== undefined && value !== undefined &&
            name !== null && value !== null && (form[name] = value);
    }
    return form;
}

export const parseAllLinks = (html: string, context: string) => {
    const { output } = scrapeIt.scrapeHTML(html, {
        output: {
            listItem: `${context} a`,
            data: {
                text: '',
                href: {
                    attr: 'href'
                }
            }
        }
    }) as { output: ScrapedAnchorElement[] };
    return output;
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


export interface ScrapedForm {
    action: string,
    kv: [{
        name: string,
        value: string
    }]
}

export interface ScrapedAnchorElement {
    href: string,
    text: string
}
