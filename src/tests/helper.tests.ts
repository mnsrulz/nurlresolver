import test from 'ava';
import { parseGoogleFileId, parseElementAttributes, parseAllLinks, isValidHttpUrl, getSecondLevelDomain } from '../utils/helper.js';

const data = `
<html>
    <body>
        <div data-html='test'>
            <a href='https://www.google.com'>lnk1</a>
        </div>
        <div data-html='test2'>            
            <a href='/t.php'>link2</a>
        </div>
    </body>
</html>
`

test('parseElementAttributes should return valid attributes', async t => {
    const value = parseElementAttributes(data, 'div', 'data-html');
    value[0] == 'test' && value[1] == 'test2' ? t.pass() : t.fail();
});

test('parseAllLinks should return valid links', async t => {
    const value = parseAllLinks(data, 'div', 'http://example.com/test.php');
    value[0].link == 'https://www.google.com' && value[1].link == 'http://example.com/t.php' ? t.pass() : t.fail();
});

test('isValidUrl should return valid links', async t => {
    isValidHttpUrl('http://example.com') && !isValidHttpUrl('test') ? t.pass() : t.fail();
});

test('second level domain should return valid domain', t => {
    t.is(getSecondLevelDomain('http://ww.abc.com'), 'abc');
});

test('google drive parse links', t => {
    t.is(parseGoogleFileId('https://drive.google.com/u/0/uc?id=1EBDCCsIy12HwE4II6-KKKsVSL_FFFFFT&export=download'), '1EBDCCsIy12HwE4II6-KKKsVSL_FFFFFT');
    t.is(parseGoogleFileId('https://drive.google.com/u/0/uc?id=1EBDCCsIy12HwE4II6-KKKsVSL_FFFFFT'), '1EBDCCsIy12HwE4II6-KKKsVSL_FFFFFT');
    t.is(parseGoogleFileId('https://drive.google.com/file/d/1EBDCCsIy12HwE4II6-KKKsVSL_FFFFFT/view'), '1EBDCCsIy12HwE4II6-KKKsVSL_FFFFFT');
    t.is(parseGoogleFileId('https://drives.othergoogle.com/file/d/1EBDCCsIy12HwE4II6-KKKsVSL_FFFFFT/view'), null);
});