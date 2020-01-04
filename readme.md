# gddirecturl
Node version of popular urlresolver for python. Easy to integrate and can be plugin to your application easily. Plugin based implementation and easy to extend the functionalty.

**Installation**

```
npm install nurlresolver
```

**Usage:**

```

var nUrlResolver = require('nurlresolver');
const hdhub4u = 'https://hdhub4u.live';
var results = await nUrlResolver.resolve(hdhub4u);

/*Output==>

[
    {
        isPlayable:false
        link:"https://hdhub4u.live/bigg-boss-2019-season-13/"
        poster:"https://extraimage.net/images/2019/10/25/195e47abcdecdcfe2e272316eab63a09.jpg"
        title:"Bigg Boss (2019) Season 13"
    },...
]

*/

var results = await nUrlResolver.resolveRecursive(first.link);
//this is going to resolve the final playback links. Schema representation is same as above result. The only difference is it recursively resolve all the links as they get found.

```

**Testing**
```
TODO
```

**License**

<a href='https://github.com/manishrawat4u/nurlresolver/blob/master/LICENSE'>MIT</a>
