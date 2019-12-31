var Xray = require('x-ray')
var x = Xray()

var BaseUrlResolver = require('../BaseResolver');

class ClicknuploadResolver extends BaseUrlResolver {
    constructor() {
        super();
        this.domains = ['https://clicknupload.org'];
    }

    async resolveInner(_urlToResolve) {
        var links = [];
        return links;
        //clicknupload requires captcha verification..
        // var promise = new Promise(function (resolve, reject) {
        //     x(_urlToResolve, 'form', {
        //         n: ['input@name'],
        //         v: ['input@value']
        //     })(async (err, obj) => {
        //         var datatopost = {};
        //         for (let index = 0; index < obj.n.length; index++) {
        //             const n = obj.n[index];
        //             const v = obj.v[index];
        //             datatopost[n] = v;
        //         }
        //         var response = await axios.post(_urlToResolve, datatopost);
        //         resolve(links);
        //     })
        // });
        // await promise;
        // return links;
    }
}

module.exports = ClicknuploadResolver;