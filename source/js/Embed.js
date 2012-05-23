/*!
	VéritéCo Timeline Loader 0.3
	Designed and built by Zach Wise digitalartwork.net
	Date: May 22, 2012

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
// @codekit-prepend "lib/Embed.LoadLib.js";


/* TIMELINE LOADER
================================================== */
(function() {
	
	/* VARS
	================================================== */
	var timelinejs, t, te, x, isCDN = false,
		timeline_js_version = "1.43",
		ready = {
			timeout:	"",
			checks:		0,
			finished:	false,
			js:			false,
			css:		false,
			jquery:		false,
			language:	false,
			font: {
				css:	false,
				js:		false
			}
		},
		path = {
			base:		"http://embed.verite.co/timeline/",
			css:		"http://embed.verite.co/timeline/css/",
			js:			"http://embed.verite.co/timeline/js/",
			locale:		"http://embed.verite.co/timeline/js/locale/",
			font: {
				css:	"http://embed.verite.co/timeline/css/themes/font/",
				js:		"http://ajax.googleapis.com/ajax/libs/webfont/1/webfont.js",
				google:	[ 'Bevan::latin', 'Pontano+Sans::latin' ]
			}
		},
		embed_config = {
			embed:		true,
			width:		'100%',
			height:		'650',
			source:		'https://docs.google.com/spreadsheet/pub?key=0Agl_Dv6iEbDadFYzRjJPUGktY0NkWXFUWkVIZDNGRHc&output=html',
			lang:		'en',
			font:		'default',
			css:		path.css + 'timeline.css?'+timeline_js_version,
			js:			path.js + 'timeline-min.js?'+timeline_js_version
		};
	
	/* BUILD CONFIG
	================================================== */
	if (typeof url_config == 'object') {
		embed_config.height = "100%";
		for (x in url_config) {
			if (Object.prototype.hasOwnProperty.call(url_config, x)) {
				embed_config[x] = url_config[x];
			}
		}
		if (embed_config.source.match("docs.google.com")) {
		
		} else if (embed_config.source.match("json")) {
		
		} else if (embed_config.source.match("storify")) {
		
		} else {
			embed_config.source = "https://docs.google.com/spreadsheet/pub?key=" + embed_config.source + "&output=html";
		}
		isCDN = true;
	} else if (typeof timeline_config == 'object') {
		for (x in timeline_config) {
			if (Object.prototype.hasOwnProperty.call(timeline_config, x)) {
				embed_config[x] = timeline_config[x];
			}
		}
	} else if (typeof config == 'object') {
		for (x in config) {
			if (Object.prototype.hasOwnProperty.call(config, x)) {
				embed_config[x] = config[x];
			}
		}
	}
	
	/* PREPARE
	================================================== */
	timeline_config = embed_config;
	createTimelineDiv();
	
	/* Load 
	================================================== */
	LazyLoad.css(embed_config.css, onloaded_css);
	
	//	Load Font
	if (embed_config.font == "default") {
		ready.font.js = true;
		ready.font.css = true;
	} else {
		
		//	Load Font CSS
		if (embed_config.font.match("/")) {
			path.font.css = embed_config.font;
		} else {
			path.font.css = path.font.css + embed_config.font + ".css";
		}
		LazyLoad.css(path.font.css, onloaded_font_css);
		
		//	Load Font JS
		switch (embed_config.font) {
			case "Merriweather-NewsCycle":
				path.font.google = [ 'News+Cycle:400,700:latin', 'Merriweather:400,700,900:latin' ];
				break;
			case "PoiretOne-Molengo":
				path.font.google = [ 'Poiret+One::latin', 'Molengo::latin' ];
				break;
			case "Arvo-PTSans":
				path.font.google = [ 'Arvo:400,700,400italic:latin', 'PT+Sans:400,700,400italic:latin' ];
				break;
			case "PTSerif-PTSans":
				path.font.google = [ 'PT+Sans:400,700,400italic:latin', 'PT+Serif:400,700,400italic:latin' ];
				break;
			case "DroidSerif-DroidSans":
				path.font.google = [ 'Droid+Sans:400,700:latin', 'Droid+Serif:400,700,400italic:latin' ] ;
				break;
			case "Lekton-Molengo":
				path.font.google = [ 'Lekton:400,700,400italic:latin', 'Molengo::latin' ];
				break;
			case "NixieOne-Ledger":
				path.font.google = [ 'Nixie+One::latin', 'Ledger::latin' ];
				break;
			case "AbrilFatface-Average":
				path.font.google = [ 'Average::latin', 'Abril+Fatface::latin' ];
				break;
			case "PlayfairDisplay-Muli":
				path.font.google = [ 'Playfair+Display:400,400italic:latin', 'Muli:300,400,300italic,400italic:latin' ];
				break;
			case "Rancho-Gudea":
				path.font.google = [ 'Rancho::latin', 'Gudea:400,700,400italic:latin' ];
				break;
			case "Bevan-PotanoSans":
				path.font.google = [ 'Bevan::latin', 'Pontano+Sans::latin' ];
				break;
			case "BreeSerif-OpenSans":
				path.font.google = [ 'Bree+Serif::latin', 'Open+Sans:300italic,400italic,600italic,700italic,800italic,400,300,600,700,800:latin' ];
				break;
			case "SansitaOne-Kameron":
				path.font.google = [ 'Sansita+One::latin', 'Kameron:400,700:latin' ];
				break;
			case "Pacifico-Arimo":
				path.font.google = [ 'Pacifico::latin', 'Arimo:400,700,400italic,700italic:latin' ];
				break;
			default:
				path.font.google = [ 'News+Cycle:400,700:latin', 'Merriweather:400,700,900:latin' ];
		}
		
		WebFontConfig = {google: { families: path.font.google }};
		
		LazyLoad.js(path.font.js, onloaded_font_js);
		
	}
	
	//	Load jQuery
	try {
	    ready.jquery = jQuery;
	    ready.jquery = true;
	} catch(err) {
	    ready.jquery = false;
	}
	if (!ready.jquery) {
		LazyLoad.js('http://ajax.googleapis.com/ajax/libs/jquery/1.7.1/jquery.min.js', onloaded_jquery);
	} else {
		onJQueryLoaded();
	}
	
	/* On Loaded
	================================================== */
	
	function onloaded_jquery() {
		LazyLoad.js(embed_config.js, onloaded_js);
	}
	function onloaded_js() {
		ready.js = true;
		if (embed_config.lang != "en") {
			LazyLoad.js(path.locale + embed_config.lang + ".js?" + timeline_js_version, onloaded_language);
		} else {
			ready.language = true;
		}
		onloaded_check();
	}
	function onloaded_language() {
		ready.language = true;
		onloaded_check();
	}
	function onloaded_css() {
		ready.css = true;
		onloaded_check();
	}
	function onloaded_font_css() {
		ready.font.css = true;
		onloaded_check();
	}
	function onloaded_font_js() {
		ready.font.js = true;
		onloaded_check();
	}
	function onloaded_check() {
		if (ready.checks > 40) {
			return;
			alert("Error Loading Files");
		} else {
			ready.checks++;
			if (ready.js && ready.css && ready.font.css && ready.font.js && ready.language) {
				if (!ready.finished) {
					ready.finished = true;
					buildTimeline();
				}
			} else {
				ready.timeout = setTimeout('onloaded_check_again();', 250);
			}
		}
	};
	this.onloaded_check_again = function() {
		onloaded_check();
	};
	
	/* Build Timeline
	================================================== */
	function createTimelineDiv() {
		t = document.createElement('div');
		te = document.getElementById("timeline-embed");
		te.appendChild(t);
		t.setAttribute("id", 'timeline');
	
		if (embed_config.width.toString().match("%") ) {
			te.style.width = embed_config.width;
			te.setAttribute("class", "full-embed ");
			te.setAttribute("className", "full-embed "); 
		} else {
			te.setAttribute("class", " sized-embed");
			te.setAttribute("className", " sized-embed"); 
			embed_config.width = embed_config.width - 2;
			te.style.width = (embed_config.width) + 'px';
		}
	
		if (embed_config.height.toString().match("%") ) {
			te.style.height = embed_config.height;
		} else {
			embed_config.height = embed_config.height - 16;
			te.style.height = (embed_config.height) + 'px';
		}
		
		t.style.position = 'relative';
	}
	
	function buildTimeline() {
		timelinejs = new VMM.Timeline();
		timelinejs.init(embed_config.source);
		if (isCDN) {
			VMM.bindEvent(global, onTimelineHeadline, "TIMELINE_HEADLINE");
		}
	};
	
	
	
})();