/**
	* Timeline
	* Designed and built by Zach Wise at VéritéCo

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

/*	* CodeKit Import
	* http://incident57.com/codekit/
================================================== */
// @codekit-prepend "VMM.Timeline.License.js";

// @codekit-prepend "Core/VMM.js";
// @codekit-prepend "Core/VMM.Library.js";
// @codekit-prepend "Core/VMM.Browser.js";
// @codekit-prepend "Core/VMM.FileExtention.js";
// @codekit-prepend "Core/VMM.Date.js";
// @codekit-prepend "Core/VMM.Util.js";
// @codekit-prepend "Core/VMM.LoadLib.js";

// @codekit-prepend "Media/VMM.ExternalAPI.js";
// @codekit-prepend "Media/VMM.MediaElement.js";
// @codekit-prepend "Media/VMM.MediaType.js";
// @codekit-prepend "Media/VMM.Media.js";
// @codekit-prepend "Media/VMM.TextElement.js";

// @codekit-prepend "Slider/VMM.DragSlider.js";
// @codekit-prepend "Slider/VMM.Slider.js";
// @codekit-prepend "Slider/VMM.Slider.Slide.js";

// @codekit-prepend "VMM.Language.js";

// @codekit-append "VMM.Timeline.TimeNav.js";
// @codekit-append "VMM.Timeline.DataObj.js";

// @codekit-prepend "lib/AES.js";
// @codekit-prepend "lib/bootstrap-tooltip.js";


/* Timeline
================================================== */

