import { UrlResolver } from "./UrlResolver.js";

(async () => {
    const resolver = new UrlResolver();
    const urlToResolve = "";
    const results = await resolver.resolve(urlToResolve, {
        timeout: 30,
    });
    console.log(results);
    process.exit();
})();