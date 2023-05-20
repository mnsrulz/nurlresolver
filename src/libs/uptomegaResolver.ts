import { PandafilesResolver } from "./pandafiles.js";

export class UptomegaResolver extends PandafilesResolver {
    constructor() {
        super();
        this.domains = [/https?:\/\/(uptomega)/];
        this._speedRank = 80;
    }
}
