import { BaseUrlResolver } from "./BaseResolver";

export type UrlResolverOptions = {
  timeout: number;
  extractMetaInformation: boolean;
  customResolvers: {new(): BaseUrlResolver;}[];//BaseUrlResolver[];  
};