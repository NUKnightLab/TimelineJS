/*	* VéritéCo Timeline Loader 0.8
	* Designed and built by Zach Wise digitalartwork.net

    * This program is free software: you can redistribute it and/or modify
    * it under the terms of the GNU General Public License as published by
    * the Free Software Foundation, either version 3 of the License, or
    * (at your option) any later version.

    * This program is distributed in the hope that it will be useful,
    * but WITHOUT ANY WARRANTY; without even the implied warranty of
    * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    * GNU General Public License for more details.

    * http://www.gnu.org/licenses/

*/  

/* 	CodeKit Import
	http://incident57.com/codekit/
================================================== */
// @codekit-prepend "../lib/Embed.LoadLib.js";

var WebFontConfig;

if(typeof timeline_path == 'undefined' || typeof timeline_path == 'undefined') {
	// REPLACE WITH YOUR BASEPATH IF YOU WANT OTHERWISE IT WILL TRY AND FIGURE IT OUT
	var timeline_path = getScriptPath("timeline-embed.js").split("js/")[0];
}
function getScriptPath(scriptname) {
	var scriptTags = document.getElementsByTagName('script'),
		script_path = "",
		script_path_end = "";
	for(var i = 0; i < scriptTags.length; i++) {
		if (scriptTags[i].src.match(scriptname)) {
			script_path = scriptTags[i].src;
		}
	}
	if (script_path != "") {
		script_path_end = "/"
	}
	return script_path.split('?')[0].split('/').slice(0, -1).join('/') + script_path_end;
}

