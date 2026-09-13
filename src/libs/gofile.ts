import crypto from 'node:crypto';
import { BaseUrlResolver, ResolvedMediaItem } from "../BaseResolver.js";
let globaltoken = '';


function generateWebsiteToken(userAgent: string, accountToken: string) {
  const timeSlot = Math.floor(Date.now() / 1000 / 14400);
  const raw = `${userAgent}::en-US::${accountToken}::${timeSlot}::12af056dacea0b`;

  return crypto
    .createHash('sha256')
    .update(raw)
    .digest('hex');
}

export class GoFileResolver extends BaseUrlResolver {
    private async fetchGlobalToken() {
        //instead of creating account every time let's cache it at app level
        if (!globaltoken) {
            const apitoken = await this.gotInstance.post('https://api.gofile.io/accounts')
                                .json<{ data: { token: string }, status: string }>();
            const { token } = apitoken.data;
            globaltoken = token;
        }
        return globaltoken;
        
    }
    constructor() {
        super({
            domains: [/https?:\/\/gofile\.io/],
            speedRank: 80
        });
    }

    async resolveInner(_urlToResolve: string): Promise<ResolvedMediaItem[]> {
        const initialResponse = await this.gotInstance(_urlToResolve);
        const gofileId = new URL(initialResponse.url).pathname.split('/').pop(); //extract go fileid
        const token = await this.fetchGlobalToken();
        const websiteToken = generateWebsiteToken(this.defaultUserAgent, token);
        const apiUrl = `https://api.gofile.io/contents/${gofileId}?cache=true&sortField=createTime&sortDirection=1`;
        const {data} = await this.gotInstance<ResponsePayload>(apiUrl, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'X-Website-Token': websiteToken,
                'X-BL': 'en-US'
            },
            resolveBodyOnly: true,
            responseType: 'json'
        });
        const firstValidFile = data.children[Object.keys(data.children)[0]];
        const rs = {
            isPlayable: true,
            title: firstValidFile.name,
            link: firstValidFile.link
        } as ResolvedMediaItem;
        rs.headers = { "Cookie": `accountToken=${token}` }

        await this.wait(1000);  //to make the link work appropriately let's delay it for a bit
        return [rs];
    }
}

interface ResponsePayload {
    data: {
        children: Record<string, {
            name: string
            link: string
            directLink: string
        }>
    }
}