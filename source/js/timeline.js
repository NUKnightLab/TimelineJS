/*!
	Open Timeline 0.89
	Designed and built by Zach Wise digitalartwork.net
	Date: April 8, 2012

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

/*!
	TODO
	-	
	-	
	FUTURE PLANS
	-	Better iPhone usability
	-	Support feeds from popular sources
	-	Storify integration
	-	Code optimization
	-	Possible tagging of events (depends on usability factors)
	
*/

/* 	CodeKit Import
	http://incident57.com/codekit/
================================================== */

// @codekit-prepend "VMM.js";
// @codekit-prepend "VMM.Core.js";
// @codekit-prepend "VMM.Util.js";
// @codekit-prepend "VMM.LoadLib.js";
// @codekit-prepend "bootstrap-tooltip.js";
// @codekit-prepend "AES.js";

/* Open Timeline Class contained in VMM (verite) namespace
================================================== */

if(typeof VMM != 'undefined' && typeof VMM.Timeline == 'undefined') {
	
	
	
	VMM.Timeline = function(w, h, conf) {
		var version = "0.89";
		trace("OPEN TIMELINE VERSION " + version);
		
		var $timeline = VMM.getElement("#timeline"); // expecting name only for parent
		var $feedback;
		var $messege;
		
		var html_string = VMM.getElement("#timeline");
		
		/* CREATE DOM STRUCTURE
		================================================== */
		//VMM.attachElement($timeline, "");
		
		$feedback = VMM.appendAndGetElement($timeline, "<div>", "feedback", "");
		$messege = VMM.appendAndGetElement($feedback, "<div>", "messege", "Loading Timeline");
		
		//VMM.appendElement($timeline, "<div class='container main'><div class='feature'><div class='slider'></div></div><div class='navigation'></div></div>");
		
		
		/* CREATE COMPONENTS
		================================================== */
		// SLIDER
		var slider = new VMM.Slider("div.slider", 720, 400, true);

		// TIMENAV
		var timenav = new VMM.Timeline.TimeNav("div.navigation", 720, 400, true);
		
		/* PRIVATE VARS
		================================================== */
		var _private_var = 'private';
		var events = {}; // CUSTOM EVENT HOLDER
		var data = {}; // HOLDS DATA
		var _dates = []; // HOLDES PROCESSED DATES
		
		/* CONFIG
		================================================== */
		var config = VMM.Timeline.Config;
		VMM.master_config.Timeline = VMM.Timeline.Config;
		
		/* 	MAP TYPE
			options include 
			Stamen Maps		"toner", "watercolor", "sterrain", "toner-lines", "toner-labels" 
			Apple			"apple" 
			Google			"HYBRID", "ROADMAP", "SATELLITE", "TERRAIN"
		================================================== */
		config.maptype = "toner";
		config.interval = 10;
		config.something = 0;
		config.width = 960;
		config.height = 540;
		config.spacing = 15;
		config.loaded = {slider: false, timenav: false, percentloaded:0};
		config.ease = "easeInOutExpo";
		config.duration = 1000;
		
		if (w != null && w != "") {
			config.width = w;
			VMM.Element.width($timeline, w);
		} else {
			config.width = VMM.Element.width($timeline);
		}
		
		if (h != null && h != "") {
			config.height = h;
			VMM.Element.height($timeline, h);
		} else {
			config.height = VMM.Element.height($timeline);
		}
		
		config.nav_width = config.width;
		config.nav_height = 200;
		config.feature_width = config.width;
		
		if (VMM.Browser.device == "mobile") {
			config.feature_height = config.height;
		} else {
			config.feature_height = config.height - config.nav_height;
		}
		
		/* APPLY SUPPLIED CONFIG TO TIMELINE CONFIG
		================================================== */
		
		if (typeof timeline_config == 'object') {
			trace("HAS TIMELINE CONFIG");
		    var x;
			for (x in timeline_config) {
				if (Object.prototype.hasOwnProperty.call(timeline_config, x)) {
					config[x] = timeline_config[x];
				}
			}
		} else if (typeof conf == 'object') {
			var x;
			for (x in conf) {
				if (Object.prototype.hasOwnProperty.call(conf, x)) {
					config[x] = conf[x];
				}
			}
		}
		
		/* CHECK FOR IE7
		================================================== */
		var ie7 = false;
		if (VMM.Browser.browser == "MSIE") {
			if ( parseInt(VMM.Browser.version, 10) == 7) {
				ie7 = true;
			}
		}
		
		
		/* ON EVENT
		================================================== */

		function onDataReady(e, d) {
			
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
			slider.setSize(config.feature_width, config.feature_height);
			timenav.setSize(config.width, config.height);
			resizeSlides();
		};
		
		function onSliderLoaded(e) {
			config.loaded.slider = true;
			onComponentLoaded();
		};
		
		function onComponentLoaded(e) {
			config.loaded.percentloaded = config.loaded.percentloaded + 25;
			showMessege("Loading Timeline " + config.loaded.percentloaded);
			if (config.loaded.slider && config.loaded.timenav) {
				hideMessege();
			}
		}
		
		function onTimeNavLoaded(e) {
			config.loaded.timenav = true;
			onComponentLoaded();
		}
		
		function onSlideUpdate(e) {
			timenav.setMarker(slider.getCurrentNumber(), config.ease,config.duration);
		};
		
		function onMarkerUpdate(e) {
			slider.setSlide(timenav.getCurrentNumber());
		};
		
		/* PUBLIC FUNCTIONS
		================================================== */
		this.init = function(d) {
			
			trace('init');
			
			VMM.bindEvent(global, onDataReady, "DATAREADY");
			
			/* GET DATA
			================================================== */
			if (ie7) {
				$feedback = VMM.appendAndGetElement($timeline, "<div>", "feedback", "");
				$messege = VMM.appendAndGetElement($feedback, "<div>", "messege", "Internet Explorer 7 is not supported by Timeline.");
			} else {
				if (type.of(d) == "string") {
					VMM.Timeline.DataObj.getData(d);
				} else {
					VMM.Timeline.DataObj.getData(html_string);
					//VMM.attachElement(element, content);
				}

				//VMM.attachElement($timeline, "");

				$feedback = VMM.appendAndGetElement($timeline, "<div>", "feedback", "");
				$messege = VMM.appendAndGetElement($feedback, "<div>", "messege", "Loading Timeline");
			}
			
			
		};
		
		this.iframeLoaded = function() {
			trace("iframeLoaded");
		};
		
		/* DATA 
		================================================== */
		var getData = function(url) {
			VMM.getJSON(url, function(d) {
				data = VMM.Timeline.DataObj.getData(d);
				VMM.fireEvent(global, "DATAREADY");
			});
		};
		
		/* MESSEGES 
		================================================== */
		var showMessege = function(msg) {
			//VMM.Element.append($timeline, $feedback);
			//VMM.attachElement($messege, msg);
			
			//VMM.Element.animate($feedback, config.duration, config.ease, {"opacity": 1});
			
		};
		//VMM.Element.animate(element, duration, ease, att, callback_function);
		var hideMessege = function() {
			
			VMM.Element.animate($feedback, config.duration, config.ease*4, {"opacity": 0}, detachMessege);
			
		};
		
		var detachMessege = function() {
			VMM.Element.detach($feedback);
		}
		
		/* BUILD DISPLAY
		================================================== */
		var build = function() {
			
			/* CREATE DOM STRUCTURE
			================================================== */
			VMM.attachElement($timeline, "");
			VMM.appendElement($timeline, "<div class='container main'><div class='feature'><div class='slider'></div></div><div class='navigation'></div></div>");
			
			reSize();
			
			/* INIT THE OBJECTS
			================================================== */
			VMM.bindEvent("div.slider", onSliderLoaded, "LOADED");
			VMM.bindEvent("div.navigation", onTimeNavLoaded, "LOADED");
			VMM.bindEvent("div.slider", onSlideUpdate, "UPDATE");
			VMM.bindEvent("div.navigation", onMarkerUpdate, "UPDATE");
			
			
			slider.init(_dates);
			timenav.init(_dates, data.era);
			
			
			/* RESIZE EVENT LISTENERS
			================================================== */
			VMM.bindEvent(global, reSize, "resize");
			VMM.bindEvent(global, function(e) {e.preventDefault()}, "touchmove");
			
		};
		
		// BUILD SLIDE CONTENT	pass in json object
		var buildSlide = function(dd, d_date) {
			updateSize();
			var d = dd;
			var slide = "";
			
			var c = {};
			c._text = "";
			c._media = "";
			
			var _valid = false;
			var _hasmedia = false;
			var _hastext = false;
			// NEEDS DATE IN ORDER TO USE
			// TEXT
			//if (d_date != null && d_date != "") {
			if (type.of(d_date) == "date") {
				_valid = true;
				if (dd.type == "start") {
					
				} else {
					c._text += VMM.createElement("h2", VMM.Util.date.prettyDate(d_date), "date");
				}
				//c._text += VMM.createElement("h2", d.strDate, "date");
				
				if (d.headline != null && d.headline != "") {
					if (d.type == "tweets") {
						
					} else if (dd.type == "start") {
						c._text += VMM.createElement("h2", VMM.Util.linkify_with_twitter(d.headline, "_blank"), "start");
					} else {
						c._text += VMM.createElement("h3", VMM.Util.linkify_with_twitter(d.headline, "_blank"));
					}
				}
				if (d.text != null && d.text != "") {
					_hastext = true;
					c._text += VMM.createElement("p", VMM.Util.linkify_with_twitter(d.text, "_blank"));
				}
				
				c._text = VMM.createElement("div", c._text, "container");
				c._text = VMM.createElement("div", c._text, "text");
				
				//trace(c._text);
			}
			
			// MEDIA
			if (_valid) {
				
				if (d.asset != null && d.asset != "") {
					
					if (d.asset.media != null && d.asset.media != "") {
						_hasmedia = true;
						c._media = VMM.MediaElement.create("", d.asset, true, config.feature_width, config.feature_height);
					}
					
				}
				
			}
			
			if (_valid) {
				var _layout_class = "content-container layout";
				
				if (_hastext) {
					_layout_class += "-text"
				}
				if (_hasmedia) {
					_layout_class += "-media";
				} 
				//c._media = VMM.createElement("div", c._media, "media-wrapper");
				
				slide = VMM.createElement("div", c._text + c._media, _layout_class);
				
				
				
				//trace(slide);

			}
			return slide;
		}
		
		var updateSize = function() {
			config.width = VMM.Element.width($timeline);
			config.height = VMM.Element.height($timeline);
			
			config.nav_width = config.width;
			config.feature_width = config.width;
			
			if (VMM.Browser.device == "mobile") {
				config.feature_height = config.height;
			} else {
				config.feature_height = config.height - config.nav_height - 3;
			}
		};
		
		var resizeSlides = function() {
			
			/* CHECK FOR MOBILE 
			================================================== */
			if (config.width < 500) {
				// MOBILE
				VMM.Element.hide("div.navigation");
				VMM.Element.hide("div.nav-next");
				VMM.Element.hide("div.nav-previous");
				//VMM.Element.css(".slider-item .content", "max-width", "100%");
				//VMM.Element.width(".slider-item .content", "90%");
				VMM.Element.height(".slider-container-mask", config.height);
			} else {
				// DESKTOP OR TABLET
				VMM.Element.show("div.navigation");
				VMM.Element.show("div.nav-next");
				VMM.Element.show("div.nav-previous");
				VMM.Element.height(".slider-container-mask", config.feature_height);
			}
			/* CHECK FOR TABLET
			================================================== */
			if (config.width < 820) {
				// TABLET OR MOBILE
				//VMM.Element.width(".slider-item .media", "100%");
				//VMM.Element.width(".slider-item .text", "100%");
				//VMM.Element.css(".slider-item .container", "max-width", "100%");
				//VMM.Element.width(".slider-item .media .media-container .media-frame", (config.feature_width - config.spacing) );
				//VMM.Element.css(".slider-item .media .media-container", "margin-bottom", 5);
				
				if (config.width < 500) {
					// MOBILE
					//VMM.Element.height(".slider-item .media", Math.round(config.height/1.5));
					//VMM.Element.css(".slider-item .media .media-container", "max-height", Math.round(config.height/1.5) - 50);
					//VMM.Element.height(".slider-item .media .media-container .media-frame", Math.round(config.height/1.5) - 60);
					
				} else {
					// TABLET
					//VMM.Element.height(".slider-item .media", Math.round(config.feature_height/1.5));
					//VMM.Element.css(".slider-item .media .media-container", "max-height", Math.round(config.feature_height/1.5) - 50);
					//VMM.Element.height(".slider-item .media .media-container .media-frame", Math.round(config.feature_height/1.5) - 60);
				}
				
			} else {
				// DESKTOP
				//VMM.Element.width(".slider-item .layout-media .media", "100%");
				
				//VMM.Element.width(".slider-item .layout-text-media .media", "75%");
				//VMM.Element.width(".slider-item .layout-text-media .text", "25%");
				
				//VMM.Element.width(".slider-item .layout-text .text", "100%");
				
				//VMM.Element.css(".slider-item .layout-text-media .container", "max-width", 200);
				
				//VMM.Element.height(".slider-item .media", config.feature_height);
				//VMM.Element.height(".slider-item .layout-text-media .media .media-container .media-frame", config.feature_height - 60);
				//VMM.Element.height(".slider-item .layout-media .media .media-container .media-frame", config.feature_height - 160);
				//VMM.Element.width(".slider-item .media .media-container .media-frame", Math.round(((config.feature_width/4) * 3) - config.spacing) );

				//VMM.Element.css(".slider-item .media .media-container", "max-height", config.feature_height- 50);
				//VMM.Element.css(".slider-item .media .media-container", "margin-bottom", 5);
			}
			
		};
		
		// BUILD DATE OBJECTS
		var buildDates = function() {
			
			updateSize();
			
			/* CREATE START PAGE IF AVAILABLE
			================================================== */
			if (data.headline != null && data.headline != "" && data.text != null && data.text != "") {
				trace("HAS STARTPAGE");
				var _date = {};
				if (data.type == "google spreadsheet") {
					trace("google spreadsheet startpage date" + data.startDate);
					_date.startdate = new Date(Date.parse(data.startDate));
					trace(_date.startdate);
				} else {
					_date.startdate = VMM.Util.parseDate(data.startDate);
				}
				_date.uniqueid = VMM.Util.unique_ID(5);
				_date.enddate = _date.startdate;
				_date.title = data.headline;
				_date.headline = data.headline;
				_date.text = data.text;
				_date.type = "start";
				_date.date = VMM.Util.date.prettyDate(data.startDate);
				_date.asset = data.asset;
				_date.fulldate = _date.startdate.getTime();
				_date.content = buildSlide(_date, _date.startdate);
				if (_date.content != null && _date.content != "") {
					_dates.push(_date);
				}
			}
			
			for(var i = 0; i < data.date.length; i++) {
				
				if (data.date[i].startDate != null && data.date[i].startDate != "") {
					
					var _date = {};
					// START DATE
					
					if (data.date[i].type == "tweets") {
						_date.startdate = VMM.ExternalAPI.twitter.parseTwitterDate(data.date[i].startDate);
					} else if (data.date[i].type == "google spreadsheet") {
						_date.startdate = new Date(Date.parse(data.date[i].startDate));
						trace(_date.startdate);
					} else {
						_date.startdate = VMM.Util.parseDate(data.date[i].startDate);
					}
					
					_date.uniqueid = (data.date[i].startDate).toString() + "-" + i.toString();
					
					// END DATE
					if (data.date[i].endDate != null && data.date[i].endDate != "") {
						if (data.date[i].type == "tweets") {
							_date.enddate = VMM.ExternalAPI.twitter.parseTwitterDate(data.date[i].endDate);
						} else if (data.date[i].type == "google spreadsheet") {
							_date.enddate = new Date(Date.parse(data.date[i].endDate));
						} else {
							_date.enddate = VMM.Util.parseDate(data.date[i].endDate);
						}
					} else {
						_date.enddate = _date.startdate;
					}
					
					// TITLE
					_date.title = data.date[i].headline;
					_date.type = data.date[i].type;
					
					// DATE
					_date.date = VMM.Util.date.prettyDate(_date.startdate);
					
					// ASSET
					_date.asset = data.date[i].asset;
					
					/* NEED FULL FRACTIONAL DATE
					================================================== */

					_date.fulldate = _date.startdate.getTime();
					// BUILD SLIDE CONTENT
					// Won't be added unless there is content
					_date.content = buildSlide(data.date[i], _date.startdate);
					
					if (_date.content != null && _date.content != "") {
						_dates.push(_date);
					}
					
				}
				
					
			};
			
			/* CUSTOM SORT
			================================================== */
			//VMM.Util.customSort(a,b);
			/*
			for(var j = 0; j < _dates.length; j++) {
				trace(_dates[j].startdate);
			}
			trace("============================");
			*/
			//_dates.reverse(VMM.Util.customSort(_dates.fulldate,_dates.fulldate));
			_dates.sort(function(a, b){
				return a.fulldate - b.fulldate
			});
			//_dates.reverse()
			/*
			for(var k = 0; k < _dates.length; k++) {
				trace(_dates[k].startdate);
			}
			*/
			

			onDatesProcessed();
		}
		
	};


	VMM.Timeline.TimeNav = function(parent, content_width, content_height) {
		trace("VMM.Timeline.TimeNav");
		
		var events = {}; // CUSTOM EVENT HOLDER
		var data = []; // HOLDS DATA
		var eras;
		var era_markers = [];
		var markers = []; // HOLDS MARKER DOM OBJECTS
		var interval_array = [];
		var timespan = {};
		var current_marker = 0; // CURRENT MARKER
		var _active = false;
		
		var timelookup = {
			day: 24 ,
			month: 12,
			year: 10,
			hour: 60,
			minute: 60, 
			second: 1000,
			decade: 10,
			century: 100,
			millenium: 1000,
			week: 4.34812141,
			days_in_month: 30.4368499,
			days_in_week: 7,
			weeks_in_month:4.34812141,
			weeks_in_year:52.177457,
			days_in_year: 365.242199,
			hours_in_day: 24
		};
		
		var dateFractionBrowser = {
			day: 86400000 ,
			week: 7,
			month: 30.4166666667,
			year: 12,
			hour: 24,
			minute: 1440, 
			second: 86400,
			decade: 10,
			century: 100,
			millenium: 1000
		}
		
		// somestring = VMM.Util.date.month[2]; // Returns March
		// somestring = VMM.Util.date.month_abbrev[1]; // Returns Feb.
		
		var interval = {
			type: "year",
			number: 10,
			first: 1970,
			last: 2011,
			multiplier: 100
		};
		
		var interval_major = {
			type: "year",
			number: 10,
			first: 1970,
			last: 2011,
			multiplier: 100
		};
		
		var interval_calc = {
			day: {} ,
			month: {},
			year: {},
			hour: {},
			minute: {}, 
			second: {},
			decade: {},
			century: {},
			millenium: {},
			week: {}
		};
		
		/* ADD to Config
		================================================== */
		var config = VMM.Timeline.Config;
		config.something = 0;
		config.nav_width = 100;
		config.nav_height = 200;
		config.timeline = false;
		config.marker_width = 150;
		config.marker_height = 48;
		config.density = 2;
		config.timeline_width = 900;
		config.interval_width = 200;
		config.rows = [1, 1, 1];
		config.multiplier = 6;
		config.max_multiplier = 16;
		config.min_multiplier = 1;
		config.has_start_page = false;
		
		config.rows = [config.marker_height, config.marker_height*2, 1];
		
		if (content_width != null && content_width != "") {
			config.width = content_width;
		} 
		if (content_height != null && content_height != "") {
			config.height = content_height;
		} 
		
		var content = "";
		var _active = false;
		
		/* ELEMENTS
		================================================== */
		var $timenav = "";
		//var $timenav_container_mask = "";
		//var $timenav_container = "";
		
		var $content = "";
		var $time = "";
		var $timeintervalminor = "";
		var $timeinterval = "";
		var $timeintervalmajor = "";
		var $timebackground = "";
		var $timeintervalbackground = "";
		var $timenavline = "";
		var $timeintervalminor_minor = "";
		var $toolbar = "";
		var $zoomin = "";
		var $zoomout = "";
		
		var navigation = {};
		// Nav Items
		navigation.nextBtn;
		navigation.prevBtn;
		navigation.nextDate;
		navigation.prevDate;
		navigation.nextTitle;
		navigation.prevTitle;
		
		/* PUBLIC VARS
		================================================== */
		this.ver = "0.1";
		var layout = parent; // expecting slider div
		
		
		/* PUBLIC FUNCTIONS
		================================================== */
		this.init = function(d,e) {
			trace('VMM.Timeline.TimeNav init');
			// need to evaluate d
			// some function to determine type of data and prepare it
			if(typeof d != 'undefined') {
				this.setData(d, e);
			} else {
				trace("WAITING ON DATA");
			}
		};
		
		/* GETTERS AND SETTERS
		================================================== */
		this.setData = function(d,e) {
			if(typeof d != 'undefined') {
				data = d;
				eras = e;
				build();
			} else{
				trace("NO DATA");
			}
		};
		
		this.setSize = function(w, h) {
			if (w != null) {config.width = w};
			if (h != null) {config.height = h};
			if (_active) {
				reSize();
			}

			
		}
		
		this.setMarker = function(n, ease, duration, fast) {
			goToMarker(n, ease, duration);
		}
		
		this.getCurrentNumber = function() {
			return current_marker;
		}
		
		/* ON EVENT
		================================================== */
		
		function onConfigSet() {
			trace("onConfigSet");
		};
		
		function reSize(firstrun) {
			VMM.Element.css($timenavline, "left", Math.round(config.width/2)+2);
			//VMM.Element.css($toolbar, "left", Math.round(config.width/2)-19);
			
			goToMarker(current_marker, config.ease, config.duration, true, firstrun);
		};
		
		function upDate() {
			VMM.fireEvent(layout, "UPDATE");
		}
		
		function onZoomIn() {
			trace("CLICK");
			VMM.DragSlider.cancelSlide();
			if (config.multiplier > config.min_multiplier) {
				config.multiplier = config.multiplier - 1;
				if (config.multiplier < 0) {
					config.multiplier = config.min_multiplier;
				}
				refreshTimeline();
			}
		}
		

		
		function onZoomOut() {
			trace("CLICK");
			VMM.DragSlider.cancelSlide();
			if (config.multiplier < config.max_multiplier) {
				config.multiplier = config.multiplier + 1;
				if (config.multiplier == config.max_multiplier) {
					
				}
				refreshTimeline();
			}
		}
		
		
		function onBackHome(e) {
			VMM.DragSlider.cancelSlide();
			goToMarker(0);
			upDate();
		}
		/* MARKER EVENTS
		================================================== */
		function onMarkerClick(e) {
			VMM.DragSlider.cancelSlide();
			goToMarker(e.data.number);
			upDate();
		};
		
		function onMarkerHover(e) {
			VMM.Element.toggleClass(e.data.elem, "zFront");
			
		};
		
		/* TOUCH EVENTS
		================================================== */
		function onTouchUpdate(e, b) {
			VMM.Element.animate($timenav, b.time/2, config.ease, {"left": b.left});
			
			
		};
		
		/* NAVIGATION
		================================================== */
		var buildMarkers = function() {
			
			var row = 2; //row
			var lpos = 0; // last marker pos;
			var row_depth = 0;
			
			for(var i = 0; i < data.length; i++) {
				
				var bw = "";
				var _marker;
				var _marker_flag;
				var _marker_content;
				
				var _marker_dot;
				var _marker_line;
				var _marker_line_event;
				
				/* CREATE ELEMENTS
				================================================== */
				_marker = VMM.appendAndGetElement($content, "<div>", "marker");
				_marker_flag = VMM.appendAndGetElement(_marker, "<div>", "flag");
				_marker_content = VMM.appendAndGetElement(_marker_flag, "<div>", "flag-content");
				_marker_dot = VMM.appendAndGetElement(_marker, "<div>", "dot");
				_marker_line = VMM.appendAndGetElement(_marker, "<div>", "line");
				_marker_line_event = VMM.appendAndGetElement(_marker_line, "<div>", "event-line");
				
				
				/* CREATE THUMBNAIL
				================================================== */
				if (data[i].asset != null && data[i].asset != "") {
					VMM.appendElement(_marker_content, VMM.MediaElement.thumbnail(data[i].asset, 32, 32));
				}
				
				/* ADD DATE AND TITLE
				================================================== */
				VMM.appendElement(_marker_content, "<h3>" + VMM.Util.unlinkify(data[i].title) + "</h3><h4>" + data[i].date + "</h4>");
				
				/* ADD ID
				================================================== */
				VMM.Element.attr(_marker, "id", (data[i].uniqueid).toString());
				
				/* MARKER CLICK
				================================================== */
				VMM.bindEvent(_marker_flag, onMarkerClick, "", {number: i});
				VMM.bindEvent(_marker_flag, onMarkerHover, "mouseenter mouseleave", {number: i, elem:_marker_flag});

				

				/* ADD MARKER OBJ TO ARRAY FOR RETRIEVAL LATER
				================================================== */
				var _marker_obj = {
					marker: _marker,
					flag:_marker_flag,
					lineevent: _marker_line_event,
					type: "marker"
				};
				
				
				if (data[i].type == "start") {
					trace("BUILD MARKER HAS START PAGE")
					config.has_start_page = true;
					_marker_obj.type = "start";
				}
				
				markers.push(_marker_obj);
				
				
				
			}
			
			/* CREATE ERAS
			================================================== */
			for(var j = 0; j < eras.length; j++) {
				
				var bw = "";
				var era = {
					content:"",
					startdate:"",
					enddate:"",
					headline:"",
					uniqueid:"",
					color:""
				};
				
				era.title = eras[j].headline;
				era.uniqueid = VMM.Util.unique_ID(4);
				era.color = eras[j].color;
				/* CREATE ELEMENTS
				================================================== */
				era.content = VMM.appendAndGetElement($content, "<div>", "era");
				VMM.Element.attr(era.content, "id", era.uniqueid);
				VMM.Element.css(era.content, "background", era.color);
				/* ADD DATE AND TITLE
				================================================== */
				VMM.appendElement(era.content, "<h3>" + VMM.Util.unlinkify(era.title) + "</h3>");
				
				
				era.startdate = VMM.Util.parseDate(eras[j].startDate);
				era.enddate = VMM.Util.parseDate(eras[j].endDate);
				
				era_markers.push(era);
			}
			
			positionMarkers();
		}
		
		
		var positionOnTimeline = function(the_interval, first, last) {
			
			var _type = the_interval.type;
			var _multiplier = the_interval.multiplier;
			
			var _first = getDateFractions(first);
			var _last = getDateFractions(last);
			
			/* CALCULATE POSITION ON TIMELINE
			================================================== */
			var tsd = first.months;
			var ted = last.months;
			
			if (_type == "millenium") {
				tsd = first.milleniums;
				ted = last.milleniums;
			} else if (_type == "century") {
				tsd = _first.centuries;
				ted = _last.centuries;
			} else if (_type == "decade") {
				tsd = _first.decades;
				ted = _last.decades;
			} else if (_type == "year") {
				tsd = _first.years;
				ted = _last.years;
			} else if (_type == "month") {
				tsd = _first.months;
				ted = _last.months;
			} else if (_type == "week") {
				tsd = _first.weeks;
				ted = _last.weeks;
			} else if (_type == "day") {
				tsd = _first.days;
				ted = _last.days;
			} else if (_type == "hour") {
				tsd = _first.hours;
				ted = _last.hours;
			} else if (_type == "minute") {
				tsd = _first.minutes;
				ted = _last.minutes;
			}
			
			
			_pos = 		( tsd	 - 	interval.base	 ) * (config.interval_width		/	 config.multiplier);
			_pos_end = 	( ted	 - 	interval.base	 ) * (config.interval_width		/	 config.multiplier);
			
			return pos = {begin:_pos ,end:_pos_end};
			
		}

		var positionMarkers = function(is_animated) {
			
			var _type = interval.type;
			var _multiplier = interval.multiplier;
			
			// ROWS
			var row = 2; //row
			var lpos = 0; // last marker pos;
			var row_depth = 0;
			var _line_last_height_pos = 150;
			var _line_height = 6;
			
			var cur_mark = 0;
			
			VMM.Element.removeClass(".flag", "row1");
			VMM.Element.removeClass(".flag", "row2");
			VMM.Element.removeClass(".flag", "row3");
			
			for(var i = 0; i < markers.length; i++) {
				
				//var pos; // X POSITION OF BEGINNING OF EVENT
				var _line; // EVENT LENGTH
				//var _pos_end; // X POSITION OF END OF EVENT
				
				var _marker = markers[i].marker;
				var _marker_flag = markers[i].flag;
				var _marker_line_event = markers[i].lineevent;
				
				
				
				var _pos = positionOnTimeline(interval, data[i].startdate, data[i].enddate);
				
				
				pos = _pos.begin;
				_pos_end = _pos.end;
				
				/* COMPENSATE FOR DATES BEING POITIONED IN THE MIDDLE
				================================================== */
				var _pos_offset = -2;
				pos = Math.round(pos +  _pos_offset);
				_pos_end = Math.round(_pos_end + _pos_offset);
				_line = Math.round(_pos_end - pos);
				
				/* APPLY POSITION TO MARKER
				================================================== */
				if (is_animated) {
					VMM.Element.stop(_marker);
					VMM.Element.animate(_marker, config.duration/2, config.ease, {"left": pos});
				} else {
					VMM.Element.css(_marker, "left", pos);
				}
				if (i == current_marker) {
					cur_mark = pos;
					//trace("=========================== cur_mark " + cur_mark)
				}
				
				/* EVENT LENGTH LINE
				================================================== */
				if (_line > 5) {
					VMM.Element.css(_marker_line_event, "height", _line_height);
					VMM.Element.css(_marker_line_event, "width", _line);
					VMM.Element.css(_marker_line_event, "top", _line_last_height_pos);
					//_line_last_height_pos = _line_last_height_pos - _line_height;
				}
				
				/* CONTROL ROW POSITION
				================================================== */
				if (pos - lpos < (config.marker_width + config.spacing)) {
					if (row < config.rows.length - 1) {
						row ++;
						
					} else {
						row = 0;
						row_depth ++;
					}
				} else {
					row_depth = 0;
					row = 0;
				}
				
				/* SET LAST MARKER POSITION
				================================================== */
				lpos = pos;
				
				if (is_animated) {
					VMM.Element.stop(_marker_flag);
					VMM.Element.animate(_marker_flag, config.duration, config.ease, {"top": config.rows[row]});
				} else {
					VMM.Element.css(_marker_flag, "top", config.rows[row]);
				}
				
				/* IS THE MARKER A REPRESENTATION OF A START SCREEN?
				================================================== */
				if (config.has_start_page && markers[i].type == "start") {
					VMM.Element.visible(_marker, false);
				}
				
			}
			
			for(var j = 0; j < era_markers.length; j++) {
				//var pos; // X POSITION OF BEGINNING OF EVENT
				var _line; // EVENT LENGTH
				//var _pos_end; // X POSITION OF END OF EVENT
				
				var era = era_markers[j];
				var era_elem = era.content;
				var pos = positionOnTimeline(interval, era.startdate, era.enddate);
				var era_length = pos.end - pos.begin;
				var era_height = 25;
				
				/* APPLY POSITION TO MARKER
				================================================== */
				VMM.Element.css(era_elem, "left", pos.begin);
				VMM.Element.css(era_elem, "width", era_length);
			}
			
			
			/* ANIMATE THE TIMELINE TO ADJUST TO CHANGES
			================================================== */
			if (is_animated) {
				VMM.Element.stop($timenav);
				VMM.Element.animate($timenav, config.duration/2, config.ease, {"left": (config.width/2) - (cur_mark)});
			}

		
		}
		
		var getDateFractions = function(the_date, is_utc) {
			
			var _time = {};
			_time.days			= 		the_date / dateFractionBrowser.day;
			_time.weeks 		= 		_time.days / dateFractionBrowser.week;
			_time.months 		= 		_time.days / dateFractionBrowser.month;
			_time.years 		= 		_time.months / dateFractionBrowser.year;
			_time.hours 		= 		_time.days * dateFractionBrowser.hour;
			_time.minutes 		= 		_time.days * dateFractionBrowser.minute;
			_time.seconds 		= 		_time.days * dateFractionBrowser.second;
			_time.decades 		= 		_time.years / dateFractionBrowser.decade;
			_time.centuries 	= 		_time.years / dateFractionBrowser.century;
			_time.milleniums 	= 		_time.years / dateFractionBrowser.millenium;
			/*
			trace("MILLENIUMS "	 + 		_time.milleniums);
			trace("CENTURIES "	 + 		_time.centuries);
			trace("DECADES "	 + 		_time.decades);
			trace("YEARS "		 + 		_time.years);
			trace("MONTHS "		 + 		_time.months);
			trace("WEEKS "		 + 		_time.weeks);
			trace("DAYS "		 + 		_time.days);
			trace("HOURS "		 + 		_time.hours);
			trace("MINUTES "	 + 		_time.minutes);
			trace("SECONDS "	 + 		_time.seconds);
			*/
			return _time;
		}
		
		var calculateInterval = function() {
			
			var _first = getDateFractions(data[0].startdate);
			var _last = getDateFractions(data[data.length - 1].enddate);
			
			/* MILLENIUM
			================================================== */
			// NOT DONE
			interval_calc.millenium.type 			= "millenium";
			interval_calc.millenium.first 			= _first.milleniums;
			interval_calc.millenium.base 			= Math.floor(_first.milleniums);
			interval_calc.millenium.last 			= _last.milleniums;
			interval_calc.millenium.number 			= timespan.milleniums;
			interval_calc.millenium.multiplier	 	= timelookup.millenium;
			interval_calc.millenium.minor 			= timelookup.millenium;
			
			/* CENTURY
			================================================== */
			// NOT DONE
			interval_calc.century.type 				= "century";
			interval_calc.century.first 			= _first.centuries;
			interval_calc.century.base 				= Math.floor(_first.centuries);
			interval_calc.century.last 				= _last.centuries;
			interval_calc.century.number 			= timespan.centuries;
			interval_calc.century.multiplier	 	= timelookup.century;
			interval_calc.century.minor 			= timelookup.century;
			
			/* DECADE
			================================================== */
			interval_calc.decade.type 				= "decade";
			interval_calc.decade.first 				= _first.decades;
			interval_calc.decade.base 				= Math.floor(_first.decades);
			interval_calc.decade.last 				= _last.decades;
			interval_calc.decade.number 			= timespan.decades;
			interval_calc.decade.multiplier 		= timelookup.decade;
			interval_calc.decade.minor 				= timelookup.decade;
			
			/* YEAR
			================================================== */
			
			interval_calc.year.type					= "year";
			interval_calc.year.first 				= _first.years;
			interval_calc.year.base 				= Math.floor(_first.years);
			interval_calc.year.last					= _last.years;
			interval_calc.year.number 				= timespan.years;
			interval_calc.year.multiplier 			= 1;
			interval_calc.year.minor 				= timelookup.month;
			
			/* MONTH
			================================================== */
			interval_calc.month.type 				= "month";
			interval_calc.month.first 				= _first.months;
			interval_calc.month.base 				= Math.floor(_first.months);
			interval_calc.month.last 				= _last.months;
			interval_calc.month.number 				= timespan.months;
			interval_calc.month.multiplier 			= 1;
			interval_calc.month.minor 				= Math.round(timelookup.week);
			
			/* WEEK
			================================================== */
			// NOT DONE
			interval_calc.week.type 				= "week";
			
			interval_calc.week.first 				= _first.weeks;
			interval_calc.week.base 				= Math.floor(_first.weeks);
			interval_calc.week.last 				= _last.weeks;
			interval_calc.week.number 				= timespan.weeks;
			interval_calc.week.multiplier 			= 1;
			interval_calc.week.minor 				= 7;
			
			/* DAY
			================================================== */
			// NOT DONE
			interval_calc.day.type 					= "day";
			interval_calc.day.first 				= _first.days;
			interval_calc.day.base	 				= Math.floor(_first.days);
			interval_calc.day.last 					= _last.days;
			interval_calc.day.number 				= timespan.days;
			interval_calc.day.multiplier 			= 1;
			interval_calc.day.minor 				= 24;
			
			/* HOUR
			================================================== */
			// NOT DONE
			interval_calc.hour.type 				= "hour";
			interval_calc.hour.first 				= _first.hours;
			interval_calc.hour.base 				= Math.floor(_first.hours);
			interval_calc.hour.last 				= _last.hours;
			interval_calc.hour.number 				= timespan.hours;
			interval_calc.hour.multiplier 			= 1;
			interval_calc.hour.minor 				= 60;
			
			/* MINUTE
			================================================== */
			// NOT DONE
			interval_calc.minute.type 				= "minute";
			interval_calc.minute.first 				= _first.minutes;
			interval_calc.minute.base 				= Math.floor(_first.minutes);
			interval_calc.minute.last 				= _last.minutes;
			interval_calc.minute.number 			= timespan.minutes;
			interval_calc.minute.multiplier 		= 1;
			interval_calc.minute.minor 				= 60;
			
			/* SECOND
			================================================== */
			// NOT DONE
			interval_calc.second.type 				= "decade";
			interval_calc.second.first 				= _first.seconds;
			interval_calc.second.base 				= Math.floor(_first.seconds);
			interval_calc.second.last 				= _last.seconds;
			interval_calc.second.number 			= timespan.seconds;
			interval_calc.second.multiplier 		= 1;
			interval_calc.second.minor 				= 10;
		}
		
		var positionInterval = function() {
			
			VMM.attachElement($timeinterval, "");
			VMM.attachElement($timeintervalmajor, "");
			
			interval.date = new Date(data[0].startdate.getFullYear(), 0, 1, 0,0,0);
			interval_major.date = new Date(data[0].startdate.getFullYear(), 0, 1, 0,0,0);
			
			//interval.date_major_start = new Date(data[0].startdate.getFullYear(), 0, 1, 0,0,0);
			//interval.date_major_end = new Date(data[0].startdate.getFullYear(), 0, 1, 0,0,0);
			
			var inc_time = 0;
			var inc_time_major = 0;
			var _first_run = true;
			var _normal_first_pos = 0;
			var _last_pos = 0;
			var _last_pos_major = 0;
			
			for(var i = 0; i < interval.number + 1; i++) {
				
				var _idd;
				if (interval.type == "century") {
					if (_first_run) {
						interval.date.setFullYear(		Math.floor(data[0].startdate.getFullYear() / 100) * 100		);
					}
					interval.date.setFullYear(interval.date.getFullYear() + (inc_time * 100));
					_idd = Math.floor(interval.date.getFullYear() / 100) * 100;
				} else if (interval.type == "decade") {
					if (_first_run) {
						interval.date.setFullYear(		Math.floor(data[0].startdate.getFullYear() / 10) * 10		);
					}
					interval.date.setFullYear(interval.date.getFullYear() + (inc_time * 10));
					_idd = Math.floor(interval.date.getFullYear() / 10) * 10;
				} else if (interval.type == "year") {
					if (_first_run) {
						
					}
					interval.date.setFullYear(interval.date.getFullYear() + inc_time);
					//_idd = interval.date.getFullYear();
					_idd = VMM.Util.date.prettyDate(interval.date, true, interval.type);
				} else if (interval.type == "month") {
					if (_first_run) {
						interval.date.setMonth(data[0].startdate.getMonth());
					}
					interval.date.setMonth(interval.date.getMonth() + inc_time);
					//_idd = VMM.Util.date.month[interval.date.getMonth()] + ", " + interval.date.getFullYear() ;
					_idd = VMM.Util.date.prettyDate(interval.date, true, interval.type);
				} else if (interval.type == "week") {
					if (_first_run) {
						interval.date.setMonth(		data[0].startdate.getMonth()		);
						interval.date.setDate(		Math.floor(data[0].startdate.getDate() *7)			);
					}
					interval.date.setDate(interval.date.getDate() + (inc_time * 7) );
					_idd = VMM.Util.date.day_abbr[interval.date.getDay()] + " " + VMM.Util.date.month_abbr[interval.date.getMonth()] + " " + interval.date.getDate();
				} else if (interval.type == "day") {
					if (_first_run) {
						interval.date.setMonth(		data[0].startdate.getMonth()			);
						interval.date.setDate(		data[0].startdate.getDate()				);
					}
					interval.date.setDate(interval.date.getDate() + inc_time);
					_idd = VMM.Util.date.prettyDate(interval.date, true, interval.type);
					//_idd = VMM.Util.date.day_abbr[interval.date.getDay()] + " " +VMM.Util.date.month[interval.date.getMonth()] + " " + interval.date.getDate();
				} else if (interval.type == "hour") {
					if (_first_run) {
						interval.date.setMonth(		data[0].startdate.getMonth()			);
						interval.date.setDate(		data[0].startdate.getDate()				);
						interval.date.setHours(		data[0].startdate.getHours()			);
					}
					interval.date.setHours(interval.date.getHours() + inc_time);
					//_idd = VMM.Util.date.get12HRTime(interval.date, false); //interval.date.getHours() + ":00";
					_idd = VMM.Util.date.prettyDate(interval.date, true, interval.type);
				} else if (interval.type == "minute") {
					if (_first_run) {
						interval.date.setMonth(		data[0].startdate.getMonth()			);
						interval.date.setDate(		data[0].startdate.getDate()				);
						interval.date.setHours(		data[0].startdate.getHours()			);
						interval.date.setMinutes(	data[0].startdate.getMinutes()			);
					}
					interval.date.setMinutes(interval.date.getMinutes() + inc_time);
					//_idd = interval.date.getHours() + ":" + VMM.Util.doubledigit(interval.date.getMinutes());
					_idd = VMM.Util.date.prettyDate(interval.date, true, interval.type);
				} else if (interval.type == "second") {
					if (_first_run) {
						interval.date.setMonth(		data[0].startdate.getMonth()			);
						interval.date.setDate(		data[0].startdate.getDate()				);
						interval.date.setHours(		data[0].startdate.getHours()			);
						interval.date.setMinutes(	data[0].startdate.getMinutes()			);
						interval.date.setSeconds(	data[0].startdate.getSeconds()			);
					}
					interval.date.setSeconds(interval.date.getSeconds() + inc_time);
					//_idd = interval.date.getHours() + ":" + VMM.Util.doubledigit(interval.date.getMinutes()) + ":" + VMM.Util.doubledigit(interval.date.getSeconds());
					_idd = VMM.Util.date.prettyDate(interval.date, true, interval.type);
				}
				
				inc_time = 1;
				
				if (_first_run) {
					_normal_first_pos = pos; 
				}
				_first_run = false;
				
				var _pos = positionOnTimeline(interval, interval.date, interval.date);
				var pos = _pos.begin;
				
				$interval_date = VMM.appendAndGetElement($timeinterval, "<div>", "_idd");
				VMM.appendElement($interval_date, _idd);
				
				VMM.Element.css($interval_date, "left", pos);
				VMM.Element.css($interval_date, "text-indent", -(VMM.Element.width($interval_date)/2));
				
				if ((pos - _last_pos) < 65 ) {
					if ((pos - _last_pos) < 35 ) {
						if (i%4 == 0) {
							if (pos == 0) {
								VMM.Element.css($interval_date, "display", "none");
							} else {
								VMM.Element.css($interval_date, "display", "");
							}
							
						} else {
							VMM.Element.css($interval_date, "display", "none");
						}
					} else {
						if (VMM.Util.isEven(i)) {
							VMM.Element.css($interval_date, "display", "none");
						} else {
							VMM.Element.css($interval_date, "display", "");
						}
					}
					
				} else {
					VMM.Element.css($interval_date, "display", "");
				}
				
				_last_pos = pos;
			}
			
			_first_run = true;
			_major_first_pos = 0;
			_major_last_pos = 0;
			
			for(var i = 0; i < Math.ceil(interval_major.number) + 1; i++) {
				var _idd;
				
				if (interval_major.type == "century") {
					if (_first_run) {
						interval_major.date.setFullYear(		Math.floor(data[0].startdate.getFullYear() / 100) * 100		);
					}
					interval_major.date.setFullYear(interval_major.date.getFullYear() + (inc_time_major * 100));
					_idd = Math.floor(interval_major.date.getFullYear() / 100) * 100;
				} else if (interval_major.type == "decade") {
					if (_first_run) {
						interval_major.date.setFullYear(		Math.floor(data[0].startdate.getFullYear() / 10) * 10		);
					}
					interval_major.date.setFullYear(interval_major.date.getFullYear() + (inc_time_major * 10));
					_idd = Math.floor(interval_major.date.getFullYear() / 10) * 10;
				} else if (interval_major.type == "year") {
					if (_first_run) {

					}
					interval_major.date.setFullYear(interval_major.date.getFullYear() + inc_time_major);
					_idd = interval_major.date.getFullYear();
					//_idd = VMM.Util.date.prettyDate(interval_major.date, true, interval_major.type);
				} else if (interval_major.type == "month") {
					if (_first_run) {
						interval_major.date.setMonth(data[0].startdate.getMonth());
					}
					interval_major.date.setMonth(interval_major.date.getMonth() + inc_time_major);
					_idd = VMM.Util.date.month[interval_major.date.getMonth()] + " " + interval_major.date.getFullYear();
					//_idd = VMM.Util.date.prettyDate(interval_major.date, true, interval_major.type);
				} else if (interval_major.type == "week") {
					if (_first_run) {
						interval_major.date.setMonth(		data[0].startdate.getMonth()		);
						interval_major.date.setDate(		Math.floor(data[0].startdate.getDate() *7)			);
					}
					interval_major.date.setDate(interval_major.date.getDate() + (inc_time_major * 7) );
					_idd = VMM.Util.date.day_abbr[interval_major.date.getDay()] + " " + VMM.Util.date.month_abbr[interval_major.date.getMonth()] + " " + interval_major.date.getDate();
				} else if (interval_major.type == "day") {
					if (_first_run) {
						interval_major.date.setMonth(		data[0].startdate.getMonth()			);
						interval_major.date.setDate(		data[0].startdate.getDate()				);
					}
					interval_major.date.setDate(interval_major.date.getDate() + inc_time_major);
					//_idd = VMM.Util.date.prettyDate(interval_major.date, true, interval_major.type);
					//_idd = VMM.Util.date.day[interval_major.date.getDay()] + " " + VMM.Util.date.month_abbr[interval_major.date.getMonth()] + " " + interval_major.date.getDate();
					_idd = VMM.Util.date.prettyDate(interval_major.date, true, interval_major.type);
				} else if (interval_major.type == "hour") {
					if (_first_run) {
						interval_major.date.setMonth(		data[0].startdate.getMonth()			);
						interval_major.date.setDate(		data[0].startdate.getDate()				);
						interval_major.date.setHours(		data[0].startdate.getHours()			);
					}
					interval_major.date.setHours(interval_major.date.getHours() + inc_time_major);
					//_idd = VMM.Util.date.get12HRTime(interval_major.date, false); //interval_major.date.getHours() + ":00";
					_idd = VMM.Util.date.prettyDate(interval_major.date, true, interval_major.type);
				} else if (interval_major.type == "minute") {
					if (_first_run) {
						interval_major.date.setMonth(		data[0].startdate.getMonth()			);
						interval_major.date.setDate(		data[0].startdate.getDate()				);
						interval_major.date.setHours(		data[0].startdate.getHours()			);
						interval_major.date.setMinutes(		data[0].startdate.getMinutes()			);
					}
					interval_major.date.setMinutes(interval_major.date.getMinutes() + inc_time_major);
					//_idd = interval_major.date.getHours() + ":" + VMM.Util.doubledigit(interval_major.date.getMinutes());
					_idd = VMM.Util.date.prettyDate(interval_major.date, true, interval_major.type);
				} else if (interval_major.type == "second") {
					if (_first_run) {
						interval_major.date.setMonth(		data[0].startdate.getMonth()			);
						interval_major.date.setDate(		data[0].startdate.getDate()				);
						interval_major.date.setHours(		data[0].startdate.getHours()			);
						interval_major.date.setMinutes(		data[0].startdate.getMinutes()			);
						interval_major.date.setSeconds(		data[0].startdate.getSeconds()			);
					}
					interval_major.date.setSeconds(interval_major.date.getSeconds() + inc_time_major);
					//_idd = interval_major.date.getHours() + ":" + VMM.Util.doubledigit(interval_major.date.getMinutes()) + ":" + VMM.Util.doubledigit(interval_major.date.getSeconds());
					_idd = VMM.Util.date.prettyDate(interval_major.date, true, interval_major.type);
				}
				trace("interval_major.type " + interval_major.type);
				
				inc_time_major = 1;
				
				
				
				/* 	BUILD DATE USING SAME METHODOLOGY AS MARKER POSITON
					CREATE A DATE
				//================================================== */
				
				var _pos = positionOnTimeline(interval, interval_major.date, interval_major.date);
				var pos = _pos.begin;
				
				$interval_date = VMM.appendAndGetElement($timeintervalmajor, "<div>", "major");
				VMM.appendElement($interval_date, _idd);
				
				VMM.Element.css($interval_date, "left", pos);
				VMM.Element.css($interval_date, "left", pos);
				VMM.Element.css($interval_date, "text-indent", -(VMM.Element.width($interval_date)/2));
				
				if (_first_run) {
					_major_first_pos = pos; 
				}
				_first_run = false;
				
				_last_pos_major = pos;
				_major_last_pos = pos;
				
			}
			
			VMM.Element.width($content, interval.number * (config.interval_width / config.multiplier) );
			
			//VMM.Element.width($timeintervalminor_minor, (interval.number * (config.interval_width / config.multiplier)) + 200 );
			_minor_pos_offset = 50;
			var _minor_width = (_major_last_pos - _major_first_pos)+(_minor_pos_offset*6);
			var _normal_width = (_last_pos)+(_minor_pos_offset*6);
			
			if (_minor_width < _normal_width) {
				VMM.Element.width($timeintervalminor_minor, _normal_width);
			} else {
				VMM.Element.width($timeintervalminor_minor, _minor_width);
			}
			

			VMM.Element.css($timeintervalminor_minor, "left", _major_first_pos - _minor_pos_offset);
			
			config.timeline_width = VMM.Element.width($timeinterval);
			
			
		}
		
		var buildInterval = function() {
			
			/* CALCULATE INTERVAL
			================================================== */
			timespan = getDateFractions((data[data.length - 1].enddate) - (data[0].startdate), true);
			calculateInterval();
			
			/* DETERMINE DEFAULT INTERVAL TYPE
			================================================== */
			
			if (timespan.milleniums > data.length / config.density) {
				interval = interval_calc.millenium;
				//interval_major = interval_calc.millenium;
			} else if (timespan.centuries > data.length / config.density) {
				interval = Math.ceil(interval_calc.century);
				//interval_major = interval_calc.millenium;
			} else if (timespan.decades > data.length / config.density) {
				interval = interval_calc.decade;
				//interval_major = Math.ceil(interval_calc.century);
			} else if (timespan.years > data.length / config.density) {	
				interval = interval_calc.year;
				//interval_major = interval_calc.decade;
			} else if (timespan.months > data.length / config.density) {
				interval = interval_calc.month;
				//interval_major = interval_calc.year;
			//} else if (timespan.weeks > data.length / config.density) {
				//interval = interval_calc.week;
				//interval = interval_calc.month;
				//interval_major = interval_calc.month;
			} else if (timespan.days > data.length / config.density) {
				interval = interval_calc.day;
				//interval_major = interval_calc.month;
			} else if (timespan.hours > data.length / config.density) {
				interval = interval_calc.hour;
				//interval_major = interval_calc.day;
			} else if (timespan.minutes > data.length / config.density) {
				interval = interval_calc.minute;
				//interval_major = interval_calc.hour;
			} else if (timespan.seconds > data.length / config.density) {
				interval = interval_calc.second;
				//interval_major = interval_calc.minute;
			} else {
				trace("NO FUCKING IDEA WHAT THE TYPE SHOULD BE");
				interval.type = "unknown";
			}
			
			/* DETERMINE MAJOR TYPE
			================================================== */
			
			if (timespan.milleniums >= 1) {
				interval_major = interval_calc.millenium;
			} else if (timespan.centuries >= 1) {
				interval_major = interval_calc.century;
			} else if (timespan.decades >= 1) {
				interval_major = interval_calc.decade;
			} else if (timespan.years >= 1) {	
				interval_major = interval_calc.year;
			} else if (timespan.months > 1) {
				interval_major = interval_calc.month;
			} else if (timespan.weeks > 1) {
				interval_major = interval_calc.month;
			} else if (timespan.days > 1) {
				interval_major = interval_calc.day;
			} else if (timespan.hours > 1) {
				interval_major = interval_calc.hour;
			} else if (timespan.minutes > 1) {
				interval_major = interval_calc.minute;
			} else if (timespan.seconds > 1) {
				interval_major = interval_calc.minute;
			} else {
				trace("NO FUCKING IDEA WHAT THE TYPE SHOULD BE");
				interval_major.type = "unknown";
			}
			
			//trace(interval_major.type);
			
			$timeintervalminor_minor = VMM.appendAndGetElement($timeintervalminor, "<div>", "minor");
			
			positionInterval();
			
		}
		
		/* GO TO TIME MARKER
		================================================== */
		var goToMarker = function(n, ease, duration, fast, firstrun) {
			
			// Set current slide
			current_marker = n;
			
			var _ease = config.ease;
			var _duration = config.duration;
			var is_last = false;
			var is_first = false;
			
			if (current_marker == 0) {
				is_first = true;
			}
			if (current_marker +1 == markers.length) {
				is_last = true
			}
			if (ease != null && ease != "") {_ease = ease};
			if (duration != null && duration != "") {_duration = duration};
			
			/* get marker position
			================================================== */
			var _pos = VMM.Element.position(markers[current_marker].marker);
			
			/* set marker style
			================================================== */
			for(var i = 0; i < markers.length; i++) {
				VMM.Element.removeClass(markers[i].marker, "active");
			}
			
			if (config.has_start_page && markers[current_marker].type == "start") {
				VMM.Element.visible(markers[current_marker].marker, false);
				VMM.Element.addClass(markers[current_marker].marker, "start");
			}
			
			VMM.Element.addClass(markers[current_marker].marker, "active");
			
			/* set proper nav titles and dates etc.
			================================================== */
			if (is_first) {
				//VMM.Element.visible(navigation.prevBtn, false);
			} else {
				//VMM.Element.visible(navigation.prevBtn, true);
			}
			if (is_last) {
				//VMM.Element.visible(navigation.nextBtn, false);
			} else {
				//VMM.Element.visible(navigation.nextBtn, true);
			}
			
			/* ANIMATE MARKER
			================================================== */
			VMM.Element.stop($timenav);
			VMM.Element.animate($timenav, _duration, _ease, {"left": (config.width/2) - (_pos.left)});
			
			
		}
		
		
		/* BUILD
		================================================== */
		var build = function() {
			// Clear out existing content
			VMM.attachElement(layout, "");
			
			$timenav = VMM.appendAndGetElement(layout, "<div>", "timenav");

			
			$content = VMM.appendAndGetElement($timenav, "<div>", "content");
			$time = VMM.appendAndGetElement($timenav, "<div>", "time");
			$timeintervalminor = VMM.appendAndGetElement($time, "<div>", "time-interval-minor");
			$timeintervalmajor = VMM.appendAndGetElement($time, "<div>", "time-interval-major");
			$timeinterval = VMM.appendAndGetElement($time, "<div>", "time-interval");
			$timebackground = VMM.appendAndGetElement(layout, "<div>", "timenav-background");
			$timenavline = VMM.appendAndGetElement($timebackground, "<div>", "timenav-line");
			$timeintervalbackground = VMM.appendAndGetElement($timebackground, "<div>", "timenav-interval-background", "<div class='top-highlight'></div>");
			
			buildInterval();
			buildMarkers();
			reSize(true);
			VMM.fireEvent(layout, "LOADED");
			
			$toolbar = VMM.appendAndGetElement(layout, "<div>", "toolbar");
			
			if (config.has_start_page) {
				$backhome = VMM.appendAndGetElement($toolbar, "<div>", "back-home", "<div class='icon'></div>");
				VMM.bindEvent(".back-home", onBackHome, "click");
				VMM.Element.css($toolbar, "top", 27);
				
			}
			$zoomin = VMM.appendAndGetElement($toolbar, "<div>", "zoom-in", "<div class='icon'></div>");
			$zoomout = VMM.appendAndGetElement($toolbar, "<div>", "zoom-out", "<div class='icon'></div>");
			
			VMM.Element.attribute($backhome, "title", "Return to Title");
			VMM.Element.attribute($backhome, "rel", "tooltip");
			
			VMM.Element.attribute($zoomin, "title", "Expand Timeline");
			VMM.Element.attribute($zoomin, "rel", "tooltip");
			
			VMM.Element.attribute($zoomout, "title", "Contract Timeline");
			VMM.Element.attribute($zoomout, "rel", "tooltip");
			
			VMM.bindEvent(".zoom-in", onZoomIn, "click");
			VMM.bindEvent(".zoom-out", onZoomOut, "click");
			

			$toolbar.tooltip({
				selector: "div[rel=tooltip]",
				placement: "right"
			})
			/* MAKE TIMELINE TOUCHABLE
			================================================== */
			if (VMM.Browser.device == "mobile" || VMM.Browser.device == "tablet") {
				VMM.TouchSlider.createPanel($timebackground, $timenav, config.width, config.spacing, false);
				VMM.bindEvent($timenav, onTouchUpdate, "TOUCHUPDATE");
			} else {
				
				VMM.DragSlider.createPanel(layout, $timenav, config.width, config.spacing, false);
				//VMM.bindEvent($timenav, onDragUpdate, "DRAGUPDATE");
			}
			
			
			
			_active = true;
			
		};
		
		var refreshTimeline = function() {
			positionInterval();
			positionMarkers(true);
			//reSize();
		};
		
		
		
	};
	
	VMM.Timeline.Config = {
		
	};
	/* 	SOURCE DATA PROCESSOR
	================================================== */
	VMM.Timeline.DataObj = {
		
		data_obj: {},
		
		model_array: [],
		
		getData: function(raw_data) {
			
			data = VMM.Timeline.DataObj.data_obj;

			
			if (type.of(raw_data) != "string") {
				
				trace("DATA SOURCE: NOT JSON");
				trace("TRYING HTML PARSE");
				VMM.Timeline.DataObj.parseHTML(raw_data);
				
			} else {
				
				if (raw_data.match("%23")) {
					
					trace("DATA SOURCE: TWITTER SEARCH");
					VMM.Timeline.DataObj.model_Tweets.getData("%23medill");
					
				} else if (	raw_data.match("spreadsheet")	) {
					
					trace("DATA SOURCE: GOOGLE SPREADSHEET");
					VMM.Timeline.DataObj.model_GoogleSpreadsheet.getData(raw_data);
					
				} else {
					
					trace("DATA SOURCE: JSON");
					VMM.getJSON(raw_data, VMM.Timeline.DataObj.parseJSON);
					
				}
				
			}
			
		},
		
		parseHTML: function(d) {
			trace("parseHTML");
			
			var _data_obj = VMM.Timeline.DataObj.data_template_obj;
			
			/*	Timeline start slide
			================================================== */
			if (VMM.Element.find("#timeline section", "time")[0]) {
				_data_obj.timeline.startDate = VMM.Element.html(VMM.Element.find("#timeline section", "time")[0]);
				_data_obj.timeline.headline = VMM.Element.html(VMM.Element.find("#timeline section", "h2"));
				_data_obj.timeline.text = VMM.Element.html(VMM.Element.find("#timeline section", "article"));
				
				var found_main_media = false;
				
				if (VMM.Element.find("#timeline section", "figure img").length != 0) {
					found_main_media = true;
					_data_obj.timeline.asset.media = VMM.Element.attr(VMM.Element.find("#timeline section", "figure img"), "src");
				} else if (VMM.Element.find("#timeline section", "figure a").length != 0) {
					found_main_media = true;
					_data_obj.timeline.asset.media = VMM.Element.attr(VMM.Element.find("#timeline section", "figure a"), "href");
				} else {
					//trace("NOT FOUND");
				}

				if (found_main_media) {
					if (VMM.Element.find("#timeline section", "cite").length != 0) {
						_data_obj.timeline.asset.credit = VMM.Element.html(VMM.Element.find("#timeline section", "cite"));
					}
					if (VMM.Element.find(this, "figcaption").length != 0) {
						_data_obj.timeline.asset.caption = VMM.Element.html(VMM.Element.find("#timeline section", "figcaption"));
					}
				}
			}
			
			/*	Timeline Date Slides
			================================================== */
			VMM.Element.each("#timeline li", function(i, elem){
				
				var valid_date = false;
				
				var _date = {
					"type":"default",
					"startDate":"",
		            "headline":"",
		            "text":"",
		            "asset":
		            {
		                "media":"",
		                "credit":"",
		                "caption":""
		            },
		            "tags":"Optional"
				};
				
				if (VMM.Element.find(this, "time") != 0) {
					
					valid_date = true;
					
					_date.startDate = VMM.Element.html(VMM.Element.find(this, "time")[0]);

					if (VMM.Element.find(this, "time")[1]) {
						_date.endDate = VMM.Element.html(VMM.Element.find(this, "time")[0]);
					}

					_date.headline = VMM.Element.html(VMM.Element.find(this, "h3"));

					_date.text = VMM.Element.html(VMM.Element.find(this, "article"));

					var found_media = false;
					if (VMM.Element.find(this, "figure img").length != 0) {
						found_media = true;
						_date.asset.media = VMM.Element.attr(VMM.Element.find(this, "figure img"), "src");
					} else if (VMM.Element.find(this, "figure a").length != 0) {
						found_media = true;
						_date.asset.media = VMM.Element.attr(VMM.Element.find(this, "figure a"), "href");
					} else {
						//trace("NOT FOUND");
					}

					if (found_media) {
						if (VMM.Element.find(this, "cite").length != 0) {
							_date.asset.credit = VMM.Element.html(VMM.Element.find(this, "cite"));
						}
						if (VMM.Element.find(this, "figcaption").length != 0) {
							_date.asset.caption = VMM.Element.html(VMM.Element.find(this, "figcaption"));
						}
					}
					
					trace(_date);
					_data_obj.timeline.date.push(_date);
					
				}
				
			});
			
			VMM.fireEvent(global, "DATAREADY", _data_obj);
			
		},
		
		parseJSON: function(d) {
			
			if (d.timeline.type == "default") {
				
				trace("DATA SOURCE: JSON STANDARD TIMELINE");
				
				VMM.fireEvent(global, "DATAREADY", d);
				//return _data_obj.timeline;
				
			} else if (d.timeline.type == "twitter") {
				
				trace("DATA SOURCE: JSON TWEETS");
				
				VMM.Timeline.DataObj.model_Tweets.buildData(d);
				
				
			} else {
				trace("DATA SOURCE: NO IDEA");
				trace(type.of(d.timeline));
			};
			
		},
		
		/*	MODEL OBJECTS 
			New Types of Data can be formatted for the timeline here
		================================================== */
		
		model_Tweets: {
			
			type: "twitter",
			
			buildData: function(raw_data) {
				
				VMM.bindEvent(global, VMM.Timeline.DataObj.model_Tweets.onTwitterDataReady, "TWEETSLOADED");
				VMM.ExternalAPI.twitter.getTweets(raw_data.timeline.tweets);
				
			},
			
			getData: function(raw_data) {
				
				VMM.bindEvent(global, VMM.Timeline.DataObj.model_Tweets.onTwitterDataReady, "TWEETSLOADED");
				VMM.ExternalAPI.twitter.getTweetSearch(raw_data);
				
			},
			
			onTwitterDataReady: function(e, d) {
				
				var _data_obj = VMM.Timeline.DataObj.data_template_obj;

				for(var i = 0; i < d.tweetdata.length; i++) {

					var _date = {
						"type":"tweets",
						"startDate":"",
			            "headline":"",
			            "text":"",
			            "asset":
			            {
			                "media":"",
			                "credit":"",
			                "caption":""
			            },
			            "tags":"Optional"
					};
					// pass in the 'created_at' string returned from twitter //
					// stamp arrives formatted as Tue Apr 07 22:52:51 +0000 2009 //
					
					//var twit_date = VMM.ExternalAPI.twitter.parseTwitterDate(d.tweetdata[i].raw.created_at);
					//trace(twit_date);
					_date.startDate = d.tweetdata[i].raw.created_at;
					
					if (type.of(d.tweetdata[i].raw.from_user_name)) {
						_date.headline = d.tweetdata[i].raw.from_user_name + " (<a href='https://twitter.com/" + d.tweetdata[i].raw.from_user + "'>" + "@" + d.tweetdata[i].raw.from_user + "</a>)" ;						
					} else {
						_date.headline = d.tweetdata[i].raw.user.name + " (<a href='https://twitter.com/" + d.tweetdata[i].raw.user.screen_name + "'>" + "@" + d.tweetdata[i].raw.user.screen_name + "</a>)" ;
						
					}
					
					_date.asset.media = d.tweetdata[i].content;
					_data_obj.timeline.date.push(_date);
					
				};
				
				VMM.fireEvent(global, "DATAREADY", _data_obj);
				
			}
		},
		
		model_GoogleSpreadsheet: {
			
			/*
				TEMPLATE CAN BE FOUND HERE
				https://docs.google.com/previewtemplate?id=0AppSVxABhnltdEhzQjQ4MlpOaldjTmZLclQxQWFTOUE&mode=public
				
			*/
			type: "google spreadsheet",
			
			getData: function(raw_data) {
				var _key = VMM.Util.getUrlVars(raw_data)["key"];
				var _url = "https://spreadsheets.google.com/feeds/list/" + _key + "/od6/public/values?alt=json";
				VMM.getJSON(_url, VMM.Timeline.DataObj.model_GoogleSpreadsheet.buildData);
				/*
				if ( VMM.Browser.browser == "Explorer" && parseInt(VMM.Browser.version, 10) >= 8 && window.XDomainRequest) {
					// Use Microsoft XDR
					// going to move this to VMM.getJSON
					trace("it's ie");
					var ie_xdr = new XDomainRequest();
					var _url = "//spreadsheets.google.com/feeds/list/" + _key + "/od6/public/values?alt=json";
					
					ie_xdr.open("get", _url);
					ie_xdr.onload = function() {
						var ie_j = {};
						var ie_json = VMM.parseJSON(ie_xdr.responseText);
						VMM.Timeline.DataObj.model_GoogleSpreadsheet.buildData(ie_json);
						
					}
					ie_xdr.send();
				} else {
					trace("not ie");
					VMM.getJSON(_url, VMM.Timeline.DataObj.model_GoogleSpreadsheet.buildData);
				}
				*/
				
			},
			
			buildData: function(d) {
				var _data_obj = VMM.Timeline.DataObj.data_template_obj;

				for(var i = 0; i < d.feed.entry.length; i++) {
					
					
					var dd = d.feed.entry[i];
					
					if (dd.gsx$titleslide.$t.match("start")) {
						_data_obj.timeline.startDate = dd.gsx$startdate.$t;
						_data_obj.timeline.headline = dd.gsx$headline.$t;
						_data_obj.timeline.asset.media = dd.gsx$media.$t;
						_data_obj.timeline.asset.caption = dd.gsx$mediacaption.$t;
						_data_obj.timeline.asset.credit = dd.gsx$mediacredit.$t;
						_data_obj.timeline.text = dd.gsx$text.$t;
						_data_obj.timeline.type = "google spreadsheet";
					} else {
						var _date = {
							"type":"google spreadsheet",
							"startDate":"",
							"endDate":"",
				            "headline":"",
				            "text":"",
							"type":"google spreadsheet",
				            "asset":
				            {
				                "media":"",
				                "credit":"",
				                "caption":""
				            },
				            "tags":"Optional"
						};

						_date.endDate = dd.gsx$enddate.$t;
						_date.startDate = dd.gsx$startdate.$t;
						_date.headline = dd.gsx$headline.$t;
						_date.asset.media = dd.gsx$media.$t;
						_date.asset.caption = dd.gsx$mediacaption.$t;
						_date.asset.credit = dd.gsx$mediacredit.$t;
						_date.text = dd.gsx$text.$t;

						_data_obj.timeline.date.push(_date);
					}
					
					
					
				};
				
				VMM.fireEvent(global, "DATAREADY", _data_obj);
				
			}
			
		},
		
		
		/*	TEMPLATE OBJECTS
		================================================== */
		
		data_template_obj: {
			"timeline": {
		        "headline":"",
		        "description":"",
				"asset": {
					"media":"",
					"credit":"",
					"caption":""
				},
		        "date": []
		    }
		},
		
		date_obj: {
			"startDate":"2012,2,2,11,30",
            "headline":"",
            "text":"",
            "asset":
            {
                "media":"http://youtu.be/vjVfu8-Wp6s",
                "credit":"",
                "caption":""
            },
            "tags":"Optional"
		}

	};

};




/*
$(document).ready(function() {

	//Instantiate 
	timeline = new VMM.Timeline(960, 550); // Pass in width and height or set it in your stylesheet;
	
	// Initialize
	timeline.init("example.json"); // Pass in the data
	
});
*/