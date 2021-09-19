import { GenericFormBasedResolver } from "../BaseResolver";

export class IndishareResolver extends GenericFormBasedResolver {
    constructor() {
        super({
            domains: [/https?:\/\/www\.indishare/],
            useCookies: true,
            speedRank: 55
        }, 'span#direct_link a');
    }

    async canResolve(_urlToResolve: string): Promise<boolean> {
        return this.getSecondLevelDomain(_urlToResolve) === 'indishare';
    }
}