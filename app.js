var nUrlResolver = new (require('./plugins/UrlResolver'))();

// (async()=>{
//     var linkToResolve = 'someurltotest';
//     var results = await nUrlResolver.resolveRecursive(linkToResolve)
// })()

module.exports = nUrlResolver;