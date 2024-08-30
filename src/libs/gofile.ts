import { BaseUrlResolver, ResolvedMediaItem } from "../BaseResolver.js";
let globaltoken = '';

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
        const apiUrl = `https://api.gofile.io/contents/${gofileId}?wt=4fd6sg89d7s6`;
        const {data} = await this.gotInstance<ResponsePayload>(apiUrl, {
            headers: {
                'Authorization': `Bearer ${token}`
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