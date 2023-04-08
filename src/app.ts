import { UrlResolver } from "./UrlResolver";
export * from './BaseResolver';
export * as utils from './utils/helper';

const nurlresolver = new UrlResolver();
export default nurlresolver;

module.exports = nurlresolver;
module.exports.default = nurlresolver;
