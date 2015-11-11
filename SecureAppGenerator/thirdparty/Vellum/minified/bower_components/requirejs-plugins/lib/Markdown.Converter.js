define(["require","exports"],function(b,a){var c;if(typeof a==="object"&&typeof b==="function"){c=a}else{c={}}(function(){function f(h){return h}function g(h){return false}function e(){}e.prototype={chain:function(j,i){var h=this[j];if(!h){throw new Error("unknown hook "+j)}if(h===f){this[j]=i}else{this[j]=function(k){return i(h(k))}}},set:function(i,h){if(!this[i]){throw new Error("unknown hook "+i)}this[i]=h},addNoop:function(h){this[h]=f},addFalse:function(h){this[h]=g}};c.HookCollection=e;function d(){}d.prototype={set:function(h,i){this["s_"+h]=i},get:function(h){return this["s_"+h]}};c.Converter=function(){var m=this.hooks=new e();m.addNoop("plainLinkText");m.addNoop("preConversion");m.addNoop("postConversion");var z;var q;var h;var C;this.makeHtml=function(S){if(z){throw new Error("Recursive call to converter.makeHtml")}z=new d();q=new d();h=[];C=0;S=m.preConversion(S);S=S.replace(/~/g,"~T");S=S.replace(/\$/g,"~D");S=S.replace(/\r\n/g,"\n");S=S.replace(/\r/g,"\n");S="\n\n"+S+"\n\n";S=M(S);S=S.replace(/^[ \t]+$/mg,"");S=r(S);S=p(S);S=i(S);S=P(S);S=S.replace(/~D/g,"$$");S=S.replace(/~T/g,"~");S=m.postConversion(S);h=q=z=null;return S};function p(S){S=S.replace(/^[ ]{0,3}\[(.+)\]:[ \t]*\n?[ \t]*<?(\S+?)>?(?=\s|$)[ \t]*\n?[ \t]*((\n*)["(](.+?)[")][ \t]*)?(?:\n+)/gm,function(V,X,W,U,T,Y){X=X.toLowerCase();z.set(X,F(W));if(T){return U}else{if(Y){q.set(X,Y.replace(/"/g,"&quot;"))}}return""});return S}function r(U){var T="p|div|h[1-6]|blockquote|pre|table|dl|ol|ul|script|noscript|form|fieldset|iframe|math|ins|del";var S="p|div|h[1-6]|blockquote|pre|table|dl|ol|ul|script|noscript|form|fieldset|iframe|math";U=U.replace(/^(<(p|div|h[1-6]|blockquote|pre|table|dl|ol|ul|script|noscript|form|fieldset|iframe|math|ins|del)\b[^\r]*?\n<\/\2>[ \t]*(?=\n+))/gm,R);U=U.replace(/^(<(p|div|h[1-6]|blockquote|pre|table|dl|ol|ul|script|noscript|form|fieldset|iframe|math)\b[^\r]*?.*<\/\2>[ \t]*(?=\n+)\n)/gm,R);U=U.replace(/\n[ ]{0,3}((<(hr)\b([^<>])*?\/?>)[ \t]*(?=\n{2,}))/g,R);U=U.replace(/\n\n[ ]{0,3}(<!(--(?:|(?:[^>-]|-[^>])(?:[^-]|-[^-])*)--)>[ \t]*(?=\n{2,}))/g,R);U=U.replace(/(?:\n\n)([ ]{0,3}(?:<([?%])[^\r]*?\2>)[ \t]*(?=\n{2,}))/g,R);return U}function R(S,T){var U=T;U=U.replace(/^\n+/,"");U=U.replace(/\n+$/g,"");U="\n\n~K"+(h.push(U)-1)+"K\n\n";return U}function i(U,T){U=l(U);var S="<hr />\n";U=U.replace(/^[ ]{0,2}([ ]?\*[ ]?){3,}[ \t]*$/gm,S);U=U.replace(/^[ ]{0,2}([ ]?-[ ]?){3,}[ \t]*$/gm,S);U=U.replace(/^[ ]{0,2}([ ]?_[ ]?){3,}[ \t]*$/gm,S);U=O(U);U=t(U);U=j(U);U=r(U);U=L(U,T);return U}function n(S){S=u(S);S=y(S);S=K(S);S=G(S);S=H(S);S=N(S);S=S.replace(/~P/g,"://");S=F(S);S=A(S);S=S.replace(/  +\n/g," <br>\n");return S}function y(T){var S=/(<[a-z\/!$]("[^"]*"|'[^']*'|[^'">])*>|<!(--(?:|(?:[^>-]|-[^>])(?:[^-]|-[^-])*)--)>)/gi;T=T.replace(S,function(V){var U=V.replace(/(.)<\/?code>(?=.)/g,"$1`");U=B(U,V.charAt(1)=="!"?"\\`*_/":"\\`*_");return U});return T}function H(S){S=S.replace(/(\[((?:\[[^\]]*\]|[^\[\]])*)\][ ]?(?:\n[ ]*)?\[(.*?)\])()()()()/g,k);S=S.replace(/(\[((?:\[[^\]]*\]|[^\[\]])*)\]\([ \t]*()<?((?:\([^)]*\)|[^()])*?)>?[ \t]*((['"])(.*?)\6[ \t]*)?\))/g,k);S=S.replace(/(\[([^\[\]]+)\])()()()()()/g,k);return S}function k(Y,ae,ad,ac,ab,aa,X,W){if(W==undefined){W=""}var V=ae;var T=ad.replace(/:\/\//g,"~P");var U=ac.toLowerCase();var S=ab;var Z=W;if(S==""){if(U==""){U=T.toLowerCase().replace(/ ?\n/g," ")}S="#"+U;if(z.get(U)!=undefined){S=z.get(U);if(q.get(U)!=undefined){Z=q.get(U)}}else{if(V.search(/\(\s*\)$/m)>-1){S=""}else{return V}}}S=D(S);S=B(S,"*_");var af='<a href="'+S+'"';if(Z!=""){Z=J(Z);Z=B(Z,"*_");af+=' title="'+Z+'"'}af+=">"+T+"</a>";return af}function G(S){S=S.replace(/(!\[(.*?)\][ ]?(?:\n[ ]*)?\[(.*?)\])()()()()/g,I);S=S.replace(/(!\[(.*?)\]\s?\([ \t]*()<?(\S+?)>?[ \t]*((['"])(.*?)\6[ \t]*)?\))/g,I);return S}function J(S){return S.replace(/>/g,"&gt;").replace(/</g,"&lt;").replace(/"/g,"&quot;")}function I(Y,ae,ad,ac,ab,aa,X,W){var V=ae;var U=ad;var T=ac.toLowerCase();var S=ab;var Z=W;if(!Z){Z=""}if(S==""){if(T==""){T=U.toLowerCase().replace(/ ?\n/g," ")}S="#"+T;if(z.get(T)!=undefined){S=z.get(T);if(q.get(T)!=undefined){Z=q.get(T)}}else{return V}}U=B(J(U),"*_[]()");S=B(S,"*_");var af='<img src="'+S+'" alt="'+U+'"';Z=J(Z);Z=B(Z,"*_");af+=' title="'+Z+'"';af+=" />";return af}function l(S){S=S.replace(/^(.+)[ \t]*\n=+[ \t]*\n+/gm,function(T,U){return"<h1>"+n(U)+"</h1>\n\n"});S=S.replace(/^(.+)[ \t]*\n-+[ \t]*\n+/gm,function(U,T){return"<h2>"+n(T)+"</h2>\n\n"});S=S.replace(/^(\#{1,6})[ \t]*(.+?)[ \t]*\#*\n+/gm,function(T,W,V){var U=W.length;return"<h"+U+">"+n(V)+"</h"+U+">\n\n"});return S}function O(T){T+="~0";var S=/^(([ ]{0,3}([*+-]|\d+[.])[ \t]+)[^\r]+?(~0|\n{2,}(?=\S)(?![ \t]*(?:[*+-]|\d+[.])[ \t]+)))/gm;if(C){T=T.replace(S,function(V,Y,X){var Z=Y;var W=(X.search(/[*+-]/g)>-1)?"ul":"ol";var U=o(Z,W);U=U.replace(/\s+$/,"");U="<"+W+">"+U+"</"+W+">\n";return U})}else{S=/(\n\n|^\n?)(([ ]{0,3}([*+-]|\d+[.])[ \t]+)[^\r]+?(~0|\n{2,}(?=\S)(?![ \t]*(?:[*+-]|\d+[.])[ \t]+)))/g;T=T.replace(S,function(W,aa,Y,V){var Z=aa;var ab=Y;var X=(V.search(/[*+-]/g)>-1)?"ul":"ol";var U=o(ab,X);U=Z+"<"+X+">\n"+U+"</"+X+">\n";return U})}T=T.replace(/~0/,"");return T}var s={ol:"\\d+[.]",ul:"[*+-]"};function o(U,T){C++;U=U.replace(/\n{2,}$/,"\n");U+="~0";var S=s[T];var V=new RegExp("(^[ \\t]*)("+S+")[ \\t]+([^\\r]+?(\\n+))(?=(~0|\\1("+S+")[ \\t]+))","gm");var W=false;U=U.replace(V,function(Y,aa,Z,X){var ad=X;var ae=aa;var ac=/\n\n$/.test(ad);var ab=ac||ad.search(/\n{2,}/)>-1;if(ab||W){ad=i(w(ad),true)}else{ad=O(w(ad));ad=ad.replace(/\n$/,"");ad=n(ad)}W=ac;return"<li>"+ad+"</li>\n"});U=U.replace(/~0/g,"");C--;return U}function t(S){S+="~0";S=S.replace(/(?:\n\n|^)((?:(?:[ ]{4}|\t).*\n+)+)(\n*[ ]{0,3}[^ \t\n]|(?=~0))/g,function(T,V,U){var W=V;var X=U;W=E(w(W));W=M(W);W=W.replace(/^\n+/g,"");W=W.replace(/\n+$/g,"");W="<pre><code>"+W+"\n</code></pre>";return"\n\n"+W+"\n\n"+X});S=S.replace(/~0/,"");return S}function Q(S){S=S.replace(/(^\n+|\n+$)/g,"");return"\n\n~K"+(h.push(S)-1)+"K\n\n"}function u(S){S=S.replace(/(^|[^\\])(`+)([^\r]*?[^`])\2(?!`)/gm,function(V,X,W,U,T){var Y=U;Y=Y.replace(/^([ \t]*)/g,"");Y=Y.replace(/[ \t]*$/g,"");Y=E(Y);Y=Y.replace(/:\/\//g,"~P");return X+"<code>"+Y+"</code>"});return S}function E(S){S=S.replace(/&/g,"&amp;");S=S.replace(/</g,"&lt;");S=S.replace(/>/g,"&gt;");S=B(S,"*_{}[]\\",false);return S}function A(S){S=S.replace(/([\W_]|^)(\*\*|__)(?=\S)([^\r]*?\S[\*_]*)\2([\W_]|$)/g,"$1<strong>$3</strong>$4");S=S.replace(/([\W_]|^)(\*|_)(?=\S)([^\r\*_]*?\S)\2([\W_]|$)/g,"$1<em>$3</em>$4");return S}function j(S){S=S.replace(/((^[ \t]*>[ \t]?.+\n(.+\n)*\n*)+)/gm,function(T,U){var V=U;V=V.replace(/^[ \t]*>[ \t]?/gm,"~0");V=V.replace(/~0/g,"");V=V.replace(/^[ \t]+$/gm,"");V=i(V);V=V.replace(/(^|\n)/g,"$1  ");V=V.replace(/(\s*<pre>[^\r]+?<\/pre>)/gm,function(W,X){var Y=X;Y=Y.replace(/^  /mg,"~0");Y=Y.replace(/~0/g,"");return Y});return Q("<blockquote>\n"+V+"\n</blockquote>")});return S}function L(Z,S){Z=Z.replace(/^\n+/g,"");Z=Z.replace(/\n+$/g,"");var aa=Z.split(/\n{2,}/g);var X=[];var T=/~K(\d+)K/;var U=aa.length;for(var V=0;V<U;V++){var W=aa[V];if(T.test(W)){X.push(W)}else{if(/\S/.test(W)){W=n(W);W=W.replace(/^([ \t]*)/g,"<p>");W+="</p>";X.push(W)}}}if(!S){U=X.length;for(var V=0;V<U;V++){var Y=true;while(Y){Y=false;X[V]=X[V].replace(/~K(\d+)K/g,function(ab,ac){Y=true;return h[ac]})}}}return X.join("\n\n")}function F(S){S=S.replace(/&(?!#?[xX]?(?:[0-9a-fA-F]+|\w+);)/g,"&amp;");S=S.replace(/<(?![a-z\/?\$!])/gi,"&lt;");return S}function K(S){S=S.replace(/\\(\\)/g,v);S=S.replace(/\\([`*_{}\[\]()>#+-.!])/g,v);return S}function N(T){T=T.replace(/(^|\s)(https?|ftp)(:\/\/[-A-Z0-9+&@#\/%?=~_|\[\]\(\)!:,\.;]*[-A-Z0-9+&@#\/%=~_|\[\]])($|\W)/gi,"$1<$2$3>$4");var S=function(V,U){return'<a href="'+U+'">'+m.plainLinkText(U)+"</a>"};T=T.replace(/<((https?|ftp):[^'">\s]+)>/gi,S);return T}function P(S){S=S.replace(/~E(\d+)E/g,function(T,V){var U=parseInt(V);return String.fromCharCode(U)});return S}function w(S){S=S.replace(/^(\t|[ ]{1,4})/gm,"~0");S=S.replace(/~0/g,"");return S}function M(V){if(!/\t/.test(V)){return V}var U=["    ","   ","  "," "],T=0,S;return V.replace(/[\n\t]/g,function(W,X){if(W==="\n"){T=X+1;return W}S=(X-T)%4;T=X+1;return U[S]})}var x=/(?:["'*()[\]:]|~D)/g;function D(T){if(!T){return""}var S=T.length;return T.replace(x,function(U,V){if(U=="~D"){return"%24"}if(U==":"){if(V==S-1||/[0-9\/]/.test(T.charAt(V+1))){return":"}}return"%"+U.charCodeAt(0).toString(16)})}function B(W,T,U){var S="(["+T.replace(/([\[\]\\])/g,"\\$1")+"])";if(U){S="\\\\"+S}var V=new RegExp(S,"g");W=W.replace(V,v);return W}function v(S,U){var T=U.charCodeAt(0);return"~E"+T+"E"}}})();return new c.Converter()});