import { GenericFormBasedResolver } from "../BaseResolver.js";

export class UploadhubResolver extends GenericFormBasedResolver {
    constructor() {
        super({
            domains: [/https?:\/\/uploadhub/],
            useCookies: true,
            speedRank: 60
        }, '#direct_link a');
    }
}
