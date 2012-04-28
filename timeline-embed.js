/*jslint browser: true, eqeqeq: true, bitwise: true, newcap: true, immed: true, regexp: false *//**
LazyLoad makes it easy and painless to lazily load one or more external
JavaScript or CSS files on demand either during or after the rendering of a web
page.

Supported browsers include Firefox 2+, IE6+, Safari 3+ (including Mobile
Safari), Google Chrome, and Opera 9+. Other browsers may or may not work and
are not officially supported.

Visit https://github.com/rgrove/lazyload/ for more info.

Copyright (c) 2011 Ryan Grove <ryan@wonko.com>
All rights reserved.

Permission is hereby granted, free of charge, to any person obtaining a copy of
this software and associated documentation files (the 'Software'), to deal in
the Software without restriction, including without limitation the rights to
use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
the Software, and to permit persons to whom the Software is furnished to do so,
subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

@module lazyload
@class LazyLoad
@static
@version 2.0.3 (git)
*/LazyLoad=function(a){function h(b,c){var d=a.createElement(b),e;for(e in c)c.hasOwnProperty(e)&&d.setAttribute(e,c[e]);return d}function i(a){var b=d[a],c,g;if(b){c=b.callback;g=b.urls;g.shift();e=0;if(!g.length){c&&c.call(b.context,b.obj);d[a]=null;f[a].length&&k(a)}}}function j(){var c=navigator.userAgent;b={async:a.createElement("script").async===!0};(b.webkit=/AppleWebKit\//.test(c))||(b.ie=/MSIE/.test(c))||(b.opera=/Opera/.test(c))||(b.gecko=/Gecko\//.test(c))||(b.unknown=!0)}function k(e,g,k,n,o){var p=function(){i(e)},q=e==="css",r=[],s,t,u,v,w,x;b||j();if(g){g=typeof g=="string"?[g]:g.concat();if(q||b.async||b.gecko||b.opera)f[e].push({urls:g,callback:k,obj:n,context:o});else for(s=0,t=g.length;s<t;++s)f[e].push({urls:[g[s]],callback:s===t-1?k:null,obj:n,context:o})}if(d[e]||!(v=d[e]=f[e].shift()))return;c||(c=a.head||a.getElementsByTagName("head")[0]);w=v.urls;for(s=0,t=w.length;s<t;++s){x=w[s];if(q)u=b.gecko?h("style"):h("link",{href:x,rel:"stylesheet"});else{u=h("script",{src:x});u.async=!1}u.className="lazyload";u.setAttribute("charset","utf-8");if(b.ie&&!q)u.onreadystatechange=function(){if(/loaded|complete/.test(u.readyState)){u.onreadystatechange=null;p()}};else if(q&&(b.gecko||b.webkit))if(b.webkit){v.urls[s]=u.href;m()}else{u.innerHTML='@import "'+x+'";';l(u)}else u.onload=u.onerror=p;r.push(u)}for(s=0,t=r.length;s<t;++s)c.appendChild(r[s])}function l(a){var b;try{b=!!a.sheet.cssRules}catch(c){e+=1;e<200?setTimeout(function(){l(a)},50):b&&i("css");return}i("css")}function m(){var a=d.css,b;if(a){b=g.length;while(--b>=0)if(g[b].href===a.urls[0]){i("css");break}e+=1;a&&(e<200?setTimeout(m,50):i("css"))}}var b,c,d={},e=0,f={css:[],js:[]},g=a.styleSheets;return{css:function(a,b,c,d){k("css",a,b,c,d)},js:function(a,b,c,d){k("js",a,b,c,d)}}}(this.document);(function(){function q(){LazyLoad.js(a.js,r)}function r(){c=!0;v()}function s(){d=!0;v()}function t(){e=!0;v()}function u(){f=!0;v()}function v(){if(j>40)return;j++;if(c&&d&&e&&f){if(!i){i=!0;l=new VMM.Timeline;l.init(a.source)}}else k=setTimeout("checkAgain();",250)}var a={width:800,height:600,source:"taylor/data.json",font:"default",css:"http://veritetimeline.appspot.com/latest/timeline.css",js:"http://veritetimeline.appspot.com/latest/timeline-min.js"};if(typeof timeline_config=="object"){var b;for(b in timeline_config)Object.prototype.hasOwnProperty.call(timeline_config,b)&&(a[b]=timeline_config[b])}else if(typeof config=="object"){var b;for(b in config)Object.prototype.hasOwnProperty.call(config,b)&&(a[b]=config[b])}timeline_config=a;var c=!1,d=!1,e=!1,f=!1,g="http://veritetimeline.appspot.com/latest/font/",h="http://ajax.googleapis.com/ajax/libs/webfont/1/webfont.js",i=!1,j=0,k,l,m=document.createElement("div"),n=document.getElementById("timeline-embed");n.appendChild(m);m.setAttribute("id","timeline");a.width.toString().match("%")||a.width.toString().match("px")?n.style.width=a.width:n.style.width=a.width+"px";a.height.toString().match("%")||a.height.toString().match("px")?n.style.height=a.height:n.style.height=a.height+"px";m.style.position="relative";LazyLoad.css(a.css,s);if(a.font!="default"){f=!0;e=!0}else{a.font.match("http://")?g=a.font:g=g+a.font+".css";LazyLoad.css(g,t);WebFontConfig={google:{families:["News+Cycle:400,700:latin","Merriweather:400,700,900:latin"]}};LazyLoad.js(h,u)}try{var o=jQuery;o=!0}catch(p){var o=!1}o?q():LazyLoad.js("http://ajax.googleapis.com/ajax/libs/jquery/1.7.1/jquery.min.js",q);this.checkAgain=function(){v()}})();