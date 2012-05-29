/* 	TIMELINE NAVIGATION
================================================== */

if(typeof VMM.Timeline != 'undefined' && typeof VMM.Timeline.TimeNav == 'undefined') {
	
	VMM.Timeline.TimeNav = function(parent, content_width, content_height) {
		trace("VMM.Timeline.TimeNav");
		
		var events = {}, timespan = {}, layout = parent;
		var timeouts = {
			interval_position: ""
		};
		var data = [], era_markers = [], markers = [], interval_array = [], interval_major_array = [], eras, content, tags = []; 
		var timenav_pos = {
				left:"",
				visible: {
					left:"",
					right:""
				}
			};
		
		var current_marker		= 	0;
		var _active				=	false;
		var timelookup			= 	{day: 24, month: 12, year: 10, hour: 60, minute: 60, second: 1000, decade: 10, century: 100, millenium: 1000, age: 1000000, epoch: 10000000, era: 100000000, eon: 500000000, week: 4.34812141, days_in_month: 30.4368499, days_in_week: 7, weeks_in_month:4.34812141, weeks_in_year:52.177457, days_in_year: 365.242199, hours_in_day: 24 };
		var dateFractionBrowser	= 	{day: 86400000, week: 7, month: 30.4166666667, year: 12, hour: 24, minute: 1440, second: 86400, decade: 10, century: 100, millenium: 1000, age: 1000000, epoch: 10000000, era: 100000000, eon: 500000000 };
		
		var interval			= 	{type: "year", number: 10, first: 1970, last: 2011, multiplier: 100, classname:"_idd", interval_type:"interval"};
		var interval_major		= 	{type: "year", number: 10, first: 1970, last: 2011, multiplier: 100, classname:"major", interval_type:"interval major"};
		var interval_macro		= 	{type: "year", number: 10, first: 1970, last: 2011, multiplier: 100, classname:"_dd_minor", interval_type:"interval minor"};
		var interval_calc		= 	{day: {},month: {},year: {},hour: {},minute: {}, second: {},decade: {},century: {},millenium: {},week: {}, age: {}, epoch: {}, era: {}, eon: {} };
		
		/* ELEMENTS
		================================================== */
		var $timenav, $content, $time, $timeintervalminor, $timeinterval, $timeintervalmajor, $timebackground, 
		$timeintervalbackground, $timenavline, $timenavindicator, $timeintervalminor_minor, $toolbar, $zoomin, $zoomout;
		
		/* ADD to Config
		================================================== */
		var config				= 	VMM.Timeline.Config;
		config.nav.rows			= 	[1, config.nav.marker.height, config.nav.marker.height*2];
		
		if (content_width != null && content_width != "") {
			config.nav.width	= 	content_width;
		} 
		if (content_height != null && content_height != "") {
			config.nav.height	= 	content_height;
		}
		
		/*
		config.nav.density = 		2;
		config.nav.multiplier = {
			current: 				6,
			min: 					.1,
			max: 					50
		};
		*/
		
		/* INIT
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
				data = {};
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
			VMM.Lib.css($timenavline, "left", Math.round(config.width/2)+2);
			VMM.Lib.css($timenavindicator, "left", Math.round(config.width/2)-8);
			goToMarker(config.current_slide, config.ease, config.duration, true, firstrun);
		};
		
		function upDate() {
			VMM.fireEvent(layout, "UPDATE");
		}
		
		function onZoomIn() {
			VMM.DragSlider.cancelSlide();
			if (config.nav.multiplier.current > config.nav.multiplier.min) {
				if (config.nav.multiplier.current <= 1) {
					config.nav.multiplier.current = config.nav.multiplier.current - .25;
				} else {
					if (config.nav.multiplier.current > 5) {
						if (config.nav.multiplier.current > 16) {
							config.nav.multiplier.current = Math.round(config.nav.multiplier.current - 10);
						} else {
							config.nav.multiplier.current = Math.round(config.nav.multiplier.current - 4);
						}
					} else {
						config.nav.multiplier.current = Math.round(config.nav.multiplier.current - 1);
					}
					
				}
				if (config.nav.multiplier.current <= 0) {
					config.nav.multiplier.current = config.nav.multiplier.min;
				}
				refreshTimeline();
			}
		}
		
		function onZoomOut() {
			VMM.DragSlider.cancelSlide();
			if (config.nav.multiplier.current < config.nav.multiplier.max) {
				if (config.nav.multiplier.current > 4) {
					if (config.nav.multiplier.current > 16) {
						config.nav.multiplier.current = Math.round(config.nav.multiplier.current + 10);
					} else {
						config.nav.multiplier.current = Math.round(config.nav.multiplier.current + 4);
					}
				} else {
					config.nav.multiplier.current = Math.round(config.nav.multiplier.current + 1);
				}
				
				if (config.nav.multiplier.current >= config.nav.multiplier.max) {
					config.nav.multiplier.current = config.nav.multiplier.max;
				}
				refreshTimeline();
			}
		}
		
		function onBackHome(e) {
			VMM.DragSlider.cancelSlide();
			goToMarker(0);
			upDate();
		}
		
		var refreshTimeline = function() {
			trace("config.nav.multiplier " + config.nav.multiplier.current);
			positionMarkers(true);
			positionInterval($timeinterval, interval_array, true, true);
			positionInterval($timeintervalmajor, interval_major_array, true);
		};
		
		/* MARKER EVENTS
		================================================== */
		function onMarkerClick(e) {
			VMM.DragSlider.cancelSlide();
			goToMarker(e.data.number);
			upDate();
		};
		
		function onMarkerHover(e) {
			VMM.Lib.toggleClass(e.data.elem, "zFront");
		};
		
		var goToMarker = function(n, ease, duration, fast, firstrun) {
			var _ease		= config.ease,
				_duration	= config.duration,
				is_last		= false,
				is_first	= false;
			
			current_marker = 	n;
			
			timenav_pos.left			= (config.width/2) - VMM.Lib.position(markers[current_marker].marker).left;
			timenav_pos.visible.left	= Math.abs(timenav_pos.left) - 100;
			timenav_pos.visible.right	= Math.abs(timenav_pos.left) + config.width + 100;
			
			if (current_marker == 0) {
				is_first = true;
			}
			if (current_marker +1 == markers.length) {
				is_last = true
			}
			if (ease != null && ease != "") {_ease = ease};
			if (duration != null && duration != "") {_duration = duration};
			
			// set marker style
			for(var i = 0; i < markers.length; i++) {
				VMM.Lib.removeClass(markers[i].marker, "active");
			}
			
			if (config.start_page && markers[0].type == "start") {
				VMM.Lib.visible(markers[0].marker, false);
				VMM.Lib.addClass(markers[0].marker, "start");
			}
			
			VMM.Lib.addClass(markers[current_marker].marker, "active");
			
			// ANIMATE MARKER
			VMM.Lib.stop($timenav);
			VMM.Lib.animate($timenav, _duration, _ease, {"left": timenav_pos.left});
			
		}
		
		/* TOUCH EVENTS
		================================================== */
		function onTouchUpdate(e, b) {
			VMM.Lib.animate($timenav, b.time/2, config.ease, {"left": b.left});
		};
		
		/* CALCULATIONS
		================================================== */
		var averageMarkerPositionDistance = function() {
			var last_pos	= 0,
				pos			= 0,
				pos_dif		= 0,
				mp_diff		= [];
			
			for(var i = 0; i < markers.length; i++) {
				if (data[i].type == "start") {
					
				} else {
					var _pos = positionOnTimeline(interval, markers[i].relative_pos),
					last_pos = pos;
					pos = _pos.begin;
					pos_dif = pos - last_pos;
					mp_diff.push(pos_dif);
				}
			}
			return VMM.Util.average(mp_diff).mean;
		}
		
		var averageDateDistance = function() {
			var last_dd = 			0;
			var dd = 				0;
			var date_dif = 			0;
			var date_diffs = 		[];
			var is_first_date = 	true;
			
			for(var i = 0; i < data.length; i++) {
				if (data[i].type == "start") {
					trace("DATA DATE IS START")
				} else {
					var _dd = 		data[i].startdate;
					last_dd = 		dd;
					dd = 			_dd;
					date_dif = 		dd - last_dd;
					
					date_diffs.push(date_dif);
				}
			}
			return VMM.Util.average(date_diffs);
		}
		
		var calculateMultiplier = function() {
			var temp_multiplier = config.nav.multiplier.current;
			for(var i = 0; i < temp_multiplier; i++) {
				if (averageMarkerPositionDistance() < 75) {
					if (config.nav.multiplier.current > 1) {
						config.nav.multiplier.current = config.nav.multiplier.current - 1;
					}
				}
			}
		}
		
		var calculateInterval = function() {
			// NEED TO REWRITE ALL OF THIS
			var _first								= 	getDateFractions(data[0].startdate);
			var _last								=	getDateFractions(data[data.length - 1].enddate);
			
			// EON
			interval_calc.eon.type					=	"eon";
			interval_calc.eon.first					=	_first.eons;
			interval_calc.eon.base					=	Math.floor(_first.eons);
			interval_calc.eon.last					=	_last.eons;
			interval_calc.eon.number				=	timespan.eons;
			interval_calc.eon.multiplier		 	=	timelookup.eons;
			interval_calc.eon.minor					=	timelookup.eons;
			
			// ERA
			interval_calc.era.type					=	"era";
			interval_calc.era.first					=	_first.eras;
			interval_calc.era.base					=	Math.floor(_first.eras);
			interval_calc.era.last					=	_last.eras;
			interval_calc.era.number				=	timespan.eras;
			interval_calc.era.multiplier		 	=	timelookup.eras;
			interval_calc.era.minor					=	timelookup.eras;
			
			// EPOCH
			interval_calc.epoch.type				=	"epoch";
			interval_calc.epoch.first				=	_first.epochs;
			interval_calc.epoch.base				=	Math.floor(_first.epochs);
			interval_calc.epoch.last				=	_last.epochs;
			interval_calc.epoch.number				=	timespan.epochs;
			interval_calc.epoch.multiplier		 	=	timelookup.epochs;
			interval_calc.epoch.minor				=	timelookup.epochs;
			
			// AGE
			interval_calc.age.type					=	"age";
			interval_calc.age.first					=	_first.ages;
			interval_calc.age.base					=	Math.floor(_first.ages);
			interval_calc.age.last					=	_last.ages;
			interval_calc.age.number				=	timespan.ages;
			interval_calc.age.multiplier		 	=	timelookup.ages;
			interval_calc.age.minor					=	timelookup.ages;
			
			// MILLENIUM
			interval_calc.millenium.type 			=	"millenium";
			interval_calc.millenium.first			=	_first.milleniums;
			interval_calc.millenium.base			=	Math.floor(_first.milleniums);
			interval_calc.millenium.last			=	_last.milleniums;
			interval_calc.millenium.number			=	timespan.milleniums;
			interval_calc.millenium.multiplier	 	=	timelookup.millenium;
			interval_calc.millenium.minor			=	timelookup.millenium;
			
			// CENTURY
			interval_calc.century.type 				= "century";
			interval_calc.century.first 			= _first.centuries;
			interval_calc.century.base 				= Math.floor(_first.centuries);
			interval_calc.century.last 				= _last.centuries;
			interval_calc.century.number 			= timespan.centuries;
			interval_calc.century.multiplier	 	= timelookup.century;
			interval_calc.century.minor 			= timelookup.century;
			
			// DECADE
			interval_calc.decade.type 				= "decade";
			interval_calc.decade.first 				= _first.decades;
			interval_calc.decade.base 				= Math.floor(_first.decades);
			interval_calc.decade.last 				= _last.decades;
			interval_calc.decade.number 			= timespan.decades;
			interval_calc.decade.multiplier 		= timelookup.decade;
			interval_calc.decade.minor 				= timelookup.decade;
			
			// YEAR
			interval_calc.year.type					= "year";
			interval_calc.year.first 				= _first.years;
			interval_calc.year.base 				= Math.floor(_first.years);
			interval_calc.year.last					= _last.years;
			interval_calc.year.number 				= timespan.years;
			interval_calc.year.multiplier 			= 1;
			interval_calc.year.minor 				= timelookup.month;
			
			// MONTH
			interval_calc.month.type 				= "month";
			interval_calc.month.first 				= _first.months;
			interval_calc.month.base 				= Math.floor(_first.months);
			interval_calc.month.last 				= _last.months;
			interval_calc.month.number 				= timespan.months;
			interval_calc.month.multiplier 			= 1;
			interval_calc.month.minor 				= Math.round(timelookup.week);
			
			// WEEK
			// NOT DONE
			interval_calc.week.type 				= "week";
			interval_calc.week.first 				= _first.weeks;
			interval_calc.week.base 				= Math.floor(_first.weeks);
			interval_calc.week.last 				= _last.weeks;
			interval_calc.week.number 				= timespan.weeks;
			interval_calc.week.multiplier 			= 1;
			interval_calc.week.minor 				= 7;
			
			// DAY
			interval_calc.day.type 					= "day";
			interval_calc.day.first 				= _first.days;
			interval_calc.day.base	 				= Math.floor(_first.days);
			interval_calc.day.last 					= _last.days;
			interval_calc.day.number 				= timespan.days;
			interval_calc.day.multiplier 			= 1;
			interval_calc.day.minor 				= 24;
			
			// HOUR
			interval_calc.hour.type 				= "hour";
			interval_calc.hour.first 				= _first.hours;
			interval_calc.hour.base 				= Math.floor(_first.hours);
			interval_calc.hour.last 				= _last.hours;
			interval_calc.hour.number 				= timespan.hours;
			interval_calc.hour.multiplier 			= 1;
			interval_calc.hour.minor 				= 60;
			
			// MINUTE
			interval_calc.minute.type 				= "minute";
			interval_calc.minute.first 				= _first.minutes;
			interval_calc.minute.base 				= Math.floor(_first.minutes);
			interval_calc.minute.last 				= _last.minutes;
			interval_calc.minute.number 			= timespan.minutes;
			interval_calc.minute.multiplier 		= 1;
			interval_calc.minute.minor 				= 60;
			
			// SECOND
			interval_calc.second.type 				= "decade";
			interval_calc.second.first 				= _first.seconds;
			interval_calc.second.base 				= Math.floor(_first.seconds);
			interval_calc.second.last 				= _last.seconds;
			interval_calc.second.number 			= timespan.seconds;
			interval_calc.second.multiplier 		= 1;
			interval_calc.second.minor 				= 10;
		}
		
		var getDateFractions = function(the_date, is_utc) {
			
			var _time = {};
			_time.days			=		the_date		/	dateFractionBrowser.day;
			_time.weeks 		=		_time.days		/	dateFractionBrowser.week;
			_time.months 		=		_time.days		/	dateFractionBrowser.month;
			_time.years 		=		_time.months 	/	dateFractionBrowser.year;
			_time.hours 		=		_time.days		*	dateFractionBrowser.hour;
			_time.minutes 		=		_time.days		*	dateFractionBrowser.minute;
			_time.seconds 		=		_time.days		*	dateFractionBrowser.second;
			_time.decades 		=		_time.years		/	dateFractionBrowser.decade;
			_time.centuries 	=		_time.years		/	dateFractionBrowser.century;
			_time.milleniums 	=		_time.years		/	dateFractionBrowser.millenium;
			_time.ages			=		_time.years		/	dateFractionBrowser.age;
			_time.epochs		=		_time.years		/	dateFractionBrowser.epoch;
			_time.eras			=		_time.years		/	dateFractionBrowser.era;
			_time.eons			=		_time.years		/	dateFractionBrowser.eon;
			
			/*
			trace("AGES "		 + 		_time.ages);
			trace("EPOCHS "		 + 		_time.epochs);
			trace("MILLENIUMS "  + 		_time.milleniums);
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
		
		/* POSITION
		================================================== */
		var positionRelative = function(_interval, first, last) {
			var _first,
				_last,
				_type = _interval.type,
				timerelative = {start: "", end: "", type: _type};
			
			/* FIRST
			================================================== */
			_first	= getDateFractions(first);
			timerelative.start		= first.months;
			
			if (_type == "eon") {
				timerelative.start = _first.eons;
			} else if (_type == "era") {
				timerelative.start = _first.eras;
			} else if (_type == "epoch") {
				timerelative.start = _first.epochs;
			} else if (_type == "age") {
				timerelative.start = _first.ages;
			} else if (_type == "millenium") {
				timerelative.start = first.milleniums;
			} else if (_type == "century") {
				timerelative.start = _first.centuries;
			} else if (_type == "decade") {
				timerelative.start = _first.decades;
			} else if (_type == "year") {
				timerelative.start = _first.years;
			} else if (_type == "month") {
				timerelative.start = _first.months;
			} else if (_type == "week") {
				timerelative.start = _first.weeks;
			} else if (_type == "day") {
				timerelative.start = _first.days;
			} else if (_type == "hour") {
				timerelative.start = _first.hours;
			} else if (_type == "minute") {
				timerelative.start = _first.minutes;
			}
			
			/* LAST
			================================================== */
			if (type.of(last) == "date") {
				
				_last = getDateFractions(last);
				timerelative.end = last.months;
				
				if (_type == "eon") {
					timerelative.end = _last.eons;
				} else if (_type == "era") {
					timerelative.end = _last.eras;
				} else if (_type == "epoch") {
					timerelative.end = _last.epochs;
				} else if (_type == "age") {
					timerelative.end = _last.ages;
				} else if (_type == "millenium") {
					timerelative.end = last.milleniums;
				} else if (_type == "century") {
					timerelative.end = _last.centuries;
				} else if (_type == "decade") {
					timerelative.end = _last.decades;
				} else if (_type == "year") {
					timerelative.end = _last.years;
				} else if (_type == "month") {
					timerelative.end = _last.months;
				} else if (_type == "week") {
					timerelative.end = _last.weeks;
				} else if (_type == "day") {
					timerelative.end = _last.days;
				} else if (_type == "hour") {
					timerelative.end = _last.hours;
				} else if (_type == "minute") {
					timerelative.end = _last.minutes;
				}
				
			} else {
				
				timerelative.end = timerelative.start;
				
			}
			
			return timerelative
		}
		
		var positionOnTimeline = function(the_interval, timerelative) {
			return {
				begin:	(timerelative.start	-	interval.base) * (config.nav.interval_width / config.nav.multiplier.current), 
				end:	(timerelative.end	-	interval.base) * (config.nav.interval_width / config.nav.multiplier.current)
			};
		}
		
		var positionMarkers = function(is_animated) {
			
			var _type					= interval.type,
				_multiplier				= interval.multiplier,
				row						= 2,
				lpos					= 0,
				row_depth				= 0,
				_line_last_height_pos	= 150,
				_line_height			= 6,
				cur_mark				= 0,
				in_view_margin			= config.width,
				in_view = {
					left:			timenav_pos.visible.left - in_view_margin,
					right:			timenav_pos.visible.right + in_view_margin
				};
				
			config.nav.minor_width = config.width;
			
			VMM.Lib.removeClass(".flag", "row1");
			VMM.Lib.removeClass(".flag", "row2");
			VMM.Lib.removeClass(".flag", "row3");
			
			for(var i = 0; i < markers.length; i++) {
				
				var _line,
					_marker				= markers[i].marker,
					_marker_flag		= markers[i].flag,
					_marker_line_event	= markers[i].lineevent,
					_pos				= positionOnTimeline(interval, markers[i].relative_pos),
					_pos_offset			= -2,
					is_in_view			= false;
				
				pos						= _pos.begin;
				_pos_end				= _pos.end;
				
				// COMPENSATE FOR DATES BEING POITIONED IN THE MIDDLE
				pos						= Math.round(pos +  _pos_offset);
				_pos_end				= Math.round(_pos_end + _pos_offset);
				_line					= Math.round(_pos_end - pos);
				
				if (current_marker == i) {
					timenav_pos.left			= (config.width/2) - pos;
					timenav_pos.visible.left	= Math.abs(timenav_pos.left);
					timenav_pos.visible.right	= Math.abs(timenav_pos.left) + config.width;
					in_view.left				= timenav_pos.visible.left - in_view_margin;
					in_view.right				= timenav_pos.visible.right + in_view_margin;
				}
				
				if (Math.abs(pos) >= in_view.left && Math.abs(pos) <= in_view.right ) {
					is_in_view = true;
				}
				
				// APPLY POSITION TO MARKER
				if (is_animated) {
					VMM.Lib.stop(_marker);
					VMM.Lib.animate(_marker, config.duration/2, config.ease, {"left": pos});
				} else {
					VMM.Lib.stop(_marker);
					VMM.Lib.css(_marker, "left", pos);
				}
				
				if (i == current_marker) {
					cur_mark = pos;
				}
				
				// EVENT LENGTH LINE
				if (_line > 5) {
					VMM.Lib.css(_marker_line_event, "height", _line_height);
					VMM.Lib.css(_marker_line_event, "width", _line);
					VMM.Lib.css(_marker_line_event, "top", _line_last_height_pos);
				}
				
				// CONTROL ROW POSITION
				if (tags.length > 0) {
					
					for (var k = 0; k < tags.length; k++) {
						if (k < config.nav.rows.length) {
							if (markers[i].tag == tags[k]) {
								row = k;
							}
						}
					}
					
				} else {
					if (pos - lpos < (config.nav.marker.width + config.spacing)) {
						if (row < config.nav.rows.length - 1) {
							row ++;
						
						} else {
							row = 0;
							row_depth ++;
						}
					} else {
						row_depth = 1;
						row = 1;
					}
				}
				
				
				// SET LAST MARKER POSITION
				lpos = pos;
				
				if (is_animated && is_in_view) {
					VMM.Lib.stop(_marker_flag);
					VMM.Lib.animate(_marker_flag, config.duration, config.ease, {"top": config.nav.rows[row]});
				} else {
					VMM.Lib.stop(_marker_flag);
					VMM.Lib.css(_marker_flag, "top", config.nav.rows[row]);
				}
				
				// IS THE MARKER A REPRESENTATION OF A START SCREEN?
				if (config.start_page && markers[i].type == "start") {
					VMM.Lib.visible(_marker, false);
				}
				
				if (pos > config.nav.minor_width) {
					config.nav.minor_width = pos;
				}
				
				if (pos < config.nav.minor_left) {
					config.nav.minor_left = pos;
				}
				
			}
			
			for(var j = 0; j < era_markers.length; j++) {
				var _line,
					era			= era_markers[j],
					era_elem	= era.content,
					pos			= positionOnTimeline(interval, era.relative_pos),
					era_length	= pos.end - pos.begin,
					era_height	= 25;
				// APPLY POSITION TO MARKER
				VMM.Lib.css(era_elem, "left", pos.begin);
				VMM.Lib.css(era_elem, "width", era_length);
			}
			
			
			// ANIMATE THE TIMELINE TO ADJUST TO CHANGES
			VMM.Lib.stop($timenav);
			VMM.Lib.animate($timenav, config.duration/2, config.ease, {"left": (config.width/2) - (cur_mark)});
			//VMM.Lib.delay_animate(config.duration, $timenav, config.duration/2, config.ease, {"left": (config.width/2) - (cur_mark)});
			
		
		}
		
		var positionInterval = function(the_main_element, the_intervals, is_animated, is_minor) {
			
			var _type				= interval.type,
				_multiplier			= interval.multiplier,
				last_position		= 0,
				last_position_major	= 0,
				//in_view_margin		= (config.nav.minor_width/config.nav.multiplier.current)/2,
				in_view_margin		= config.width,
				in_view = {
					left:			timenav_pos.visible.left - in_view_margin,
					right:			timenav_pos.visible.right + in_view_margin
				}
				not_too_many		= true;
			
			config.nav.minor_left = 0;
				
			if (the_intervals.length > 100) {
				not_too_many = false;
				trace("TOO MANY " + the_intervals.length);
			}
			
			
			for(var i = 0; i < the_intervals.length; i++) {
				var _interval			= the_intervals[i].interval_element,
					_interval_date		= the_intervals[i].interval_date,
					_interval_visible	= the_intervals[i].interval_visible,
					_pos				= positionOnTimeline(interval, the_intervals[i].relative_pos),
					pos					= _pos.begin,
					_animation			= the_intervals[i].animation,
					is_visible			= true,
					is_in_view			= false,
					pos_offset			= 50;
				
				
				_animation.pos			= pos;
				_animation.animate		= false;
				
				if (Math.abs(pos) >= in_view.left && Math.abs(pos) <= in_view.right ) {
					is_in_view = true;
				}
				
				if (true) {
					
					// CONDENSE WHAT IS DISPLAYED
					if (config.nav.multiplier.current > 16 && is_minor) {
						is_visible = false;
					} else {
						if ((pos - last_position) < 65 ) {
							if ((pos - last_position) < 35 ) {
								if (i%4 == 0) {
									if (pos == 0) {
										is_visible = false;
									}
								} else {
									is_visible = false;
								}
							} else {
								if (!VMM.Util.isEven(i)) {
									is_visible = false;
								}
							}
						}
					}
					
					if (is_visible) {
						if (the_intervals[i].is_detached) {
							VMM.Lib.append(the_main_element, _interval);
							the_intervals[i].is_detached = false;
						}
					} else {
						the_intervals[i].is_detached = true;
						VMM.Lib.detach(_interval);
					}
					
					
					if (_interval_visible) {
						if (!is_visible) {
							_animation.opacity	= "0";
							if (is_animated && not_too_many) {
								_animation.animate	= true;
							}
							the_intervals[i].interval_visible = false;
						} else {
							_animation.opacity	= "100";
							if (is_animated && is_in_view) {
								_animation.animate	= true;
							}
						}
					} else {
						_animation.opacity	= "100";
						if (is_visible) {
							if (is_animated && not_too_many) {
								_animation.animate	= true;
							} else {
								if (is_animated && is_in_view) {
									_animation.animate	= true;
								}
							}
							the_intervals[i].interval_visible = true;
						} else {
							if (is_animated && not_too_many) {
								_animation.animate	= true;
							}
						}
					}
				
					last_position = pos;
				
					if (pos > config.nav.minor_width) {
						config.nav.minor_width = pos;
					}
					
					if (pos < config.nav.minor_left) {
						config.nav.minor_left = pos;
						trace("MINOR " + pos);
					}
					
				}
				
				if (_animation.animate) {
					VMM.Lib.animate(_interval, config.duration/2, config.ease, {opacity: _animation.opacity, left: _animation.pos});
				} else {
					VMM.Lib.css(_interval, "opacity", _animation.opacity);
					VMM.Lib.css(_interval, "left", pos);
				}
			}
			
			
			VMM.Lib.css($timeintervalminor_minor, "left", config.nav.minor_left - (config.width)/2);
			VMM.Lib.width($timeintervalminor_minor, (config.nav.minor_width)+(config.width) + Math.abs(config.nav.minor_left) );
			//trace((config.nav.minor_width/config.nav.multiplier.current)/2)
			
			/*
			for(var k = 0; k < the_intervals.length; k++) {
				var _animation	= the_intervals[k].animation;
					
				if (_animation.animate) {
					var _interval	= the_intervals[k].interval_element;
					VMM.Lib.animate(_interval, config.duration/2, config.ease, {opacity: _animation.opacity, left: _animation.pos}, "interval_que");
				}
			}
			*/
		}
		
		var createIntervalElements = function(_interval, _array, _element_parent) {
			
			var inc_time = 0,
				_first_run = true,
				_last_pos = 0,
				_largest_pos = 0;
			
			VMM.attachElement(_element_parent, "");
			
			_interval.date = new Date(data[0].startdate.getFullYear(), 0, 1, 0,0,0);
			
			for(var i = 0; i < Math.ceil(_interval.number) + 1; i++) {
				var _idd,
					_pos,
					pos,
					_date,
					_visible = false,
					_relative_pos,
					_element = VMM.appendAndGetElement(_element_parent, "<div>", _interval.classname);
				
				if (_interval.type == "eon") {
					if (_first_run) {
						_interval.date.setFullYear(		Math.floor(data[0].startdate.getFullYear() / 500000000) * 500000000	);
					}
					_interval.date.setFullYear(_interval.date.getFullYear() + (inc_time * 500000000));
				} else if (_interval.type == "era") {
					if (_first_run) {
						_interval.date.setFullYear(		Math.floor(data[0].startdate.getFullYear() / 100000000) * 100000000	);
					}
					_interval.date.setFullYear(_interval.date.getFullYear() + (inc_time * 100000000));
				} else if (_interval.type == "epoch") {
					if (_first_run) {
						_interval.date.setFullYear(		Math.floor(data[0].startdate.getFullYear() / 10000000) * 10000000	);
					}
					_interval.date.setFullYear(_interval.date.getFullYear() + (inc_time * 10000000));
				} else if (_interval.type == "age") {
					if (_first_run) {
						_interval.date.setFullYear(		Math.floor(data[0].startdate.getFullYear() / 1000000) * 1000000	);
					}
					_interval.date.setFullYear(_interval.date.getFullYear() + (inc_time * 1000000));
				} else if (_interval.type == "millenium") {
					if (_first_run) {
						_interval.date.setFullYear(		Math.floor(data[0].startdate.getFullYear() / 1000) * 1000	);
					}
					_interval.date.setFullYear(_interval.date.getFullYear() + (inc_time * 1000));
				} else if (_interval.type == "century") {
					if (_first_run) {
						_interval.date.setFullYear(		Math.floor(data[0].startdate.getFullYear() / 100) * 100		);
					}
					_interval.date.setFullYear(_interval.date.getFullYear() + (inc_time * 100));
				} else if (_interval.type == "decade") {
					if (_first_run) {
						_interval.date.setFullYear(		Math.floor(data[0].startdate.getFullYear() / 10) * 10		);
					}
					_interval.date.setFullYear(_interval.date.getFullYear() + (inc_time * 10));
				} else if (interval.type == "year") {
					if (_first_run) {
						
					}
					_interval.date.setFullYear(_interval.date.getFullYear() + inc_time);
				} else if (_interval.type == "month") {
					if (_first_run) {
						_interval.date.setMonth(data[0].startdate.getMonth());
					}
					_interval.date.setMonth(_interval.date.getMonth() + inc_time);
				} else if (_interval.type == "week") {
					if (_first_run) {
						_interval.date.setMonth(		data[0].startdate.getMonth()		);
						_interval.date.setDate(		Math.floor(data[0].startdate.getDate() *7)			);
					}
					_interval.date.setDate(_interval.date.getDate() + (inc_time * 7) );
				} else if (_interval.type == "day") {
					if (_first_run) {
						_interval.date.setMonth(		data[0].startdate.getMonth()			);
						_interval.date.setDate(		data[0].startdate.getDate()				);
					}
					_interval.date.setDate(_interval.date.getDate() + inc_time);
				} else if (_interval.type == "hour") {
					if (_first_run) {
						_interval.date.setMonth(		data[0].startdate.getMonth()			);
						_interval.date.setDate(		data[0].startdate.getDate()				);
						_interval.date.setHours(		data[0].startdate.getHours()			);
					}
					_interval.date.setHours(_interval.date.getHours() + inc_time);
				} else if (_interval.type == "minute") {
					if (_first_run) {
						_interval.date.setMonth(		data[0].startdate.getMonth()			);
						_interval.date.setDate(		data[0].startdate.getDate()				);
						_interval.date.setHours(		data[0].startdate.getHours()			);
						_interval.date.setMinutes(	data[0].startdate.getMinutes()			);
					}
					_interval.date.setMinutes(_interval.date.getMinutes() + inc_time);
				} else if (_interval.type == "second") {
					if (_first_run) {
						_interval.date.setMonth(		data[0].startdate.getMonth()			);
						_interval.date.setDate(		data[0].startdate.getDate()				);
						_interval.date.setHours(		data[0].startdate.getHours()			);
						_interval.date.setMinutes(	data[0].startdate.getMinutes()			);
						_interval.date.setSeconds(	data[0].startdate.getSeconds()			);
					}
					_interval.date.setSeconds(_interval.date.getSeconds() + inc_time);
				}
				
				_idd = VMM.Date.prettyDate(_interval.date, true);
				
				inc_time = 1;
				
				_first_run = false;
				
				_relative_pos = positionRelative(interval, _interval.date);
				
				//_pos = positionOnTimeline(_interval, _interval.date);
				//pos = _pos.begin;
				pos = _relative_pos.begin;
				
				VMM.appendElement(_element, _idd);
				
				VMM.Lib.css(_element, "text-indent", -(VMM.Lib.width(_element)/2));
				VMM.Lib.css(_element, "opacity", "0");

				_last_pos = pos;
				
				if (pos > _largest_pos) {
					_largest_pos = pos;
				}
				
				_date = new Date(_interval.date);
				
				var _obj = {
					interval_element: 	_element,
					interval_date: 		_date,
					interval_visible: 	_visible, 
					type: 				_interval.interval_type,
					relative_pos:		_relative_pos,
					is_detached:		false,
					animation: {
						animate: false,
						pos: "",
						opacity: "100"
						
					}
				};
				
				_array.push(_obj);
			}
			
			VMM.Lib.width($timeintervalminor_minor, _largest_pos);
			
			positionInterval(_element_parent, _array);
			
			
			
		}
		
		/* BUILD
		================================================== */
		var build = function() {
			
			VMM.attachElement(layout, "");
			
			$timenav = 					VMM.appendAndGetElement(layout, "<div>", "timenav");
			$content = 					VMM.appendAndGetElement($timenav, "<div>", "content");
			$time = 					VMM.appendAndGetElement($timenav, "<div>", "time");
			$timeintervalminor = 		VMM.appendAndGetElement($time, "<div>", "time-interval-minor");
			$timeintervalminor_minor = 	VMM.appendAndGetElement($timeintervalminor, "<div>", "minor");
			$timeintervalmajor = 		VMM.appendAndGetElement($time, "<div>", "time-interval-major");
			$timeinterval = 			VMM.appendAndGetElement($time, "<div>", "time-interval");
			$timebackground = 			VMM.appendAndGetElement(layout, "<div>", "timenav-background");
			$timenavline = 				VMM.appendAndGetElement($timebackground, "<div>", "timenav-line");
			$timenavindicator = 		VMM.appendAndGetElement($timebackground, "<div>", "timenav-indicator");
			$timeintervalbackground = 	VMM.appendAndGetElement($timebackground, "<div>", "timenav-interval-background", "<div class='top-highlight'></div>");
			$toolbar = 					VMM.appendAndGetElement(layout, "<div>", "toolbar");
			
			buildInterval();
			buildMarkers();
			calculateMultiplier();
			positionMarkers();
			
			
			positionInterval($timeinterval, interval_array, false, true);
			positionInterval($timeintervalmajor, interval_major_array);
			//reSize(true);
			
			if (config.start_page) {
				$backhome = VMM.appendAndGetElement($toolbar, "<div>", "back-home", "<div class='icon'></div>");
				VMM.bindEvent(".back-home", onBackHome, "click");
				VMM.Lib.css($toolbar, "top", 27);
				VMM.Lib.attribute($backhome, "title", VMM.master_config.language.messages.return_to_title);
				VMM.Lib.attribute($backhome, "rel", "tooltip");
				
			}
			
			$zoomin = 					VMM.appendAndGetElement($toolbar, "<div>", "zoom-in", "<div class='icon'></div>");
			$zoomout = 					VMM.appendAndGetElement($toolbar, "<div>", "zoom-out", "<div class='icon'></div>");
			
			VMM.Lib.attribute($zoomin, "title", VMM.master_config.language.messages.expand_timeline);
			VMM.Lib.attribute($zoomin, "rel", "tooltip");
			VMM.Lib.attribute($zoomout, "title", VMM.master_config.language.messages.contract_timeline);
			VMM.Lib.attribute($zoomout, "rel", "tooltip");

			$toolbar.tooltip({selector: "div[rel=tooltip]", placement: "right"})
			
			// MAKE TIMELINE TOUCHABLE
			if (VMM.Browser.device == "mobile" || VMM.Browser.device == "tablet") {
				VMM.TouchSlider.createPanel($timebackground, $timenav, config.width, config.spacing, false);
				VMM.bindEvent($timenav, onTouchUpdate, "TOUCHUPDATE");
			} else {
				VMM.DragSlider.createPanel(layout, $timenav, config.width, config.spacing, false);
			}
			
			
			VMM.bindEvent(".zoom-in", onZoomIn, "click");
			VMM.bindEvent(".zoom-out", onZoomOut, "click");
			VMM.fireEvent(layout, "LOADED");
			_active = true;
			
			reSize(true);
			
		};
		
		var buildInterval = function() {
			
			// CALCULATE INTERVAL
			timespan = getDateFractions((data[data.length - 1].enddate) - (data[0].startdate), true);
			trace(timespan);
			calculateInterval();

			/* DETERMINE DEFAULT INTERVAL TYPE
				millenium, ages, epoch, era and eon are not working yet
			================================================== */
			/*
			if (timespan.eons				>		data.length / config.nav.density) {
				interval					=		interval_calc.eon;
				interval_major				=		interval_calc.eon;
				interval_macro				=		interval_calc.era;
			} else if (timespan.eras		>		data.length / config.nav.density) {
				interval					=		interval_calc.era;
				interval_major				=		interval_calc.eon;
				interval_macro				=		interval_calc.epoch;
			} else if (timespan.epochs		>		data.length / config.nav.density) {
				interval					=		interval_calc.epoch;
				interval_major				=		interval_calc.era;
				interval_macro				=		interval_calc.age;
			} else if (timespan.ages		>		data.length / config.nav.density) {
				interval					=		interval_calc.ages;
				interval_major				=		interval_calc.epoch;
				interval_macro				=		interval_calc.millenium;
			} else if (timespan.milleniums			>		data.length / config.nav.density) {
				interval					=		interval_calc.millenium;
				interval_major				=		interval_calc.age;
				interval_macro				=		interval_calc.century;
			} else 
			*/
			if (timespan.centuries			>		data.length / config.nav.density) {
				interval					=		interval_calc.century;
				interval_major				=		interval_calc.millenium;
				interval_macro				=		interval_calc.decade;
			} else if (timespan.decades		>		data.length / config.nav.density) {
				interval					=		interval_calc.decade;
				interval_major				=		interval_calc.century;
				interval_macro				=		interval_calc.year;
			} else if (timespan.years		>		data.length / config.nav.density) {	
				interval					=		interval_calc.year;
				interval_major				=		interval_calc.decade;
				interval_macro				=		interval_calc.month;
			} else if (timespan.months		>		data.length / config.nav.density) {
				interval					=		interval_calc.month;
				interval_major				=		interval_calc.year;
				interval_macro				=		interval_calc.day;
			} else if (timespan.days		>		data.length / config.nav.density) {
				interval					=		interval_calc.day;
				interval_major				=		interval_calc.month;
				interval_macro				=		interval_calc.hour;
			} else if (timespan.hours		>		data.length / config.nav.density) {
				interval					=		interval_calc.hour;
				interval_major				=		interval_calc.day;
				interval_macro				=		interval_calc.minute;
			} else if (timespan.minutes		>		data.length / config.nav.density) {
				interval					=		interval_calc.minute;
				interval_major				=		interval_calc.hour;
				interval_macro				=		interval_calc.second;
			} else if (timespan.seconds		>		data.length / config.nav.density) {
				interval					=		interval_calc.second;
				interval_major				=		interval_calc.minute;
				interval_macro				=		interval_calc.second;
			} else {
				trace("NO IDEA WHAT THE TYPE SHOULD BE");
				interval					=		interval_calc.day;
				interval_major				=		interval_calc.month;
				interval_macro				=		interval_calc.hour;
			}
			
			trace("INTERVAL TYPE: " + interval.type);
			trace("INTERVAL MAJOR TYPE: " + interval_major.type);
			
			createIntervalElements(interval, interval_array, $timeinterval);
			createIntervalElements(interval_major, interval_major_array, $timeintervalmajor);
			
		}
		
		var buildMarkers = function() {
			
			var row			= 2,
				lpos		= 0,
				row_depth	= 0;
				
			markers			= [];
			era_markers		= [];
			
			for(var i = 0; i < data.length; i++) {
				
				var _marker, _marker_flag, _marker_content, _marker_dot, _marker_line, _marker_line_event, _marker_title = "", has_title = false;
				
				_marker					= VMM.appendAndGetElement($content, "<div>", "marker");
				_marker_flag			= VMM.appendAndGetElement(_marker, "<div>", "flag");
				_marker_content			= VMM.appendAndGetElement(_marker_flag, "<div>", "flag-content");
				_marker_dot				= VMM.appendAndGetElement(_marker, "<div>", "dot");
				_marker_line			= VMM.appendAndGetElement(_marker, "<div>", "line");
				_marker_line_event		= VMM.appendAndGetElement(_marker_line, "<div>", "event-line");
				_marker_relative_pos	= positionRelative(interval, data[i].startdate, data[i].enddate);
				_marker_thumb			= "";
				
				// THUMBNAIL
				if (data[i].asset != null && data[i].asset != "") {
					VMM.appendElement(_marker_content, VMM.MediaElement.thumbnail(data[i].asset, 24, 24, data[i].uniqueid));
				} else {
					VMM.appendElement(_marker_content, "<div style='margin-right:7px;height:50px;width:2px;float:left;'></div>");
				}
				
				// ADD DATE AND TITLE
				if (data[i].title == "" || data[i].title == " " ) {
					trace("TITLE NOTHING")
					if (typeof data[i].slug != 'undefined' && data[i].slug != "") {
						trace("SLUG")
						_marker_title = VMM.Util.untagify(data[i].slug);
						has_title = true;
					} else {
						var m = VMM.MediaType(data[i].asset.media);
						if (m.type == "quote" || m.type == "unknown") {
							_marker_title = VMM.Util.untagify(m.id);
							has_title = true;
						} else if (m.type == "twitter") {
							has_title = false;
							VMM.appendElement(_marker_content, "<h3 id='text_thumb_" + m.id + "'>" + _marker_title + "</h3>");
						} else {
							has_title = false;
						}
					}
				} else if (data[i].title != "" || data[i].title != " ") {
					trace(data[i].title)
					_marker_title = VMM.Util.untagify(data[i].title);
					has_title = true;
				} else {
					trace("TITLE SLUG NOT FOUND " + data[i].slug)
				}

				
				if (has_title) {
					VMM.appendElement(_marker_content, "<h3>" + _marker_title + "</h3>");
				}
				
				// ADD ID
				VMM.Lib.attr(_marker, "id", ( "marker_" + data[i].uniqueid).toString() );
				
				// MARKER CLICK
				VMM.bindEvent(_marker_flag, onMarkerClick, "", {number: i});
				VMM.bindEvent(_marker_flag, onMarkerHover, "mouseenter mouseleave", {number: i, elem:_marker_flag});
				
				var _marker_obj = {
					marker: 			_marker,
					flag: 				_marker_flag,
					lineevent: 			_marker_line_event,
					type: 				"marker",
					relative_pos:		_marker_relative_pos,
					tag:				data[i].tag
				};
				
				
				if (data[i].type == "start") {
					trace("BUILD MARKER HAS START PAGE");
					config.start_page = true;
					_marker_obj.type = "start";
				}
				
				if (data[i].type == "storify") {
					_marker_obj.type = "storify";
				}
				
				
				if (data[i].tag) {
					tags.push(data[i].tag);
				}
				
				markers.push(_marker_obj);
				
				
				
			}
			
			// CREATE TAGS
			tags = VMM.Util.deDupeArray(tags);
			
			for(var k = 0; k < tags.length; k++) {
				if (k < config.nav.rows.length) {
					var tag_element = VMM.appendAndGetElement($timebackground, "<div>", "timenav-tag");
					VMM.Lib.addClass(tag_element, "timenav-tag-row-" + (k+1));
					VMM.appendElement(tag_element, "<div><h3>" + tags[k] + "</h3></div>");
				}
				
			}
			
			
			
			// CREATE ERAS
			for(var j = 0; j < eras.length; j++) {
				
				var era = {
					content: 			VMM.appendAndGetElement($content, "<div>", "era"),
					startdate: 			VMM.Util.parseDate(eras[j].startDate),
					enddate: 			VMM.Util.parseDate(eras[j].endDate),
					title: 				eras[j].headline,
					uniqueid: 			VMM.Util.unique_ID(4),
					color: 				eras[j].color,
					relative_pos:	 	""
				};
				
				era.relative_pos = positionRelative(interval, eras[j].startdate, eras[j].enddate);
				
				VMM.Lib.attr(era.content, "id", era.uniqueid);
				VMM.Lib.css(era.content, "background", era.color);
				VMM.appendElement(era.content, "<h3>" + VMM.Util.unlinkify(era.title) + "</h3>");
				
				era_markers.push(era);
				
			}
			
		}
		
	};
	
}