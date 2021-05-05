import { ResolvedMediaItem, BaseUrlResolver } from "./BaseResolver";
import * as allResolverImports from "./allResolvers";
import { UrlResolverOptions } from "./UrlResolverOptions";
const debug = require('debug')('nurl:UrlResolver');

export class UrlResolver {
  private allResolvers: any[];
  constructor() {
    //do filtering of the resolvers here
    this.allResolvers = Object.values(allResolverImports).filter((x) =>
      x.prototype instanceof BaseUrlResolver
    );
  }

  /**
     * 
     * @param {string} urlToResolve 
     * @returns {string}
     */
  async resolve(
    urlToResolve: string | string[],
    options: Partial<UrlResolverOptions> = {},
  ): Promise<ResolvedMediaItem[]> {
    const _options = Object.assign({
      timeout: 30
    }, options);
    const _allResolvers = this.allResolvers;
    let result: ResolvedMediaItem[] = [];
    const timeoutPromise = new Promise(resolve => setTimeout(resolve, _options.timeout * 1000));
    const actualPromise = _();
    await Promise.race([timeoutPromise, actualPromise]);
    return result;
    async function _() {
      const urlsToResolve = typeof urlToResolve === "string" ? [urlToResolve] : urlToResolve;
      const promises: Promise<any>[] = [];
      for (const iteratorurl of urlsToResolve) {
        for (const resolver of _allResolvers) {
          const element: BaseUrlResolver = new resolver();
          const promise = element.resolve(iteratorurl, _options).then(resolvedItems => result = [...result, ...resolvedItems]);
          promises.push(promise);
        }
      }
      await Promise.all(promises);
    }
  }

  /**
     * Resolve recursively all the urls until all not fetched. It's a heavy call and 
     * can take minutes to resolve if the sources are slow to respond.
     * @param {string} urlToResolve 
     * @returns {collection of resolved links}
     */
  async resolveRecursive(
    urlToResolve: string | string[],
    options: Partial<UrlResolverOptions> = {},
  ): Promise<ResolvedMediaItem[]> {
    const _options = Object.assign({
      timeout: 30
    }, options);

    const instanceOfUrlResolver = this;
    const myPlayableResources: ResolvedMediaItem[] = [];
    const visitedUrls: string[] = [];

    const timeoutPromise = new Promise(resolvedPromise => setTimeout(resolvedPromise, _options.timeout * 1000));

    const urlsToResolve = typeof urlToResolve === "string" ? [urlToResolve] : urlToResolve;
    const actualPromise = Promise.all(urlsToResolve.map(explode));

    await Promise.race([timeoutPromise, actualPromise]);
    
    return myPlayableResources;

    async function explode(urlToVisit: string) {
      if (visitedUrls.includes(urlToVisit)) return;
      visitedUrls.push(urlToVisit);
      debug(urlToVisit);
      var resolvedUrls = await instanceOfUrlResolver.resolve(urlToVisit, options,) as ResolvedMediaItem[];
      if (resolvedUrls) {
        var p: Promise<any>[] = [];
        for (const resolvedUrl of resolvedUrls) {
          resolvedUrl.isPlayable ? myPlayableResources.push(resolvedUrl) : p.push(explode(resolvedUrl.link));
        }
        await Promise.all(p);
      }
    }
  }
}

