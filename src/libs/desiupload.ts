import { GenericFormBasedResolver } from "../BaseResolver.js";

export class DesiuploadResolver extends GenericFormBasedResolver {
    constructor() {
        super({
            domains: [/https?:\/\/(dl\d{0,}.desiupload)/],
            useCookies: true,
            speedRank: 85
        }, '.downloadbtn a', 1);
    }
}
