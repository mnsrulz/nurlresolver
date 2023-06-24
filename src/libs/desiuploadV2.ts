import { GenericFormBasedResolver } from "../BaseResolver.js";

export class DesiuploadResolverV2 extends GenericFormBasedResolver {
    constructor() {
        super({
            domains: [/https?:\/\/desiupload/],
            useCookies: true,
            speedRank: 85
        }, 'a.btn-block');
    }
}
