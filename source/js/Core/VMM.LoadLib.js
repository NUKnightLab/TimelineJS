/*
	LoadLib
	Based on LazyLoad by Ryan Grove
	https://github.com/rgrove/lazyload/ 
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

================================================== */
window.loadedJS = [];


if(typeof VMM != 'undefined' && typeof VMM.LoadLib == 'undefined') {
	//VMM.LoadLib.js('http://ajax.googleapis.com/ajax/libs/jquery/1.7.1/jquery.min.js', onJQueryLoaded);
	//VMM.LoadLib.css('http://someurl.css', onCSSLoaded);
	
	
	
	VMM.LoadLib = (function (doc) {
		var env,
		head,
		pending = {},
		pollCount = 0,
		queue = {css: [], js: []},
		styleSheets = doc.styleSheets;
	
		var loaded_Array = [];
	
		function isLoaded(url) {
			var has_been_loaded = false;
			for(var i=0; i<loaded_Array.length; i++) {
				if (loaded_Array[i] == url) {
					has_been_loaded = true;
				}
			}
			if (!has_been_loaded) {
				loaded_Array.push(url);
			}
			return has_been_loaded;
		}

		function createNode(name, attrs) {
			var node = doc.createElement(name), attr;

			for (attr in attrs) {
				if (attrs.hasOwnProperty(attr)) {
					node.setAttribute(attr, attrs[attr]);
				}
			}

			return node;
		}

	  function finish(type) {
	    var p = pending[type],
	        callback,
	        urls;

	    if (p) {
	      callback = p.callback;
	      urls     = p.urls;
	      urls.shift();
	      pollCount = 0;
	      if (!urls.length) {
	        callback && callback.call(p.context, p.obj);
	        pending[type] = null;
	        queue[type].length && load(type);
	      }
	    }
	  }

	  function getEnv() {
	    var ua = navigator.userAgent;

	    env = {

	      async: doc.createElement('script').async === true
	    };

	    (env.webkit = /AppleWebKit\//.test(ua))
	      || (env.ie = /MSIE/.test(ua))
	      || (env.opera = /Opera/.test(ua))
	      || (env.gecko = /Gecko\//.test(ua))
	      || (env.unknown = true);
	  }

	  function load(type, urls, callback, obj, context) {
	    var _finish = function () { finish(type); },
	        isCSS   = type === 'css',
	        nodes   = [],
	        i, len, node, p, pendingUrls, url;

	    env || getEnv();

	    if (urls) {

	      urls = typeof urls === 'string' ? [urls] : urls.concat();

	      if (isCSS || env.async || env.gecko || env.opera) {

	        queue[type].push({
	          urls    : urls,
	          callback: callback,
	          obj     : obj,
	          context : context
	        });
	      } else {
	        for (i = 0, len = urls.length; i < len; ++i) {
	          queue[type].push({
	            urls    : [urls[i]],
	            callback: i === len - 1 ? callback : null,
	            obj     : obj,
	            context : context
	          });
	        }
	      }
	    }

	    if (pending[type] || !(p = pending[type] = queue[type].shift())) {
	      return;
	    }

	    head || (head = doc.head || doc.getElementsByTagName('head')[0]);
	    pendingUrls = p.urls;

	    for (i = 0, len = pendingUrls.length; i < len; ++i) {
	      url = pendingUrls[i];

	      if (isCSS) {
	          node = env.gecko ? createNode('style') : createNode('link', {
	            href: url,
	            rel : 'stylesheet'
	          });
	      } else {
	        node = createNode('script', {src: url});
	        node.async = false;
	      }

	      node.className = 'lazyload';
	      node.setAttribute('charset', 'utf-8');

	      if (env.ie && !isCSS) {
	        node.onreadystatechange = function () {
	          if (/loaded|complete/.test(node.readyState)) {
	            node.onreadystatechange = null;
	            _finish();
	          }
	        };
	      } else if (isCSS && (env.gecko || env.webkit)) {
	        if (env.webkit) {
	          p.urls[i] = node.href; 
	          pollWebKit();
	        } else {
	          node.innerHTML = '@import "' + url + '";';
	          pollGecko(node);
	        }
	      } else {
	        node.onload = node.onerror = _finish;
	      }

	      nodes.push(node);
	    }

	    for (i = 0, len = nodes.length; i < len; ++i) {
	      head.appendChild(nodes[i]);
	    }
	  }

	  function pollGecko(node) {
	    var hasRules;

	    try {

	      hasRules = !!node.sheet.cssRules;
	    } catch (ex) {
	      pollCount += 1;

	      if (pollCount < 200) {
	        setTimeout(function () { pollGecko(node); }, 50);
	      } else {

	        hasRules && finish('css');
	      }

	      return;
	    }

	    finish('css');
	  }

	  function pollWebKit() {
	    var css = pending.css, i;

	    if (css) {
	      i = styleSheets.length;

	      while (--i >= 0) {
	        if (styleSheets[i].href === css.urls[0]) {
	          finish('css');
	          break;
	        }
	      }

	      pollCount += 1;

	      if (css) {
	        if (pollCount < 200) {
	          setTimeout(pollWebKit, 50);
	        } else {

	          finish('css');
	        }
	      }
	    }
	  }

	  return {

		css: function (urls, callback, obj, context) {
			if (isLoaded(urls)) {
				return callback;
			} else {
				load('css', urls, callback, obj, context);
			}
		},

		js: function (urls, callback, obj, context) {
			if (isLoaded(urls)) {
				return callback;
			} else {
				load('js', urls, callback, obj, context);
			}
		}

	  };
	})(this.document);
}

