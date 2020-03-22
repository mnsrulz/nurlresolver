var Xray = require('x-ray')
var x = Xray()
var BaseUrlResolver = require('../BaseResolver');

class MvlinksResolver extends BaseUrlResolver {
    constructor() {
        super();
        this.domains = ['https://mvlinks.com'];
    }

    async resolveInner(_urlToResolve) {
        console.log(`resolving ${_urlToResolve}`)
    }
}

module.exports = MvlinksResolver;