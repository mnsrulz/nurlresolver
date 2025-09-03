import { ResolvedMediaItem, BaseUrlResolver } from "./BaseResolver.js";
import * as allResolverImports from "./allResolvers.js";
import { UrlResolverOptions } from "./UrlResolverOptions.js";
import debug from 'debug';
const _debug = debug('nurl:BaseUrlResolver');

export class UrlResolver {
  private allResolvers: { new(): BaseUrlResolver; }[];
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
    if (!urlToResolve) return [];
    if (Array.isArray(urlToResolve) && urlToResolve.length === 0) return [];
    
    const _options = Object.assign({
      timeout: 30
    }, options);
    const instance = this;

    const _allResolvers = _options.customResolvers ? [...this.allResolvers, ..._options.customResolvers] : this.allResolvers;
    const _filteredResolvers = _allResolvers.filter(j => !_options.ignoreResolvers?.some(r => r.test(j.name)));
    let result: ResolvedMediaItem[] = [];
    let timeoutPointer: NodeJS.Timeout | undefined;
    const timeoutPromise = new Promise(resolve => {
      timeoutPointer = setTimeout(resolve, _options.timeout * 1000);
    });
    const actualPromise = _();
    await Promise.race([timeoutPromise, actualPromise]);
    if (timeoutPointer) clearTimeout(timeoutPointer);
    return result;
    async function _() {
      const urlsToResolve = typeof urlToResolve === "string" ? [urlToResolve] : urlToResolve;
      const promises: Promise<ResolvedMediaItem[]>[] = [];
      for (const iteratorurl of urlsToResolve) {
        for (const resolver of _filteredResolvers) {
          const element = new resolver();
          const promise = element.resolve(iteratorurl, _options, instance).then(resolvedItems => result = [...result, ...resolvedItems]);
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

    const myPlayableResources: ResolvedMediaItem[] = [];
    const visitedUrls: string[] = [];

    const timeoutPromise = new Promise(resolvedPromise => setTimeout(resolvedPromise, _options.timeout * 1000));

    const explode = async (urlToVisit: string) => {
      if (visitedUrls.includes(urlToVisit)) return;
      visitedUrls.push(urlToVisit);
      _debug(urlToVisit);
      const resolvedUrls = await this.resolve(urlToVisit, options,) as ResolvedMediaItem[];
      if (resolvedUrls) {
        const p: Promise<void>[] = [];
        for (const resolvedUrl of resolvedUrls) {
          resolvedUrl.isPlayable ? myPlayableResources.push(resolvedUrl) : p.push(explode(resolvedUrl.link));
        }
        await Promise.all(p);
      }
    }

    const urlsToResolve = typeof urlToResolve === "string" ? [urlToResolve] : urlToResolve;
    const actualPromise = Promise.all(urlsToResolve.map(explode));

    await Promise.race([timeoutPromise, actualPromise]);

    return myPlayableResources;
  }
}

