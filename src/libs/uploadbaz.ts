import { GenericFormBasedResolver } from "../BaseResolver";

export class UploadbazResolver extends GenericFormBasedResolver {
    constructor() {
        super({
            domains: [/https?:\/\/(uploadbaz)/],
            useCookies: true,
            speedRank: 40
        }, '#container a.btn-danger');
    }
}
