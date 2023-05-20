import { BaseUrlResolver, ResolvedMediaItem } from "../BaseResolver.js";
import { parseHiddenForm, parseGoogleFileId } from "../utils/helper.js";

export class gDriveV2Resolver extends BaseUrlResolver {
    private googleDriveId: string;
    constructor() {
        super({
            domains: [/https?:\/\/(drive|docs)\.google\.com/],
            speedRank: 99
        });
        this.googleDriveId = '';
    }

    async resolveInner(_urlToResolve: string): Promise<ResolvedMediaItem[]> {
        const links = [];
        this.googleDriveId = parseGoogleFileId(_urlToResolve)
        if (this.googleDriveId) {
            const normalizeDriveUrl = `https://drive.google.com/uc?id=${this.googleDriveId}&export=download`;
            const googleApiKey = this._resolverOptions?.googleDrive?.apiKey;
            if (googleApiKey) {
                const driveUrlWithApiKey = `https://www.googleapis.com/drive/v3/files/${this.googleDriveId}?alt=media&key=${googleApiKey}`;

                const driveUrlInfoWithApiKey = `https://www.googleapis.com/drive/v3/files/${this.googleDriveId}?supportsAllDrives=true&fields=name&key=${googleApiKey}`
                const response = await this.gotInstance(driveUrlInfoWithApiKey, {
                    followRedirect: false
                }).json<{ name: string }>();

                const title = response.name;
                const result = { link: driveUrlWithApiKey, title, isPlayable: true } as ResolvedMediaItem;
                links.push(result);
            } else {
                const response = await this.gotInstance(normalizeDriveUrl, {
                    followRedirect: false
                });

                const { title } = this.scrapeHtml(response.body, {
                    title: 'span.uc-name-size a'
                }) as { title: string };

                const parsedForm = parseHiddenForm(response.body);
                const reqMediaConfirm = await this.gotInstance(parsedForm.action, {
                    followRedirect: false
                });
                const link = reqMediaConfirm.headers.location;
                if (link) {
                    const result = { link, title, isPlayable: true } as ResolvedMediaItem;
                    links.push(result);
                }
            }
        }
        return links;
    }

    async fillMetaInfo(resolveMediaItem: ResolvedMediaItem): Promise<void> {
        // const headerswithrange = resolveMediaItem.headers || {};
        // headerswithrange['Range'] = 'bytes=0-0';
        // const rangeresponse = await this.gotInstance(resolveMediaItem.link, {
        //     headers: headerswithrange
        // });
        const gdriveid = this.googleDriveId;
        //google doesn't support HTTP HEAD, so another way to find the size and other meta infor is here.
        const result: { fileSize: string, modifiedDate: Date, mimeType: string } = await this.gotInstance(`https://content.googleapis.com/drive/v2beta/files/${gdriveid}?fields=fileSize%2CmodifiedDate%2CmimeType&supportsTeamDrives=true&key=AIzaSyC1eQ1xj69IdTMeii5r7brs3R90eck-m7k`,
            {
                headers: {
                    "X-Origin": "https://drive.google.com",
                },
            }).json();
        resolveMediaItem.size = result.fileSize;
        resolveMediaItem.lastModified = result.modifiedDate.toString();
        resolveMediaItem.contentType = result.mimeType;
    }
}