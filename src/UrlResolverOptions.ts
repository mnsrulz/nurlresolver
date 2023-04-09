import { BaseUrlResolver } from "./BaseResolver.js";

export type UrlResolverOptions = {
  timeout: number;
  extractMetaInformation: boolean;
  customResolvers: { new(): BaseUrlResolver; }[];
};