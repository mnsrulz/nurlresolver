import {readdirSync} from "fs";
export class UrlResolver {
    allResolvers: any[];
    constructor() {
        var resolvers: any[] = [];

        readdirSync(__dirname + '/libs/').forEach(function (file) {
            if (file.match(/\.js$/) !== null && file !== 'index.js') {
                var name = file.replace('.js', '');
                var inst = require('./libs/' + file);                
                var allInstances = Object.keys(inst);
                allInstances.forEach(element => {
                    var instance = new inst[element]();
                    resolvers.push(instance);                    
                });

            }
        });

        this.allResolvers = resolvers;
    }

    /**
     * 
     * @param {string} urlToResolve 
     * @returns {string}
     */
    async resolve(urlToResolve: string, options: { timeout: number; }) {
        const defaultValues = {
            timeout: 30
        };
        options = Object.assign(defaultValues, options);
        const _allResolvers = this.allResolvers;
        const timeoutPromise = new Promise(function (resolve, reject) {
            setTimeout(resolve, options.timeout * 1000);
        });
        const actualPromise = _();
        return await Promise.race([timeoutPromise, actualPromise]);
        async function _() {
            for (let index = 0; index < _allResolvers.length; index++) {
                const element = _allResolvers[index];
                var fs = await element.resolve(urlToResolve);
                if (fs && fs.length > 0)
                    return fs;
            }
        }
    }

    /**
     * Resolve recursively all the urls until all not fetched. It's a heavy call and 
     * can take minutes to resolve if the sources are slow to respond.
     * @param {string} urlToResolve 
     * @returns {collection of resolved links}
     */
    async resolveRecursive(urlToResolve: string, options: { timeout: any; }) {
        const defaultValues = {
            timeout: 30
        };
        options = Object.assign(defaultValues, options);

        var instanceOfUrlResolver = this;
        var myPlayableResources: any[] = [];
        var visitedUrls: any[] = [];

        const timeoutPromise = new Promise(function (resolve, reject) {
            setTimeout(resolve, options.timeout * 1000);
        });
        const actualPromise = explode(urlToResolve);
        await Promise.race([timeoutPromise, actualPromise]);

        console.log(JSON.stringify(myPlayableResources));
        return myPlayableResources;
        async function explode(urlToVisit: string) {
            if (visitedUrls.some(x => x === urlToVisit)) return;
            visitedUrls.push(urlToVisit);
            console.log(urlToVisit);
            var resolvedUrls = await instanceOfUrlResolver.resolve(urlToVisit, options) as RsolveReturnType[];
            if (resolvedUrls) {
                var p: any[] = []
                resolvedUrls.filter(x => x.isPlayable).forEach(x => myPlayableResources.push(x));
                resolvedUrls.filter(x => !x.isPlayable).forEach(x => {
                    p.push(explode(x.link));
                });
                await Promise.all(p);
            }
        }
    }
}

interface RsolveReturnType{
    isPlayable: boolean,
    link: string
}