if(typeof VMM != 'undefined' && typeof VMM.Timeline == 'undefined') {
	
	VMM.Timeline = function(w, h, conf, _timeline_id) {
		
		var $timeline, $feedback, slider, timenav, version, timeline_id;
		var events = {}, data = {}, _dates = [], config = {};
		var has_width = false, has_height = false, ie7 = false, is_moving = false;
		
		if (type.of(_timeline_id) == "string") {
			timeline_id = 			_timeline_id;
		} else {
			timeline_id = 			"#timelinejs";
		}
		
		version = 					"1.68";
		
		trace("TIMELINE VERSION " + version);
		
		/* CONFIG
		================================================== */
		config = {
			embed:					false,
			events: {
				data_ready:		"DATAREADY",
				messege:		"MESSEGE",
				headline:		"HEADLINE",
				slide_change:	"SLIDE_CHANGE",
				resize:			"resize"
			},
			id: 					timeline_id,
			type: 					"timeline",
			touch:					false,
			maptype: 				"toner",
			preload:				4,
			current_slide:			0,
			hash_bookmark:			false,
			start_at_end: 			false,
			start_at_slide:			0,
			start_zoom_adjust:		0,
			start_page: 			false,
			api_keys: {
				google:				"",
				flickr:				"",
				twitter:			""
			},
			interval: 				10,
			something: 				0,
			width: 					960,
			height: 				540,
			spacing: 				15,
			loaded: {
				slider: 			false, 
				timenav: 			false, 
				percentloaded: 		0
			},
			nav: {
				start_page: 		false,
				interval_width: 	200,
				density: 			4,
				minor_width: 		0,
				minor_left:			0,
				constraint: {
					left:			0,
					right:			0,
					right_min:		0,
					right_max:		0
				},
				zoom: {
					adjust:			0
				},
				multiplier: {
					current: 		6,
					min: 			.1,
					max: 			50
				},
				rows: 				[1, 1, 1],
				width: 				960,
				height: 			200,
				marker: {
					width: 			150,
					height: 		50
				}
			},
			feature: {
				width: 				960,
				height: 			540
			},
			slider: {
				width: 				720,
				height: 			400,
				content: {
					width: 			720,
					height: 		400,
					padding: 		130
				},
				nav: {
					width: 			100,
					height: 		200
				}
			},
			ease: 					"easeInOutExpo",
			duration: 				1000,
			language: 				VMM.Language
		};
		
		if ( w != null && w != "") {
			config.width = w;
			has_width = true;
		} 

		if ( h != null && h != "") {
			config.height = h;
			has_height = true;
		}
		
		if(window.location.hash) {
			 var hash					=	window.location.hash.substring(1);
			 if (!isNaN(hash)) {
			 	 config.current_slide	=	parseInt(hash);
			 }
		}
		
		window.onhashchange = function () {
			var hash					=	window.location.hash.substring(1);
			if (config.hash_bookmark) {
				if (is_moving) {
					goToEvent(parseInt(hash));
				} else {
					is_moving = false;
				}
			} else {
				goToEvent(parseInt(hash));
			}
		}
		
		/* CREATE CONFIG
		================================================== */
		var createConfig = function(conf) {
			
			// APPLY SUPPLIED CONFIG TO TIMELINE CONFIG
			if (typeof embed_config == 'object') {
				timeline_config = embed_config;
			}
			if (typeof timeline_config == 'object') {
				trace("HAS TIMELINE CONFIG");
				config = VMM.Util.mergeConfig(config, timeline_config);
			} else if (typeof conf == 'object') {
				config = VMM.Util.mergeConfig(config, conf);
			}
			
			if (VMM.Browser.device == "mobile" || VMM.Browser.device == "tablet") {
				config.touch = true;
			}
			
			config.nav.width			= config.width;
			config.nav.height			= 200;
			config.feature.width		= config.width;
			config.feature.height		= config.height - config.nav.height;
			config.nav.zoom.adjust		= parseInt(config.start_zoom_adjust, 10);
			VMM.Timeline.Config			= config;
			VMM.master_config.Timeline	= VMM.Timeline.Config;
			this.events					= config.events;
		}
		
		/* CREATE TIMELINE STRUCTURE
		================================================== */
		var createStructure = function(w, h) {
			$timeline = 			VMM.getElement(timeline_id);
			
			VMM.Lib.addClass(timeline_id, "vmm-timeline");
			if (config.touch) {
				VMM.Lib.addClass(timeline_id, "vmm-touch");
			} else {
				VMM.Lib.addClass(timeline_id, "vmm-notouch");
			}
			
			$feedback = 			VMM.appendAndGetElement($timeline, "<div>", "feedback", "");
			slider = 				new VMM.Slider(timeline_id + " div.slider", config);
			timenav = 				new VMM.Timeline.TimeNav(timeline_id + " div.navigation");
			
			if (!has_width) {
				config.width = VMM.Lib.width($timeline);
			} else {
				VMM.Lib.width($timeline, config.width);
			}

			if (!has_height) {
				config.height = VMM.Lib.height($timeline);
			} else {
				VMM.Lib.height($timeline, config.height);
			}
			
		}
		
		/* ON EVENT
		================================================== */

		function onDataReady(e, d) {
			trace("onDataReady");
			trace(d);
			data = d.timeline;
			
			if (type.of(data.era) == "array") {
				
			} else {
				data.era = [];
			}
			
			buildDates();
			
		};
		
		function onDatesProcessed() {
			build();
		}
		
		function reSize() {
			updateSize();
			slider.setSize(config.feature.width, config.feature.height);
			timenav.setSize(config.width, config.height);
		};
		
		function onSliderLoaded(e) {
			config.loaded.slider = true;
			onComponentLoaded();
		};
		
		function onComponentLoaded(e) {
			config.loaded.percentloaded = config.loaded.percentloaded + 25;
			
			if (config.loaded.slider && config.loaded.timenav) {
				hideMessege();
			}
		}
		
		function onTimeNavLoaded(e) {
			config.loaded.timenav = true;
			onComponentLoaded();
		}
		
		function onSlideUpdate(e) {
			is_moving = true;
			config.current_slide = slider.getCurrentNumber();
			setHash(config.current_slide);
			timenav.setMarker(config.current_slide, config.ease,config.duration);
		};
		
		function onMarkerUpdate(e) {
			is_moving = true;
			config.current_slide = timenav.getCurrentNumber();
			setHash(config.current_slide);
			slider.setSlide(config.current_slide);
		};
		
		var goToEvent = function(n) {
			if (n <= _dates.length - 1 && n >= 0) {
				config.current_slide = n;
				slider.setSlide(config.current_slide);
				timenav.setMarker(config.current_slide, config.ease,config.duration);
			} 
		}
		
		function setHash(n) {
			if (config.hash_bookmark) {
				window.location.hash = "#" + n.toString();
			}
		}
		
		/* PUBLIC FUNCTIONS
		================================================== */
		this.init = function(_data, _timeline_id, conf) {
			
			if (type.of(_timeline_id) == "string") {
				if (_timeline_id.match("#")) {
					timeline_id = _timeline_id;
				} else {
					timeline_id = "#" + _timeline_id;
				}
			}
			
			createConfig(conf);
			createStructure(w,h);
			
			trace('TIMELINE INIT');
			VMM.Date.setLanguage(VMM.Timeline.Config.language);
			VMM.master_config.language = VMM.Timeline.Config.language;
			
			$feedback = VMM.appendAndGetElement($timeline, "<div>", "feedback", "");
			
			// EVENTS
			VMM.bindEvent(global, onDataReady, config.events.data_ready);
			VMM.bindEvent(global, showMessege, config.events.messege);
			
			VMM.fireEvent(global, config.events.messege, VMM.master_config.language.messages.loading_timeline);
			
			/* GET DATA
			================================================== */
			if (VMM.Browser.browser == "Explorer" || VMM.Browser.browser == "MSIE") {
				if ( parseInt(VMM.Browser.version, 10) <= 7 ) {
					ie7 = true;
				}
			}
			
			if (type.of(_data) == "string" || type.of(_data) == "object") {
				VMM.Timeline.DataObj.getData(_data);
			} else {
				VMM.Timeline.DataObj.getData(VMM.getElement(timeline_id));
			}
			
			
		};
		
		this.iframeLoaded = function() {
			trace("iframeLoaded");
		};
		
		this.reload = function(_d) {
			trace("loadNewDates" + _d);
			VMM.fireEvent(global, config.events.messege, VMM.master_config.language.messages.loading_timeline);
			data = {};
			VMM.Timeline.DataObj.getData(_d);
		};
		
		/* DATA 
		================================================== */
		var getData = function(url) {
			VMM.getJSON(url, function(d) {
				data = VMM.Timeline.DataObj.getData(d);
				VMM.fireEvent(global, config.events.data_ready);
			});
		};
		
		/* MESSEGES 
		================================================== */
		
		var showMessege = function(e, msg) {
			trace("showMessege " + msg);
			//VMM.attachElement($messege, msg);
			VMM.attachElement($feedback, VMM.MediaElement.loadingmessage(msg)); 
		};
		
		var hideMessege = function() {
			VMM.Lib.animate($feedback, config.duration, config.ease*4, {"opacity": 0}, detachMessege);
		};
		
		var detachMessege = function() {
			VMM.Lib.detach($feedback);
		}
		
		/* BUILD DISPLAY
		================================================== */
		var build = function() {
			
			// START AT SLIDE
			if (parseInt(config.start_at_slide) > 0 && config.current_slide == 0) {
				config.current_slide = parseInt(config.start_at_slide); 
			}
			// START AT END
			if (config.start_at_end && config.current_slide == 0) {
				config.current_slide = _dates.length - 1;
			}
			
			
			// IE7
			if (ie7) {
				ie7 = true;
				VMM.fireEvent(global, config.events.messege, "Internet Explorer " + VMM.Browser.version + " is not supported by TimelineJS. Please update your browser to version 8 or higher.");
			} else {
				// CREATE DOM STRUCTURE
				VMM.attachElement($timeline, "");
				VMM.appendElement($timeline, "<div class='container main'><div class='feature'><div class='slider'></div></div><div class='navigation'></div></div>");
			
				reSize();
			
				VMM.bindEvent("div.slider", onSliderLoaded, "LOADED");
				VMM.bindEvent("div.navigation", onTimeNavLoaded, "LOADED");
				VMM.bindEvent("div.slider", onSlideUpdate, "UPDATE");
				VMM.bindEvent("div.navigation", onMarkerUpdate, "UPDATE");
			
				slider.init(_dates);
				timenav.init(_dates, data.era);
			
				// RESIZE EVENT LISTENERS
				VMM.bindEvent(global, reSize, config.events.resize);
				//VMM.bindEvent(global, function(e) {e.preventDefault()}, "touchmove");
				
			}
			
			
		};
		
		var ie7Build = function() {
			trace("IE7 or lower");
			for(var i = 0; i < _dates.length; i++) {
				trace(_dates[i]);
				/*
				var st	= VMM.Date.prettyDate(data.startdate);
				var en	= VMM.Date.prettyDate(data.enddate);
				var tag	= "";
				if (data.tag != null && data.tag != "") {
					tag		= VMM.createElement("span", data.tag, "slide-tag");
				}
						
				if (st != en) {
					c.text += VMM.createElement("h2", st + " &mdash; " + en + tag, "date");
				} else {
					c.text += VMM.createElement("h2", st + tag, "date");
				}
				*/
				
			}
		};
		
		var updateSize = function() {
			trace("UPDATE SIZE");
			config.width = VMM.Lib.width($timeline);
			config.height = VMM.Lib.height($timeline);
			
			config.nav.width = config.width;
			config.feature.width = config.width;
			
			if (VMM.Browser.device == "mobile") {
				//config.feature.height = config.height;
			} else {
				//config.feature.height = config.height - config.nav.height - 3;
			}
			config.feature.height = config.height - config.nav.height - 3;
		};
		
		// BUILD DATE OBJECTS
		var buildDates = function() {
			
			_dates = [];
			VMM.fireEvent(global, config.events.messege, "Building Dates");
			updateSize();
			
			for(var i = 0; i < data.date.length; i++) {
				
				if (data.date[i].startDate != null && data.date[i].startDate != "") {
					
					var _date = {};
					
					// START DATE
					if (data.date[i].type == "tweets") {
						_date.startdate = VMM.ExternalAPI.twitter.parseTwitterDate(data.date[i].startDate);
					} else {
						_date.startdate = VMM.Date.parse(data.date[i].startDate);
					}
					
					if (!isNaN(_date.startdate)) {
						
					
						// END DATE
						if (data.date[i].endDate != null && data.date[i].endDate != "") {
							if (data.date[i].type == "tweets") {
								_date.enddate = VMM.ExternalAPI.twitter.parseTwitterDate(data.date[i].endDate);
							} else {
								_date.enddate = VMM.Date.parse(data.date[i].endDate);
							}
						} else {
							_date.enddate = _date.startdate;
						}
						
						_date.needs_slug = false;
						
						if (data.date[i].headline == "") {
							if (data.date[i].slug != null && data.date[i].slug != "") {
								_date.needs_slug = true;
							}
						}
					
						_date.title				= data.date[i].headline;
						_date.headline			= data.date[i].headline;
						_date.type				= data.date[i].type;
						_date.date				= VMM.Date.prettyDate(_date.startdate);
						_date.asset				= data.date[i].asset;
						_date.fulldate			= _date.startdate.getTime();
						_date.text				= data.date[i].text;
						_date.content			= "";
						_date.tag				= data.date[i].tag;
						_date.slug				= data.date[i].slug;
						_date.uniqueid			= VMM.Util.unique_ID(7);
						
						_dates.push(_date);
					} 
					
				}
				
			};
			
			/* CUSTOM SORT
			================================================== */
			if (data.type != "storify") {
				_dates.sort(function(a, b){
					return a.fulldate - b.fulldate
				});
			}
			
			/* CREATE START PAGE IF AVAILABLE
			================================================== */
			if (data.headline != null && data.headline != "" && data.text != null && data.text != "") {
				trace("HAS STARTPAGE");
				var _date = {}, td_num = 0, td;
				
				td = _dates[0].startdate;
				_date.startdate = new Date(_dates[0].startdate);
				
				if (td.getMonth() === 0 && td.getDate() == 1 && td.getHours() === 0 && td.getMinutes() === 0 ) {
					// trace("YEAR ONLY");
					_date.startdate.setFullYear(td.getFullYear() - 1);
				} else if (td.getDate() <= 1 && td.getHours() === 0 && td.getMinutes() === 0) {
					// trace("YEAR MONTH");
					_date.startdate.setMonth(td.getMonth() - 1);
				} else if (td.getHours() === 0 && td.getMinutes() === 0) {
					// trace("YEAR MONTH DAY");
					_date.startdate.setDate(td.getDate() - 1);
				} else  if (td.getMinutes() === 0) {
					// trace("YEAR MONTH DAY HOUR");
					_date.startdate.setHours(td.getHours() - 1);
				} else {
					// trace("YEAR MONTH DAY HOUR MINUTE");
					_date.startdate.setMinutes(td.getMinutes() - 1);
				}
				
				_date.uniqueid		= VMM.Util.unique_ID(7);
				_date.enddate		= _date.startdate;
				_date.title			= data.headline;
				_date.headline		= data.headline;
				_date.text			= data.text;
				_date.type			= "start";
				_date.date			= VMM.Date.prettyDate(data.startDate);
				_date.asset			= data.asset;
				_date.slug			= false;
				_date.needs_slug	= false;
				_date.fulldate		= _date.startdate.getTime();
				
				if (config.embed) {
					VMM.fireEvent(global, config.events.headline, _date.headline);
				}
				
				_dates.unshift(_date);
			}
			
			/* CUSTOM SORT
			================================================== */
			if (data.type != "storify") {
				_dates.sort(function(a, b){
					return a.fulldate - b.fulldate
				});
			}
			
			onDatesProcessed();
		}
		
	};

	VMM.Timeline.Config = {};
	
};