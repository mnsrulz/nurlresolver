import { GenericFormBasedResolver } from "../BaseResolver.js";

export class UploadeverResolver extends GenericFormBasedResolver {
    constructor() {
        super({
            domains: [/https?:\/\/(uploadever|uploadbuzz)/],
            useCookies: true,
            speedRank: 85
        }, '.download-button a');
    }
}