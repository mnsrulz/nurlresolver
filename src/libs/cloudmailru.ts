
import { BaseUrlResolver, ResolvedMediaItem } from "../BaseResolver";

const m3u8 = require('m3u8');

import stream = require('stream');
const { promisify } = require('util');
const pipeline = promisify(stream.pipeline);
import url = require('url');


export class CloudMailRuResolver extends BaseUrlResolver {
    constructor() {
        super({
            domains: [/https?:\/\/cloud\.mail\.ru/]
        });
    }

    async resolveInner(_urlToResolve: string): Promise<ResolvedMediaItem[]> {
        var links = [] as ResolvedMediaItem[];
        try {
            const response = await this.gotInstance(_urlToResolve);
            var title = await this.xInstance(response.body, 'title');
            var regex01 = /"weblink_get"\s*:\s*\[.+?"url"\s*:\s*"([^"]+)/gs
            var regexWeblinkVideo = /"weblink_video"\s*:\s*\[.+?"url"\s*:\s*"([^"]+)/gs
            var regex03 = /public\/(.*)/g
            var link1 = regex01.exec(response.body)![1];
            var link3 = regex03.exec(_urlToResolve)![1];
            var webLinkVideo = regexWeblinkVideo.exec(response.body)![1];
            if (link1 && link3 && webLinkVideo) {
                var finalLink = `${link1}/${link3}`;
                var headers = await this.gotInstance.head(finalLink);

                if (headers.statusCode === 200) {
                    var result = <ResolvedMediaItem>{
                        link: finalLink,
                        title: title,
                        isPlayable: true
                    };
                    links.push(result);

                    const m3u8Link = `${webLinkVideo}0p/${Buffer.from(link3).toString('base64')}.m3u8?double_encode=1`;
                    const m3u8ExtractLinks = await this.extractM3u8Links(m3u8Link, title);
                    m3u8ExtractLinks && (links = links.concat(m3u8ExtractLinks));
                }
            }
        } catch (error) {
            console.log(`Error occurred while parsing cloudmailru link: ${_urlToResolve}`);
        }
        return links;
    }
    async extractM3u8Links(m3u8Link: string, title: string): Promise<ResolvedMediaItem[]> {
        return new Promise((resolve, reject) => {
            try {
                var links = [] as ResolvedMediaItem[];
                var parser = m3u8.createStream();
                parser.on('item', (item: any) => {
                    const linkUri = url.resolve(m3u8Link, item.get('uri'));
                    const titleWithQuality = `${title} - ${item.get('resolution')}`;
                    links.push({ link: linkUri, title: titleWithQuality, isPlayable: true } as ResolvedMediaItem);
                });
                parser.on('m3u', () => {
                    resolve(links);
                });
                pipeline(
                    this.gotInstance.stream(m3u8Link),
                    parser
                );
            } catch (error) {
                reject(error);
            }
        });
    }
}