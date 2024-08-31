import { BaseUrlResolver } from "./BaseResolver.js";

export type UrlResolverOptions = {
  /** 
   * timeout in seconds
  */
  timeout: number;
  /**
   * instruct the resolver to extract contenttype, lastmodifieddate and size of the file.
   */
  extractMetaInformation: boolean;
  /**
   * allows you to provide a custom list of resolvers. 
   */
  customResolvers: { new(): BaseUrlResolver; }[];
  googleDrive: {
    apiKey: string
  };
/** 
 * It's useful when you don't want to execute a list of resolvers. You can pass regular expression array.
*/
  ignoreResolvers: RegExp[]
};