import { UrlResolver } from "./UrlResolver";
import * as helper from './utils/helper';
import { MyV2 } from "./MyV2";

const u = 'https://www.mkvcinemas.fi/?aa8266cad2=cGFGTlFEbHl6V2k2NjhGeStFSE9zVkNoblV3NnM3dEVueG1yR25RRW92M1R6d2kwUWVHODd1ckZ4dDZCQWwrMjdGVjdDRDdxZk9VS0N5UUgwbW8yVkVtZ0wxNmFsUkhHc0MwNDNCZjdGUEU9';

(async () => {
    const myv2 = new MyV2();
    const r = await myv2.resolveInner(u);
})();



//uncomment for testing
// (async () => {
//   var instance = new UrlResolver();
//   var urlToResolve = "";
//   var results = await instance.resolveRecursive(urlToResolve, {
//     timeout: 30,
//   });
//   console.log(results);
//   process.exit();
// })();

export = new UrlResolver();


