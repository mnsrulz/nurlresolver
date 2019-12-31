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

class UrlResolver {
    allResolvers = [];
    constructor() {
        //this.allResolvers = [new linkrit(), new mvlinks(), new hdhub4u(), new hblinks(), new megaup(), new clicknupload(), new linkstaker(), new crnews(), new zupload(), new letsupload()];
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
}

module.exports = UrlResolver;