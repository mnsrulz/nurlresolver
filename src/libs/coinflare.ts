import { BaseUrlResolver, ResolvedMediaItem } from "../BaseResolver";
import { URL } from 'url';

export class coinflareResolver extends BaseUrlResolver {
    constructor() {
        super({
            domains: [/https?:\/\/coinflare/]
        });
    }

    async resolveInner(_urlToResolve: string): Promise<ResolvedMediaItem[]> {
        /*this may not work due to cf bot protection*/
        const docId = parseInt(new URL(_urlToResolve).pathname.split('/')[1]);
        const jsDocumentUrl = `https://coinflare.org/wp-json/wp/v2/posts/${docId}`;
        const body = await this.gotInstance<Doc>(jsDocumentUrl).json<Doc>();
        const links = this.scrapeAllLinks(body.content.rendered, '.mb-container');
        return links;
    }
}

interface Doc {
    content: {
        rendered: string
    }
}