import { BaseUrlResolver, ResolvedMediaItem } from "../BaseResolver.js";
let globaltoken = '';

export class GoFileResolver extends BaseUrlResolver {
    private async fetchGlobalToken() {
        //instead of creating account every time let's cache it at app level
        if (!globaltoken) {
            const apitoken = await this.gotInstance('https://api.gofile.io/createAccount')
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
        const apiUrl = `https://api.gofile.io/getContent?contentId=${gofileId}&token=${token}&websiteToken=7fd94ds12fds4`;
        const { data } = await this.gotInstance<ResponsePayload>(apiUrl, {
            resolveBodyOnly: true,
            responseType: 'json'
        });

        const firstValidFile = data.contents[Object.keys(data.contents)[0]];
        const rs = {
            isPlayable: true,
            title: firstValidFile.name,
            link: firstValidFile.link
        } as ResolvedMediaItem;
        rs.headers = { "Cookie": `accountToken=${token}` }
        return [rs];
    }
}

interface ResponsePayload {
    data: {
        contents: Record<string, {
            name: string
            link: string
            directLink: string
        }>
    }
}





// fetch("https://store1.gofile.io/download/207ed333-aa6c-4d2d-9875-351dc42fdb54/Nayika.Devi.The.Warrior.Queen.2022.480p.WEB.HDRip.HINDI.HQ.Dub.2.0.x264.HDHub4u.mkv", {
//   "headers": {
//     "accept": "*/*",
//     "accept-language": "en-US,en;q=0.8",
//     "cache-control": "no-cache",
//     "pragma": "no-cache",
//     "sec-ch-ua": "\"Not.A/Brand\";v=\"8\", \"Chromium\";v=\"114\", \"Brave\";v=\"114\"",
//     "sec-ch-ua-mobile": "?0",
//     "sec-ch-ua-platform": "\"Windows\"",
//     "sec-fetch-dest": "empty",
//     "sec-fetch-mode": "cors",
//     "sec-fetch-site": "same-site",
//     "sec-gpc": "1"
//   },
//   "referrerPolicy": "no-referrer",
//   "body": null,
//   "method": "GET",
//   "mode": "cors",
//   "credentials": "omit"
// });

// fetch("https://store1.gofile.io/download/207ed333-aa6c-4d2d-9875-351dc42fdb54/Nayika.Devi.The.Warrior.Queen.2022.480p.WEB.HDRip.HINDI.HQ.Dub.2.0.x264.HDHub4u.mkv", {
//   "headers": {
//     "accept": "*/*",
//     "accept-language": "en-US,en;q=0.8",
//     "cache-control": "no-cache",
//     "pragma": "no-cache",
//     "range": "bytes=0-",
//     "sec-ch-ua": "\"Not.A/Brand\";v=\"8\", \"Chromium\";v=\"114\", \"Brave\";v=\"114\"",
//     "sec-ch-ua-mobile": "?0",
//     "sec-ch-ua-platform": "\"Windows\"",
//     "sec-fetch-dest": "video",
//     "sec-fetch-mode": "no-cors",
//     "sec-fetch-site": "same-site",
//     "sec-gpc": "1"
//   },
//   "referrerPolicy": "no-referrer",
//   "body": null,
//   "method": "GET",
//   "mode": "cors",
//   "credentials": "include"
// });

// */