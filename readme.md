# nurlresolver
Direct link generator for many known content sharing sites. Avoid clicking numerous times to download links and also avoid seeing ads while downloading the content from sharing sites. Easy to integrate with nodejs application.

[![license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/mnsrulz/nurlresolver/blob/master/LICENSE)
[![npm latest package](https://img.shields.io/npm/v/nurlresolver/latest.svg)](https://www.npmjs.com/package/nurlresolver)
[![npm downloads](https://img.shields.io/npm/dm/nurlresolver.svg)](https://www.npmjs.com/package/nurlresolver)
[![github forks](https://img.shields.io/github/forks/mnsrulz/nurlresolver.svg)](https://github.com/mnsrulz/nurlresolver/network/members)
[![github stars](https://img.shields.io/github/stars/mnsrulz/nurlresolver.svg)](https://github.com/mnsrulz/nurlresolver/stargazers)

# *[Live Demo](https://nurlresolver.netlify.app/)*

**Warning:** This package is native [ESM](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules) and no longer provides a CommonJS export. If your project uses CommonJS, you will have to [convert to ESM](https://gist.github.com/sindresorhus/a39789f98801d908bbc7ff3ecc99d99c) or use the [dynamic `import()`](https://v8.dev/features/dynamic-import) function. Please don't open issues for questions regarding CommonJS / ESM.

**Installation**

```
npm install nurlresolver
```

**Usage:**
***ES6 usage***
```js
import nUrlResolver from 'nurlresolver';
const results = await nUrlResolver.resolve(linkToResolve);

const linkToResolve = 'https://cloud.mail.ru/public/abcd/sAmPlE';
const results = await nUrlResolver.resolve(linkToResolve);
```


***Output***
```js
[  
  {
    link: 'https://cloclo3.cldmail.ru/public/get/generatedlink/no/FileName.extension',
    title: 'FileName.extension',
    isPlayable: true,
    parent: 'https://cloud.mail.ru/public/abcd/sAmPlE',
    speedRank: 65 //0-100 better speed means higher rank
  }
]

```

**Resolve link recursively:**

```js
const results = await nUrlResolver.resolveRecursive(link);
/*
This is going to resolve the final playback links.
Schema representation is same as above result.
The only difference is it recursively resolve all the links as they get found.
*/
```

## Headers Support
In some of the sharing sites, it's required to send some header information back. e.g. Referer is required in some sites or if a link generated from an ip which is only accessible from that ip (in this case the xforward header is added in the result output so that same header can be sent to the same site later on.)

## Advance Options
***options***

| Name      | Type | Description     |
| :---        |    :----:   |          :--- 
| extractMetaInformation      | boolean       | instruct the resolver to extract contenttype, lastmodifieddate and size of the file.   
| timeout   | number        | timeout in seconds      
| googleDrive.apiKey   | string        | optional api key to avoid anonymous access. Defaults to empty to allow anonymous access.
| customResolvers   | array        | custom resolvers you can inject for resolving urls. Refer to [app.tests](tests/app.tests.ts) for implementation samples      


```js
const results = await nUrlResolver.resolve(linkToResolve, {
    extractMetaInformation: true,
    timeout: 30 //returns the results at maximum after 30 seconds.
});
```
***Output***
```js
[
  {
    "link": "http://www5d.filecdn.pw/dkske911881kkk?download_token=SOME_TOKEN_VALUE",
    "title": "FILE.EXTENSION",
    "isPlayable": true,
    "headers": {
      "X-Real-IP": "XX.YY.ZZ.AA"
    },
    "parent": "https://dlfiles.online/dkske911881kkk",
    "speedRank": 55,
    "size": "900163682",
    "lastModified": "Wed, 21 Sep 2019 12:09:06 GMT",
    "contentType": "application/octet-stream"
  }
]
```

**Supported sites**
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
npm run test
```

**License**

<a href='https://github.com/manishrawat4u/nurlresolver/blob/master/LICENSE'>MIT</a>
