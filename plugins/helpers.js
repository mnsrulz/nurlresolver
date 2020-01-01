var Xray = require('x-ray')
var x = Xray()

class Helper {
    async getHiddenForm(page, ix) {
        ix = ix || 0;
        var obj1 = await x(page, ['form@html']);
        var el = obj1[ix];
        var obj = await x(el, {
            n: ['*@name'],
            v: ['*@value']
        });
        var datatopost = {};
        for (let index = 0; index < obj.n.length; index++) {
            const n = obj.n[index];
            const v = obj.v[index];
            n !== undefined && v !== undefined && 
            n !== null && v !== null && (datatopost[n] = v);
        }
        return datatopost;
    }

    async wait(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    unPack(code) {
        return code && P_A_C_K_E_R.unpack(code);
        // return beautify(code, {
        //     "indent_size": "4",
        //     "indent_char": " ",
        //     "max_preserve_newlines": "5",
        //     "preserve_newlines": true,
        //     "keep_array_indentation": false,
        //     "break_chained_methods": false,
        //     "indent_scripts": "normal",
        //     "brace_style": "collapse",
        //     "space_before_conditional": true,
        //     "unescape_strings": false,
        //     "jslint_happy": false,
        //     "end_with_newline": false,
        //     "wrap_line_length": "0",
        //     "indent_inner_html": false,
        //     "comma_first": false,
        //     "e4x": false,
        //     "indent_empty_lines": false,
        //     "eval_code": true
        //   });
    }

    // unPack(code) {
    //     function indent(code) {
    //         try {
    //             var tabs = 0, old = -1, add = '';
    //             for (var i = 0; i < code.length; i++) {
    //                 if (code[i].indexOf("{") != -1) tabs++;
    //                 if (code[i].indexOf("}") != -1) tabs--;

    //                 if (old != tabs) {
    //                     old = tabs;
    //                     add = "";
    //                     while (old > 0) {
    //                         add += "\t";
    //                         old--;
    //                     }
    //                     old = tabs;
    //                 }

    //                 code[i] = add + code[i];
    //             }
    //         } finally {
    //             tabs = null;
    //             old = null;
    //             add = null;
    //         }
    //         return code;
    //     }

    //     // var env = {
    //     //     eval: function (c) {
    //     //         code = c;
    //     //     },
    //     //     window: {},
    //     //     document: {}
    //     // };

    //     var eval = function (c) {
    //         code = c;
    //     };
    //     var window = {};
    //     var document = {};

    //     // eval("with(env) {" + code + "}");
    //     // eval(code);

    //     (function (b) {
    //         // var b = "some sample packed code";
    //         function something(a) {
    //             alert(a)
    //         }
    //         something(b)
    //     }
    //     )(code);

    //     code = (code + "").replace(/;/g, ";\n").replace(/{/g, "\n{\n").replace(/}/g, "\n}\n").replace(/\n;\n/g, ";\n").replace(/\n\n/g, "\n");

    //     code = code.split("\n");
    //     code = indent(code);

    //     code = code.join("\n");
    //     return code;
    // }
}

var P_A_C_K_E_R = {
    detect: function (str) {
        return (P_A_C_K_E_R.get_chunks(str).length > 0);
    },

    get_chunks: function (str) {
        var chunks = str.match(/eval\(\(?function\(.*?(,0,\{\}\)\)|split\('\|'\)\)\))($|\n)/g);
        return chunks ? chunks : [];
    },

    unpack: function (str) {
        var chunks = P_A_C_K_E_R.get_chunks(str),
            chunk;
        for (var i = 0; i < chunks.length; i++) {
            chunk = chunks[i].replace(/\n$/, '');
            str = str.split(chunk).join(P_A_C_K_E_R.unpack_chunk(chunk));
        }
        return str;
    },

    unpack_chunk: function (str) {
        var unpacked_source = '';
        var __eval = eval;
        if (P_A_C_K_E_R.detect(str)) {
            try {
                eval = function (s) { // jshint ignore:line
                    unpacked_source += s;
                    return unpacked_source;
                }; // jshint ignore:line
                __eval(str);
                if (typeof unpacked_source === 'string' && unpacked_source) {
                    str = unpacked_source;
                }
            } catch (e) {
                // well, it failed. we'll just return the original, instead of crashing on user.
            }
        }
        eval = __eval; // jshint ignore:line
        return str;
    },

    run_tests: function (sanity_test) {
        var t = sanity_test || new SanityTest();

        var pk1 = "eval(function(p,a,c,k,e,r){e=String;if(!''.replace(/^/,String)){while(c--)r[c]=k[c]||c;k=[function(e){return r[e]}];e=function(){return'\\\\w+'};c=1};while(c--)if(k[c])p=p.replace(new RegExp('\\\\b'+e(c)+'\\\\b','g'),k[c]);return p}('0 2=1',3,3,'var||a'.split('|'),0,{}))";
        var unpk1 = 'var a=1';
        var pk2 = "eval(function(p,a,c,k,e,r){e=String;if(!''.replace(/^/,String)){while(c--)r[c]=k[c]||c;k=[function(e){return r[e]}];e=function(){return'\\\\w+'};c=1};while(c--)if(k[c])p=p.replace(new RegExp('\\\\b'+e(c)+'\\\\b','g'),k[c]);return p}('0 2=1',3,3,'foo||b'.split('|'),0,{}))";
        var unpk2 = 'foo b=1';
        var pk_broken = "eval(function(p,a,c,k,e,r){BORKBORK;if(!''.replace(/^/,String)){while(c--)r[c]=k[c]||c;k=[function(e){return r[e]}];e=function(){return'\\\\w+'};c=1};while(c--)if(k[c])p=p.replace(new RegExp('\\\\b'+e(c)+'\\\\b','g'),k[c]);return p}('0 2=1',3,3,'var||a'.split('|'),0,{}))";
        var pk3 = "eval(function(p,a,c,k,e,r){e=String;if(!''.replace(/^/,String)){while(c--)r[c]=k[c]||c;k=[function(e){return r[e]}];e=function(){return'\\\\w+'};c=1};while(c--)if(k[c])p=p.replace(new RegExp('\\\\b'+e(c)+'\\\\b','g'),k[c]);return p}('0 2=1{}))',3,3,'var||a'.split('|'),0,{}))";
        var unpk3 = 'var a=1{}))';

        t.test_function(P_A_C_K_E_R.detect, "P_A_C_K_E_R.detect");
        t.expect('', false);
        t.expect('var a = b', false);
        t.test_function(P_A_C_K_E_R.unpack, "P_A_C_K_E_R.unpack");
        t.expect(pk_broken, pk_broken);
        t.expect(pk1, unpk1);
        t.expect(pk2, unpk2);
        t.expect(pk3, unpk3);

        var filler = '\nfiller\n';
        t.expect(filler + pk1 + "\n" + pk_broken + filler + pk2 + filler, filler + unpk1 + "\n" + pk_broken + filler + unpk2 + filler);

        return t;
    }


};
module.exports = new Helper()