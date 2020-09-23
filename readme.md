# nurlresolver
Direct link generator for many known content sharing sites. Avoid clicking numerous times to download links and also avoid seeing ads while downloading the content from sharing sites. Easy to integrate with nodejs application.

# *[Live Demo](https://nurlresolver.netlify.app/)*

# Fully written in Typescript

**Installation**

```
npm install nurlresolver
```

**Usage:**

```
//Module loader
const nUrlResolver = require('nurlresolver');

OR

//ES6 usage
import nurlresolver from 'nurlresolver';
const results = await nUrlResolver.resolve(linkToResolve);

const linkToResolve = 'https://cloud.mail.ru/public/abcd/sAmPlE';
const results = await nUrlResolver.resolve(linkToResolve);

/*Output==>

[  
  {
    link: 'https://cloclo3.cldmail.ru/public/get/generatedlink/no/FileName.extension',
    title: 'FileName.extension',
    isPlayable: true,
    parent: 'https://cloud.mail.ru/public/abcd/sAmPlE'
  }
]

*/

const results = await nUrlResolver.resolveRecursive(link);
//this is going to resolve the final playback links. Schema representation is same as above result. The only difference is it recursively resolve all the links as they get found.

```

## Headers Support
In some of the sharing sites, it's required to send some header information back. e.g. Referer is required in some sites or if a link generated from an ip which is only accessible from that ip (in this case the xforward header is added in the result output so that same header can be sent to the same site later on.)

## Advance Options
optionsextractMetaInformation | boolean | instruct the resolver to extract contenttype, lastmodifieddate and size of the file.
```
const results = await nUrlResolver.resolve(linkToResolve, {
    extractMetaInformation: true
});

/*
[
  {
    "link": "http://www5d.filecdn.pw/dkske911881kkk?download_token=SOME_TOKEN_VALUE",
    "title": "FILE.EXTENSION",
    "isPlayable": true,
    "headers": {
      "X-Real-IP": "XX.YY.ZZ.AA"
    },
    "parent": "https://dlfiles.online/dkske911881kkk",
    "size": "900163682",
    "lastModified": "Wed, 21 Sep 2019 12:09:06 GMT",
    "contentType": "application/octet-stream"
  }
]
*/

```

Supported sites
* Google Drive
* CloudMailRu
* MegaupNet
* Dlfiles
* Doodvideo
* Indishare
* Racaty
* uploadraja
* ZuploadMe
* Yourupload
* etc. Refer [here](https://github.com/mnsrulz/nurlresolver/tree/master/src/libs) for complete implementation

**Try it Online**
https://repl.it/repls/HandsomeLightgraySmalltalk


**Testing**
```
TODO
```

**License**

<a href='https://github.com/manishrawat4u/nurlresolver/blob/master/LICENSE'>MIT</a>
