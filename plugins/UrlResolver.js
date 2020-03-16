class UrlResolver {
    constructor() {
        var resolvers = [];

        require('fs').readdirSync(__dirname + '/libs/').forEach(function (file) {
            if (file.match(/\.js$/) !== null && file !== 'index.js') {
                var name = file.replace('.js', '');
                var inst = require('./libs/' + file);
                var instance = new inst();
                resolvers.push(instance);
            }
        });

        this.allResolvers = resolvers;
    }

    /**
     * 
     * @param {string} urlToResolve 
     * @returns {string}
     */
    async resolve(urlToResolve) {
        for (let index = 0; index < this.allResolvers.length; index++) {
            const element = this.allResolvers[index];
            var fs = await element.resolve(urlToResolve);
            if (fs && fs.length > 0)
                return fs;
        }
    }

    /**
     * Resolve recursively all the urls until all not fetched. It's a heavy call and 
     * can take minutes to resolve if the sources are slow to respond.
     * @param {string} urlToResolve 
     * @returns {collection of resolved links}
     */
    async resolveRecursive(urlToResolve) {
        var instanceOfUrlResolver = this;
        var myPlayableResources = [];
        var visitedUrls = [];
        await explode(urlToResolve);
        console.log(JSON.stringify(myPlayableResources));
        return myPlayableResources;
        async function explode(urlToVisit) {
            if (visitedUrls.some(x => x === urlToVisit)) return;
            visitedUrls.push(urlToVisit);
            console.log(urlToVisit);
            var resolvedUrls = await instanceOfUrlResolver.resolve(urlToVisit);
            if (resolvedUrls) {
                var p = []
                resolvedUrls.filter(x => x.isPlayable).forEach(x => myPlayableResources.push(x));
                resolvedUrls.filter(x => !x.isPlayable).forEach(x => {
                    p.push(explode(x.link));
                });
                await Promise.all(p);
            }
        }
    }
}

module.exports = UrlResolver;