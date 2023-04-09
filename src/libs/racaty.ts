import { GenericFormBasedResolver } from "../BaseResolver.js";

export class RacatyResolver extends GenericFormBasedResolver {
    constructor() {
        super({
            domains: [/https?:\/\/racaty/],
            speedRank: 60
        }, 'a#uniqueExpirylink');
    }
}