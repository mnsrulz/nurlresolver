import { GenericFormBasedResolver, ResolvedMediaItem } from "../BaseResolver.js";

export class IndishareResolver extends GenericFormBasedResolver {
    constructor() {
        super({
            domains: [/https?:\/\/www\.indishare/],
            useCookies: true,
            speedRank: 55
        }, 'span#direct_link a');
    }

    async canResolve(_urlToResolve: string): Promise<boolean> {
        return ['techmyntra', 'indishare'].includes(this.getSecondLevelDomain(_urlToResolve) || '');
    }

    async resolveInner(_urlToResolve: string): Promise<ResolvedMediaItem[]> {
        const u = new URL(_urlToResolve);
        u.host = 'techmyntra.net';
        return super.resolveInner(u.href);
    }
}