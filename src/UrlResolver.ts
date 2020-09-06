import { ResolvedMediaItem, BaseUrlResolver } from "./BaseResolver";
import * as allResolverImports from "./allResolvers";
import { UrlResolverOptions } from "./UrlResolverOptions";

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
    urlToResolve: string,
    options: Partial<UrlResolverOptions> = {},
  ): Promise<ResolvedMediaItem[]> {
    const _options = Object.assign({
      timeout: 30
    }, options);
    const _allResolvers = this.allResolvers;
    const timeoutPromise = new Promise<ResolvedMediaItem[]>((resolve) => {
      setTimeout(resolve, _options.timeout * 1000);
      return [];
    });
    const actualPromise = _();
    return await Promise.race([timeoutPromise, actualPromise]);
    async function _() {
      for (let index = 0; index < _allResolvers.length; index++) {
        const element: BaseUrlResolver = new _allResolvers[index]();
        var fs = await element.resolve(urlToResolve, _options);
        if (fs && fs.length > 0) {
          return fs;
        }
      }
      return [];
    }
  }

  /**
     * Resolve recursively all the urls until all not fetched. It's a heavy call and 
     * can take minutes to resolve if the sources are slow to respond.
     * @param {string} urlToResolve 
     * @returns {collection of resolved links}
     */
  async resolveRecursive(
    urlToResolve: string,
    options: Partial<UrlResolverOptions> = {},
  ): Promise<ResolvedMediaItem[]> {
    const _options = Object.assign({
      timeout: 30
    }, options);

    const instanceOfUrlResolver = this;
    const myPlayableResources: ResolvedMediaItem[] = [];
    const visitedUrls: string[] = [];

    const timeoutPromise = new Promise(function (resolvedPromise) {
      setTimeout(resolvedPromise, _options.timeout * 1000);
    });
    const actualPromise = explode(urlToResolve);
    await Promise.race([timeoutPromise, actualPromise]);

    return myPlayableResources;

    async function explode(urlToVisit: string) {
      if (visitedUrls.some((x) => x === urlToVisit)) return;
      visitedUrls.push(urlToVisit);
      console.log(urlToVisit);
      var resolvedUrls = await instanceOfUrlResolver.resolve(
        urlToVisit,
        options,
      ) as ResolvedMediaItem[];
      if (resolvedUrls) {
        var p: any[] = [];
        for (const resolvedUrl of resolvedUrls) {
          resolvedUrl.isPlayable ? myPlayableResources.push(resolvedUrl) : p.push(explode(resolvedUrl.link));
        }
        await Promise.all(p);
      }
    }
  }
}

