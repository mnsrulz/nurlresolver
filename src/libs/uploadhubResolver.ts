import { GenericFormBasedResolver } from "../BaseResolver";

export class UploadhubResolver extends GenericFormBasedResolver {
    constructor() {
        super({
            domains: [/https?:\/\/(uploadhub.ws)/],
            useCookies: true,
            speedRank: 90
        }, '#direct_link a');
    }
}
