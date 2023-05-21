import { GenericFormBasedResolver } from "../BaseResolver.js";

export class UploadFlixResolver extends GenericFormBasedResolver {
    constructor() {
        super({
            domains: [/https?:\/\/uploadflix/],
            speedRank: 75
        }, 'a.downloadbtn');
    }
}