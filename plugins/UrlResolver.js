// var linkrit = require('./libs/linkrit');
// var mvlinks = require('./libs/mvlinks');
// var hdhub4u = require('./libs/hdhub4u');
// var hblinks = require('./libs/hblinks');
// var megaup = require('./libs/megaup');
// var clicknupload = require('./libs/clicknupload');
// var linkstaker = require('./libs/linkstaker');
// var crnews = require('./libs/crnews');
// var zupload = require('./libs/zupload');
// var letsupload = require('./libs/letsupload');


class UrlResolver {
    constructor() {
        //this.allResolvers = [new linkrit(), new mvlinks(), new hdhub4u(), new hblinks(), new megaup(), new clicknupload(), new linkstaker(), new crnews(), new zupload(), new letsupload()];
        var resolvers = [];

        require('fs').readdirSync(__dirname + '/libs/').forEach(function (file) {
            if (file.match(/\.js$/) !== null && file !== 'index.js') {
                var name = file.replace('.js', '');
                //   exports[name] = require('./' + file);

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
        var arrayToReturn = [];
        await rec(urlToResolve, arrayToReturn, []);
        return arrayToReturn;
        async function rec(o, j, k) {
            if (k.some(x => x === o)) return '';
            k.push(o);
            console.log(o);
            if (o) {
                var p = [];
                var z = await instanceOfUrlResolver.resolve(o);
                if (z) {
                    z.filter(x => x.isPlayable).forEach(x => j.push(x));
                    z.filter(x => !x.isPlayable).forEach(x => {
                        p.push(rec(x.link, j, k));
                    });
                }
                await Promise.all(p);
            } else {
                return '';
            }
        }
    }
}

module.exports = UrlResolver;