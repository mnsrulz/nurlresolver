import { UrlResolver } from "./UrlResolver";

(async () => {
    const resolver = new UrlResolver();
    var urlToResolve = "";
    var results = await resolver.resolve(urlToResolve, {
        timeout: 30,
    });
    console.log(results);
    process.exit();
})();