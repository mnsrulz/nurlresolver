import { UrlResolver } from "./UrlResolver";

//uncomment for testing
(async () => {
  var instance = new UrlResolver();
  var urlToResolve = "https://streamtape.com/v/41zal2rWRXCKgDq";
  const r = await fetch(urlToResolve);
  const tx = await r.text();
  console.log(tx);

  // var results = await instance.resolve(urlToResolve, {
  //   timeout: 30,
  // });
  // console.log(results);
  process.exit();
})();

export = new UrlResolver();
