import { GenericFormBasedResolver } from "../BaseResolver";

export class RacatyResolver extends GenericFormBasedResolver {
    constructor() {
        super({
            domains: [/https?:\/\/racaty/],
            speedRank: 60
        }, 'a#uniqueExpirylink');
    }
}