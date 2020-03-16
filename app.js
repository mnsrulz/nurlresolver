var nUrlResolver = new (require('./plugins/UrlResolver'))();

// (async () => {
//     var linkToResolve = 'someurl';
//     var results = await nUrlResolver.resolveRecursive(linkToResolve, {
//         timeout: 15
//     })
// })()

module.exports = nUrlResolver;