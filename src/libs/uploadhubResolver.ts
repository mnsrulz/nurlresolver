import { GenericFormBasedResolver } from "../BaseResolver";

export class UploadhubResolver extends GenericFormBasedResolver {
    constructor() {
        super({
            domains: [/https?:\/\/(uploadhub.ws|uploadhub.pw)/],
            useCookies: true,
            speedRank: 60
        }, '#direct_link a');
    }
}
