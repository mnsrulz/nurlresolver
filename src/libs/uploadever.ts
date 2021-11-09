import { BaseUrlResolver, GenericFormBasedResolver, ResolvedMediaItem } from "../BaseResolver";


export class UploadeverResolver extends GenericFormBasedResolver {
    constructor() {
        super({
            domains: [/https?:\/\/(uploadever|uploadbuzz)/],
            useCookies: true,
            speedRank: 40
        }, '.download-button a');
    }
}