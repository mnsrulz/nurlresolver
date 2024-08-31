import nurl, { BaseUrlResolver, ResolvedMediaItem } from '../app.js';
import test from 'ava';

test('resolve is defined', t => {
    (typeof nurl['resolve'] == 'function') ? t.pass() : t.fail();
});

test('resolveRecursive is defined', t => {
    (typeof nurl['resolveRecursive'] == 'function') ? t.pass() : t.fail();
});

test('custom resolver registration', async t => {
    const resolvedFile = 'http://mylink/resolvedfile.mkv';
    class customResolver extends BaseUrlResolver {
        constructor() {
            super({
                domains: [/https?:\/\/(testdomain)/],
                speedRank: 70
            });
        }

        async resolveInner(_urlToResolve: string): Promise<ResolvedMediaItem | ResolvedMediaItem[]> {
            return {
                link: resolvedFile
            } as ResolvedMediaItem;
        }
    }

    const result = await nurl.resolve('http://testdomain.com/file.mkv', {
        timeout: 100,
        customResolvers: [customResolver]
    });

    t.is(result[0].link, resolvedFile);
});


test('resolver deregistration', async t => {
    const resolvedFile = 'http://mylink/resolvedfile.mkv';
    class customResolver extends BaseUrlResolver {
        constructor() {
            super({
                domains: [/https?:\/\/(testdomain)/],
                speedRank: 70
            });
        }

        async resolveInner(_urlToResolve: string): Promise<ResolvedMediaItem | ResolvedMediaItem[]> {
            return {
                link: resolvedFile
            } as ResolvedMediaItem;
        }
    }

    const result = await nurl.resolve('http://testdomain.com/file.mkv', {
        timeout: 100,
        customResolvers: [customResolver],
        ignoreResolvers: [/customResolver/]
    });

    t.is(result.length, 0);
});
