import { GenericFormBasedResolver } from "../BaseResolver";

export class UploadRajaResolver extends GenericFormBasedResolver {
    constructor() {
        super({
            domains: [/https?:\/\/uploadraja/],
            speedRank: 90
        }, 'a.download');
    }
}