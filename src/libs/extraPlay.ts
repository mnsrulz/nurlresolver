import { BaseUrlResolver, ResolvedMediaItem } from "../BaseResolver.js";
import { createContext, runInContext } from 'vm';
import { parseScripts } from '../utils/helper.js';

const jsUrl = 'https://awsind.site/player.js';
export class ExtraPlayResolver extends BaseUrlResolver {
    constructor() {
        super({
            domains: [/https?:\/\/extraplay/],
            speedRank: 80
        });
    }

    async resolveInner(_urlToResolve: string): Promise<ResolvedMediaItem[]> {
        const result = [];
        const u = new URL(_urlToResolve);
        const imdbId = u.searchParams.get('play');
        const encodedPath = this.nodebtoa(`${imdbId}-{new Date().getTime()}`);
        const jsBody = await this.gotInstance(jsUrl, { resolveBodyOnly: true });
        const rx = /AwsIndStreamDomain[^=]*= '(https[^']*)'/;
        const rsResult = rx.exec(jsBody)?.[1];
        const u2 = `${rsResult}/pb/${encodedPath}`;
        const u2Response = await this.gotInstance(u2, { headers: { Referer: u.origin }, resolveBodyOnly: true });
        const parsedScripts = parseScripts(u2Response);
        let file = '', key = '';

        const context = createContext({
            HDVBPlayer: function (o: any) {
                file = o.file;
                key = o.key;
            }
        });

        for (const sc of parsedScripts) {
            try {
                if (sc.includes('HDVBPlayer')) {
                    runInContext(sc, context);
                }
            } catch (error) {
            }
        }

        if (file && key) {
            const u3 = `${rsResult}${file}`;
            const headers = {
                'X-Csrf-Token': key,
                'Referer': u2
            }
            const u3Response = await this.gotInstance.post(u3, { headers, resolveBodyOnly: true }).json<[]>();

            const parsedJson = [...u3Response] as Season[];

            for (const season of parsedJson) {
                for (const episode of season.folder) {
                    for (const i of episode.folder) {
                        if (!i.file) continue;
                        const u4 = `${rsResult}/playlist/${i.file}.txt`;
                        const u4Response = await this.gotInstance.post(u4, { headers, resolveBodyOnly: true });
                        const link = u4Response;
                        result.push({
                            link,
                            title: `S${season.id}-E${episode.episode}.m3u8`,
                            isPlayable: true,
                            parent: `${_urlToResolve}&season=${encodeURIComponent(season.id)}&episode=${encodeURIComponent(episode.episode)}`
                        } as ResolvedMediaItem);
                    }
                }
            }
        }
        return result;
    }
}

interface Season {
    title: string,
    id: string,
    folder: {
        episode: string,
        title: string,
        folder: {
            file: string,
            title: string
        }[]
    }[]
}
