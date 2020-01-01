var restify = require('restify');
var urlresolver = new (require('./plugins/UrlResolver'))();

async function respond(req, res, next) {
    var links = await urlresolver.resolve('https://hdhub4u.live');
    links.forEach(x => x.originalLink = x.link);
    links.forEach(x => x.link = `https://nurlresolver.herokuapp.com/hs?l=${encodeURIComponent(x.originalLink)}`)
    links.forEach(x => x.expandlink = `https://nurlresolver.herokuapp.com/hs2?l=${encodeURIComponent(x.originalLink)}`)
    res.send(links);
    next();
}

async function respond1(req, res, next) {
    var urltoresolve = req.query.l;
    var links = await urlresolver.resolve(urltoresolve);
    if (links) {
        links.forEach(x => x.originalLink = x.link);
        links.forEach(x => x.link = `https://nurlresolver.herokuapp.com/hs?l=${encodeURIComponent(x.link)}`)
        res.send(links);
    }
    else {
        res.send('No links found!!!');
    }

    next();
}

async function respond2(req, res, next) {
    // var links = await urlresolver.resolve('https://hdhub4u.live');
    var urltoresolve = req.query.l;
    var j = [];
    await rec(urltoresolve, j, []);
    console.log(`processing completed for ${urltoresolve}`);
    res.send(j);
    next();
}

async function rec(o, j, k) {
    if (k.some(x => x === o)) return '';
    k.push(o);
    console.log(o);
    if (o) {
        var p = [];
        var z = await urlresolver.resolve(o);
        if (z) {
            z.filter(x => x.isPlayable).forEach(x => j.push(x));
            // for (const key in z) {
            //     const x = z[key];
            //     if (!x.isPlayable) {
            //         var tttt = await rec(x.link, j, k);
            //         p.push(tttt);
            //     }
            // }
            z.filter(x => !x.isPlayable).forEach(x => {
                p.push(rec(x.link, j, k));
            });
        }
        await Promise.all(p);
    } else {
        return '';
    }
}

var server = restify.createServer();
server.use(restify.plugins.queryParser());
server.get('/', respond);
server.get('/hs', respond1);
server.get('/hs2', respond2);

var port = normalizePort(process.env.PORT || '3000');

server.listen(port, function () {
    console.log('%s listening at %s', server.name, server.url);
});

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
    var port = parseInt(val, 10);

    if (isNaN(port)) {
        // named pipe
        return val;
    }

    if (port >= 0) {
        // port number
        return port;
    }

    return false;
}