/* TIMELINE LOADER
================================================== */
(function() {
	
	
	/* VARS
	================================================== */
	var timelinejs, t, te, x, isCDN = false,
		timeline_js_version = "1.62",
		jquery_version_required = "1.7.1",
		jquery_version = "",
		ready = {
			timeout:	"",
			checks:		0,
			finished:	false,
			js:			false,
			css:		false,
			jquery:		false,
			has_jquery:	false,
			language:	false,
			font: {
				css:	false,
				js:		false
			}
		},
		path = {
			base:		timeline_path,
			css:		timeline_path + "css/",
			js:			timeline_path + "js/",
			locale:		timeline_path + "js/locale/",
			jquery:		"http://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js",
			font: {
				google:	false,
				css:	timeline_path + "css/themes/font/",
				js:		"http://ajax.googleapis.com/ajax/libs/webfont/1/webfont.js"
			}
		},
		embed_config = {
			version:	timeline_js_version,
			debug:		false,
			embed:		true,
			width:		'100%',
			height:		'650',
			source:		'https://docs.google.com/spreadsheet/pub?key=0Agl_Dv6iEbDadFYzRjJPUGktY0NkWXFUWkVIZDNGRHc&output=html',
			lang:		'en',
			font:		'default',
			css:		path.css + 'timeline.css?'+timeline_js_version,
			js:			path.js + 'timeline-min.js?'+timeline_js_version
		},
		font_presets = [
			{ name:	"Merriweather-NewsCycle",		google:	[ 'News+Cycle:400,700:latin', 'Merriweather:400,700,900:latin' ] },
			{ name:	"PoiretOne-Molengo",			google:	[ 'Poiret+One::latin', 'Molengo::latin' ] },
			{ name:	"Arvo-PTSans",					google:	[ 'Arvo:400,700,400italic:latin', 'PT+Sans:400,700,400italic:latin' ] },
			{ name:	"PTSerif-PTSans",				google:	[ 'PT+Sans:400,700,400italic:latin', 'PT+Serif:400,700,400italic:latin' ] },
			{ name:	"PT",							google:	[ 'PT+Sans+Narrow:400,700:latin', 'PT+Sans:400,700,400italic:latin', 'PT+Serif:400,700,400italic:latin' ] },
			{ name:	"DroidSerif-DroidSans",			google:	[ 'Droid+Sans:400,700:latin', 'Droid+Serif:400,700,400italic:latin' ] },
			{ name:	"Lekton-Molengo",				google:	[ 'Lekton:400,700,400italic:latin', 'Molengo::latin' ] },
			{ name:	"NixieOne-Ledger",				google:	[ 'Nixie+One::latin', 'Ledger::latin' ] },
			{ name:	"AbrilFatface-Average",			google:	[ 'Average::latin', 'Abril+Fatface::latin' ] },
			{ name:	"PlayfairDisplay-Muli",			google:	[ 'Playfair+Display:400,400italic:latin', 'Muli:300,400,300italic,400italic:latin' ] },
			{ name:	"Rancho-Gudea",					google:	[ 'Rancho::latin', 'Gudea:400,700,400italic:latin' ] },
			{ name:	"Bevan-PotanoSans",				google:	[ 'Bevan::latin', 'Pontano+Sans::latin' ] },
			{ name:	"BreeSerif-OpenSans",			google:	[ 'Bree+Serif::latin', 'Open+Sans:300italic,400italic,600italic,700italic,800italic,400,300,600,700,800:latin' ] },
			{ name:	"SansitaOne-Kameron",			google:	[ 'Sansita+One::latin', 'Kameron:400,700:latin' ] },
			{ name:	"Lora-Istok",					google:	[ 'Lora:400,700,400italic,700italic:latin', 'Istok+Web:400,700,400italic,700italic:latin' ] },
			{ name:	"Pacifico-Arimo",				google:	[ 'Pacifico::latin', 'Arimo:400,700,400italic,700italic:latin' ] }
		];

	
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
	
	/* PREPARE LANGUAGE
	================================================== */
	if (embed_config.lang.match("/")) {
		path.locale = embed_config.lang;
	} else {
		path.locale = path.locale + embed_config.lang + ".js?" + timeline_js_version;
	}
	// Check for old installs still using the old method of language
	if (embed_config.js.match("locale")) {
		embed_config.lang = embed_config.js.split("locale/")[1].replace(".js", "");
		embed_config.js = path.js + 'timeline-min.js?'+timeline_js_version;
	}
	/* PREPARE
	================================================== */
	timeline_config = embed_config;
	createTimelineDiv();
	
	/* Load CSS
	================================================== */
	LazyLoad.css(embed_config.css, onloaded_css);
	
	/* Load FONT
	================================================== */
	if (embed_config.font == "default") {
		ready.font.js		= true;
		ready.font.css		= true;
	} else {
		// FONT CSS
		var fn;
		if (embed_config.font.match("/")) {
			fn				= embed_config.font.split(".css")[0].split("/");
			path.font.name	= fn[fn.length -1];
			path.font.css	= embed_config.font;
		} else {
			path.font.name	= embed_config.font;
			path.font.css	= path.font.css + embed_config.font + ".css?" + timeline_js_version;
		}
		LazyLoad.css(path.font.css, onloaded_font_css);
		
		// FONT GOOGLE JS
		for(var i = 0; i < font_presets.length; i++) {
			if (path.font.name == font_presets[i].name) {
				path.font.google = true;
				WebFontConfig = {google: { families: font_presets[i].google }};
			}
		}
		
		if (path.font.google) {
			LazyLoad.js(path.font.js, onloaded_font_js);
		} else {
			ready.font.js		= true;
		}
		
	}
	
	/* Load jQuery
	================================================== */
	try {
	    ready.has_jquery = jQuery;
	    ready.has_jquery = true;
		if (ready.has_jquery) {
			var jquery_version = parseFloat(jQuery.fn.jquery);
			if (jquery_version < parseFloat(jquery_version_required) ) {
				//console.log("NOT THE REQUIRED VERSION OF JQUERY, LOADING THE REQUIRED VERSION");
				//console.log("YOU HAVE VERSION " + jQuery.fn.jquery + ", JQUERY VERSION " + jquery_version_required + " OR ABOVE NEEDED");
				ready.jquery = false;
			} else {
				ready.jquery = true;
			}
		}
	} catch(err) {
	    ready.jquery = false;
	}
	if (!ready.jquery) {
		LazyLoad.js(path.jquery, onloaded_jquery);
	} else {
		onloaded_jquery();
	}
	
	/* On Loaded
	================================================== */
	
	function onloaded_jquery() {
		LazyLoad.js(embed_config.js, onloaded_js);
	}
	function onloaded_js() {
		ready.js = true;
		if (embed_config.lang != "en") {
			LazyLoad.js(path.locale, onloaded_language);
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
		VMM.debug = embed_config.debug;
		timelinejs = new VMM.Timeline();
		timelinejs.init(embed_config.source);
		if (isCDN) {
			VMM.bindEvent(global, onTimelineHeadline, "TIMELINE_HEADLINE");
		}
	};
	
	
	
})();