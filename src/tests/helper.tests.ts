import test from 'ava';
import { parseGoogleFileId, parseElementAttributes, parseAllLinks, isValidHttpUrl, getSecondLevelDomain, simpleCaptcha } from '../utils/helper.js';

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
    t.is(parseGoogleFileId('https://drive.usercontent.google.com/download?export=download&id=1EBDCCsIy12HwE4II6-KKKsVSL_FFFFFT'), '1EBDCCsIy12HwE4II6-KKKsVSL_FFFFFT');
    t.is(parseGoogleFileId('https://drives.othergoogle.com/file/d/1EBDCCsIy12HwE4II6-KKKsVSL_FFFFFT/view'), null);
});

test('parse simple captcha', t=>{
    const html = `
    <table width="100%" border="0" cellspacing="0" cellpadding="0">
							<tbody><tr>
								<td align="center">
									<center>
									<span id="countdown" style="visibility: hidden;">Wait <span class="seconds">1</span> Seconds</span>
									<br><table><tbody><tr><td colspan="2"><b>Enter code below:</b></td></tr>
<tr>
	<td align="right"><div style="width:80px;height:26px;font:bold 13px Arial;background:#ccc;text-align:left;direction:ltr;"><span style="position:absolute;padding-left:9px;padding-top:6px;">1</span><span style="position:absolute;padding-left:61px;padding-top:4px;">6</span><span style="position:absolute;padding-left:44px;padding-top:6px;">4</span><span style="position:absolute;padding-left:27px;padding-top:6px;">1</span></div></td>
	<td align="left" valign="middle"><input type="text" name="code" class="captcha_code"></td>
</tr>
</tbody></table>
								</td>
							</tr>
						</tbody></table>
    `;

    const code = simpleCaptcha(html, 'td[align=right] span')  ;
    t.is(code, '1146');
})