/*!
	Verite Timeline Loader 0.1
	Designed and built by Zach Wise digitalartwork.net
	Date: March 30, 2012

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    http://www.gnu.org/licenses/

*/  

/* 	CodeKit Import
	http://incident57.com/codekit/
================================================== */
// @codekit-prepend "lazyload.js";


/* TIMELINE CDN LOADER
	Add container div so that user can set width and height
	
================================================== */
// <div id="timeline-embed"></div><script src="load-timeline.js"></script>


(function(embed_loc, embed_doc, embed_window) {
	
	
	var jsReady = false;
	var cssReady = false;
	var preload_checks = 0;
	
	/* Add Timeline Div
	================================================== */
	var t = document.createElement('div');
	document.getElementById("timeline-embed").appendChild(t);
	t.setAttribute("id", 'timeline');
	
	
	
	LazyLoad.css('http://veritetimeline.appspot.com/latest/timeline.css', cssComplete);
	
	try {
	    var jqueryLoaded=jQuery;
	    jqueryLoaded=true;
	} catch(err) {
	    var jqueryLoaded=false;
	}
	
	//var head= document.getElementsByTagName('head')[0];
	if (!jqueryLoaded) {
		LazyLoad.js('http://ajax.googleapis.com/ajax/libs/jquery/1.7.1/jquery.min.js', onJQueryLoaded);
	} else {
		onJQueryLoaded();
	}
	
	
	function onJQueryLoaded() {
		LazyLoad.js('http://veritetimeline.appspot.com/latest/timeline-min.js', onJSLoaded);
	}
	
	function onJSLoaded() {
		jsReady = true;
		checkLoad();
	}
	
	function cssComplete() {
		cssReady = true;
		checkLoad();
	}
	
	function checkLoad() {
		if (preload_checks > 40) {
			return;
			alert("Error Loading Files")
		} else {
			preload_checks++;
			
			if (jsReady && cssReady) {
				var timeline = new VMM.Timeline();
				timeline.init("taylor/data.json");
			} else {
				setTimeout('checkLoad();', 250);
			}
		}
	}
	
	
	/*
	var stylesheet = document.createElement('link');
	stylesheet.href = '/inc/body/jquery/css/start/jquery-ui-1.8.10.custom.css';
	stylesheet.rel = 'stylesheet';
	stylesheet.type = 'text/css';
	document.getElementsByTagName('head')[0].appendChild(stylesheet);

	var tjs = document.createElement('script');
	tjs.type = 'text/javascript';
	tjs.async = true;
	tjs.url = '/inc/body/jquery/css/start/jquery-ui-1.8.10.custom.css';
	document.getElementsByTagName('head')[0].appendChild(tjs);
	*/
	
}) (this, document, window);

/*

document.getElementById('myText');
function(embed_loc, embed_doc, embed_window) {
	function e(embed_loc, embed_doc) {
        var c,
        d = [],
        e,
        g;
        try {
            if (document.querySelectorAll) d = document.querySelectorAll(embed_loc + "." + embed_doc);
            else if (document.getElementsByClassName) {
                c = document.getElementsByClassName(embed_doc);
                for (e = 0; g = c[e]; e++) g.tagName.toLowerCase() == embed_loc && d.push(g)
            } else {
                c = document.getElementsByTagName(a);
                var h = RegExp("\\b" + embed_doc + "\\b");
                f(c,
                function(embed_loc, embed_doc) {
                    var c = embed_loc.className || embed_loc.getAttribute("class");
                    c && c.match(h) && d.push(embed_loc)
                })
            }
        } catch(i) {}
        return d
    }
	
} (this, document, window)
*/