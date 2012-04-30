/*!
	Timeline 0.98
	Designed and built by Zach Wise digitalartwork.net
	Date: April 26, 2012

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

// @codekit-prepend "VMM.js";
// @codekit-prepend "VMM.Library.js";
// @codekit-prepend "VMM.Browser.js";
// @codekit-prepend "VMM.MediaElement.js";
// @codekit-prepend "VMM.MediaType.js";
// @codekit-prepend "VMM.Media.js";
// @codekit-prepend "VMM.FileExtention.js";
// @codekit-prepend "VMM.ExternalAPI.js";
// @codekit-prepend "VMM.TouchSlider.js";
// @codekit-prepend "VMM.DragSlider.js";
// @codekit-prepend "VMM.Slider.js";
// @codekit-prepend "VMM.Util.js";
// @codekit-prepend "VMM.LoadLib.js";
// @codekit-prepend "VMM.Language.js";
// @codekit-prepend "bootstrap-tooltip.js";
// @codekit-prepend "AES.js";

// @codekit-append "VMM.Timeline.TimeNav.js";
// @codekit-append "VMM.Timeline.DataObj.js";

/* Timeline
================================================== */

if(typeof VMM != 'undefined' && typeof VMM.Timeline == 'undefined') {
	
	VMM.Timeline = function(w, h, conf) {
		var version = "0.98";
		trace("TIMELINE VERSION " + version);
		
		var $timeline = VMM.getElement("#timeline"); // expecting name only for parent
		var $feedback;
		var $messege;
		
		var html_string = VMM.getElement("#timeline");
		
		/* CREATE DOM STRUCTURE
		================================================== */
		//VMM.attachElement($timeline, "");
		
		$feedback = VMM.appendAndGetElement($timeline, "<div>", "feedback", "");
		$messege = VMM.appendAndGetElement($feedback, "<div>", "messege", "#Timeline");
		
		//VMM.appendElement($timeline, "<div class='container main'><div class='feature'><div class='slider'></div></div><div class='navigation'></div></div>");
		
		
		
		
		/* PRIVATE VARS
		================================================== */
		var _private_var = 'private';
		var events = {}; // CUSTOM EVENT HOLDER
		var data = {}; // HOLDS DATA
		var _dates = []; // HOLDES PROCESSED DATES
		
		/* CONFIG
		================================================== */
		
		var config = {
			type: "timeline",
			maptype: "toner",
			interval: 10,
			something: 0,
			width: 960,
			height: 540,
			spacing: 15,
			loaded: {
				slider: false, 
				timenav: false, 
				percentloaded:0
			},
			nav: {
				width: 960,
				height: 200
			},
			feature: {
				width: 960,
				height: 540
			},
			slider: {
				width: 720,
				height: 400,
				content: {
					width: 720,
					height: 400,
					padding: 130,
				},
				nav: {
					width: 100,
					height: 200
				}
			},
			ease: "easeInOutExpo",
			duration: 1000,
			language: VMM.Language
		};
		
		VMM.Timeline.Config = config;
		VMM.master_config.Timeline = VMM.Timeline.Config;
		
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
		
		config.nav = {
			width: config.width,
			height: 200
		};
		config.feature = {
			width: config.width,
			height: config.height - config.nav.height
		}
		
		if (VMM.Browser.device == "mobile") {
			config.feature.height = config.height;
		} else {
			//config.feature.height = config.height - config.nav.height;
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
		
		/* CREATE COMPONENTS
		================================================== */
		// SLIDER
		//var slider = new VMM.Slider("div.slider", 720, 400, true);
		var slider = new VMM.Slider("div.slider", config);

		// TIMENAV
		var timenav = new VMM.Timeline.TimeNav("div.navigation", 720, 400, true);
		
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
			slider.setSize(config.feature.width, config.feature.height);
			timenav.setSize(config.width, config.height);
			resizeSlides();
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
			timenav.setMarker(slider.getCurrentNumber(), config.ease,config.duration);
		};
		
		function onMarkerUpdate(e) {
			slider.setSlide(timenav.getCurrentNumber());
		};
		
		/* PUBLIC FUNCTIONS
		================================================== */
		this.init = function(d) {
			
			trace('TIMELINE INIT');
			trace(VMM.Timeline.Config.language);
			VMM.Util.date.setLanguage(VMM.Timeline.Config.language);
			
			VMM.bindEvent(global, onDataReady, "DATAREADY");
			VMM.bindEvent(global, showMessege, "MESSEGE");
			
			/* GET DATA
			================================================== */
			if (ie7) {
				$feedback = VMM.appendAndGetElement($timeline, "<div>", "feedback", "");
				$messege = VMM.appendAndGetElement($feedback, "<div>", "messege", "Internet Explorer 7 is not supported by #Timeline.");
			} else {
				if (type.of(d) == "string") {
					VMM.Timeline.DataObj.getData(d);
				} else {
					VMM.Timeline.DataObj.getData(html_string);
				}

				$feedback = VMM.appendAndGetElement($timeline, "<div>", "feedback", "");
				$messege = VMM.appendAndGetElement($feedback, "<div>", "messege", VMM.Timeline.Config.language.messages.loading_timeline);
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
		
		var showMessege = function(e, msg) {
			$messege = VMM.appendAndGetElement($feedback, "<div>", "messege", msg);
			
		};
		
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
			//VMM.bindEvent(global, function(e) {e.preventDefault()}, "touchmove");
			
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
						c._media = VMM.MediaElement.create("", d.asset, true, config.feature.width, config.feature.height);
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
			
			config.nav.width = config.width;
			config.feature.width = config.width;
			
			if (VMM.Browser.device == "mobile") {
				config.feature.height = config.height;
			} else {
				config.feature.height = config.height - config.nav.height - 3;
			}
		};
		
		var resizeSlides = function() {
			
			/* CHECK FOR MOBILE 
			================================================== */
			if (config.width <= 480) {
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
				VMM.Element.height(".slider-container-mask", config.feature.height);
			}
			
		};
		
		// BUILD DATE OBJECTS
		var buildDates = function() {
			
			updateSize();
			//$messege = VMM.appendAndGetElement($feedback, "<div>", "messege", "Building Dates");
			
			VMM.fireEvent(global, "MESSEGE", "Building Dates");
			
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
			_dates.sort(function(a, b){
				return a.fulldate - b.fulldate
			});
			
			/* CREATE START PAGE IF AVAILABLE
			================================================== */
			if (data.headline != null && data.headline != "" && data.text != null && data.text != "") {
				trace("HAS STARTPAGE");
				var _date = {};
				if (data.type == "google spreadsheet") {
					trace("google spreadsheet startpage date " + data.startDate);
					//_date.startdate = new Date(Date.parse(data.startDate));
				} else {
					_date.startdate = VMM.Util.parseDate(data.startDate);
				}
				
				_date.startdate = new Date(_dates[0].startdate);
				
				var td = _dates[0].startdate;
				var td_num = 0;
				/*
				if (_dates[0].startdate.getDate() > 1) {
					_date.startdate.setDate(td.getDate() - 1);
				} else if (_dates[0].startdate.getHours() > 0) {
					_date.startdate.setHours(td.getHours() - 1);
				}
				*/
				trace(td);
				
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
				trace(td);
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
				if (_date.content != null && _date.content != "" || _date.title != null && _date.title != "") {
					_dates.push(_date);
				}
			}
			
			/* CUSTOM SORT
			================================================== */
			_dates.sort(function(a, b){
				return a.fulldate - b.fulldate
			});
			
			onDatesProcessed();
		}
		
	};

	VMM.Timeline.Config = {};
	
};