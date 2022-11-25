import scrapeIt = require("scrape-it");

// export const ParseFormActionUrl = (html: string, ix?: number) => {
//     const result = scrapeIt.scrapeHTML(html, {
//         rs: {
//             listItem: "form",
//             data: {
//                 action: {
//                     attr: 'action'
//                 }
//             }
//         }
//     }) as { rs: [{ action: string }] };
//     return result.rs[ix || 0].action;
// }

export const ParseHiddenForm = (html: string, ix?: number): ScrapedForm => ParseForms(html).output[ix || 0];

export const ParseForms = (html: string): { output: ScrapedForm[] } => {
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
    }) as { output: [ScrapedForm] };
    return result;
}

export const transformScrapedFormToFormData = (scrapedForm: ScrapedForm): Record<string, string> => {
    const form: Record<string, string> = {};
    for (const { name, value } of scrapedForm.kv) {
        name !== undefined && value !== undefined &&
            name !== null && value !== null && (form[name] = value);
    }
    return form;
}

export const parseAllLinks = (html: string, context: string): ScrapedAnchorElement[] => {
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

export const parseScripts = (html: string, context: string = '') => {
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
