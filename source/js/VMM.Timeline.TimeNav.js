/* 	TIMELINE NAVIGATION
================================================== */

if(typeof VMM.Timeline != 'undefined' && typeof VMM.Timeline.TimeNav == 'undefined') {
	
	VMM.Timeline.TimeNav = function(parent, content_width, content_height) {
		trace("VMM.Timeline.TimeNav");
		
		var events = {}, timespan = {}, layout = parent;
		var data = [], era_markers = [], markers = [], interval_array = [], interval_major_array = [], eras, content;
		
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
		$timeintervalbackground, $timenavline, $timeintervalminor_minor, $toolbar, $zoomin, $zoomout;
		
		/* ADD to Config
		================================================== */
		var config				= 	VMM.Timeline.Config;
		config.nav.rows			= 	[config.nav.marker.height, config.nav.marker.height*2, 1];
		
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
			goToMarker(current_marker, config.ease, config.duration, true, firstrun);
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
			positionInterval(interval_array, true, true);
			positionInterval(interval_major_array, true);
		};
		
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
		
		var goToMarker = function(n, ease, duration, fast, firstrun) {
			
			current_marker = 	n;
			var _ease = 		config.ease;
			var _duration = 	config.duration;
			var is_last = 		false;
			var is_first = 		false;
			var _pos = 			VMM.Element.position(markers[current_marker].marker);
			
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
				VMM.Element.removeClass(markers[i].marker, "active");
			}
			
			if (config.start_page && markers[current_marker].type == "start") {
				VMM.Element.visible(markers[current_marker].marker, false);
				VMM.Element.addClass(markers[current_marker].marker, "start");
			}
			
			VMM.Element.addClass(markers[current_marker].marker, "active");
			
			// ANIMATE MARKER
			VMM.Element.stop($timenav);
			VMM.Element.animate($timenav, _duration, _ease, {"left": (config.width/2) - (_pos.left)});
			
		}
		
		/* TOUCH EVENTS
		================================================== */
		function onTouchUpdate(e, b) {
			VMM.Element.animate($timenav, b.time/2, config.ease, {"left": b.left});
		};
		
		/* CALCULATIONS
		================================================== */
		var averageMarkerPositionDistance = function() {
			var last_pos = 		0;
			var pos = 			0;
			var pos_dif = 		0;
			var mp_diff = 		[];
			
			for(var i = 0; i < markers.length; i++) {
				if (data[i].type == "start") {
					
				} else {
					var _pos = positionOnTimeline(interval, data[i].startdate, data[i].enddate);
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
		var positionOnTimeline = function(the_interval, first, last) {
			
			var _type = the_interval.type;
			var _multiplier = the_interval.multiplier;
			
			var _first = getDateFractions(first);
			var _last;
			
			var tsd;
			var ted;
			/* CALCULATE POSITION ON TIMELINE
			================================================== */
			tsd = first.months;
			
			if (type.of(last) == "date") {
				
				/* LAST
				================================================== */
				_last = getDateFractions(last);
				ted = last.months;
				
				if (_type == "eon") {
					tsd = _first.eons;
					ted = _last.eons;
				} else if (_type == "era") {
					tsd = _first.eras;
					ted = _last.eras;
				} else if (_type == "epoch") {
					tsd = _first.epochs;
					ted = _last.epochs;
				} else if (_type == "age") {
					tsd = _first.ages;
					ted = _last.ages;
				} else if (_type == "millenium") {
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
				
				_pos = 		( tsd	 - 	interval.base	 ) * (config.nav.interval_width		/	 config.nav.multiplier.current);
				_pos_end = 	( ted	 - 	interval.base	 ) * (config.nav.interval_width		/	 config.nav.multiplier.current);
				
			} else {
				if (_type == "eon") {
					tsd = _first.eons;
					ted = _first.eons;
				} else if (_type == "era") {
					tsd = _first.eras;
					ted = _first.eras;
				} else if (_type == "epoch") {
					tsd = _first.epochs;
					ted = _first.epochs;
				} else if (_type == "age") {
					tsd = _first.ages;
					ted = _first.ages;
				} else if (_type == "millenium") {
					tsd = first.milleniums;
					ted = first.milleniums;
				} else if (_type == "century") {
					tsd = _first.centuries;
					ted = _first.centuries;
				} else if (_type == "decade") {
					tsd = _first.decades;
					ted = _first.decades;
				} else if (_type == "year") {
					tsd = _first.years;
					ted = _first.years;
				} else if (_type == "month") {
					tsd = _first.months;
					ted = _first.months;
				} else if (_type == "week") {
					tsd = _first.weeks;
					ted = _first.weeks;
				} else if (_type == "day") {
					tsd = _first.days;
					ted = _first.days;
				} else if (_type == "hour") {
					tsd = _first.hours;
					ted = _first.hours;
				} else if (_type == "minute") {
					tsd = _first.minutes;
					ted = _first.minutes;
				}
				
				_pos = 		( tsd	 - 	interval.base	 ) * (config.nav.interval_width		/	 config.nav.multiplier.current);
				_pos_end = 	_pos;
				
			}
			
			return pos = {begin:_pos ,end:_pos_end};
			
		}
		
		var positionMarkers = function(is_animated) {
			
			var _type = interval.type;
			var _multiplier = interval.multiplier;
			
			// ROWS
			var row = 						2; //row
			var lpos = 						0; // last marker pos;
			var row_depth = 				0;
			var _line_last_height_pos = 	150;
			var _line_height = 				6;
			var cur_mark = 					0;
			
			VMM.Element.removeClass(".flag", "row1");
			VMM.Element.removeClass(".flag", "row2");
			VMM.Element.removeClass(".flag", "row3");
			
			for(var i = 0; i < markers.length; i++) {
				
				var _line; // EVENT LENGTH
				var _marker = 				markers[i].marker;
				var _marker_flag = 			markers[i].flag;
				var _marker_line_event = 	markers[i].lineevent;
				var _pos = 					positionOnTimeline(interval, data[i].startdate, data[i].enddate);
				var _pos_offset = 			-2;
				
				pos = 						_pos.begin;
				_pos_end = 					_pos.end;
				
				// COMPENSATE FOR DATES BEING POITIONED IN THE MIDDLE
				pos = 						Math.round(pos +  _pos_offset);
				_pos_end = 					Math.round(_pos_end + _pos_offset);
				_line = 					Math.round(_pos_end - pos);
				
				// APPLY POSITION TO MARKER
				if (is_animated) {
					VMM.Element.stop(_marker);
					VMM.Element.animate(_marker, config.duration/2, config.ease, {"left": pos});
				} else {
					VMM.Element.css(_marker, "left", pos);
				}
				
				if (i == current_marker) {
					cur_mark = pos;
				}
				
				// EVENT LENGTH LINE
				if (_line > 5) {
					VMM.Element.css(_marker_line_event, "height", _line_height);
					VMM.Element.css(_marker_line_event, "width", _line);
					VMM.Element.css(_marker_line_event, "top", _line_last_height_pos);
				}
				
				// CONTROL ROW POSITION
				if (pos - lpos < (config.nav.marker.width + config.spacing)) {
					if (row < config.nav.rows.length - 1) {
						row ++;
						
					} else {
						row = 0;
						row_depth ++;
					}
				} else {
					row_depth = 0;
					row = 0;
				}
				
				// SET LAST MARKER POSITION
				lpos = pos;
				
				if (is_animated) {
					VMM.Element.stop(_marker_flag);
					VMM.Element.animate(_marker_flag, config.duration, config.ease, {"top": config.nav.rows[row]});
				} else {
					VMM.Element.css(_marker_flag, "top", config.nav.rows[row]);
				}
				
				// IS THE MARKER A REPRESENTATION OF A START SCREEN?
				if (config.start_page && markers[i].type == "start") {
					VMM.Element.visible(_marker, false);
				}
				
			}
			
			for(var j = 0; j < era_markers.length; j++) {
				var _line;
				var era = 				era_markers[j];
				var era_elem = 			era.content;
				var pos = 				positionOnTimeline(interval, era.startdate, era.enddate);
				var era_length = 		pos.end - pos.begin;
				var era_height = 		25;
				
				// APPLY POSITION TO MARKER
				VMM.Element.css(era_elem, "left", pos.begin);
				VMM.Element.css(era_elem, "width", era_length);
			}
			
			
			// ANIMATE THE TIMELINE TO ADJUST TO CHANGES
			VMM.Element.stop($timenav);
			VMM.Element.animate($timenav, config.duration/2, config.ease, {"left": (config.width/2) - (cur_mark)});

		
		}
		
		var positionInterval = function(the_intervals, is_animated, is_minor) {
			
			var _type = interval.type;
			var _multiplier = interval.multiplier;
			var last_position = 0;
			var last_position_major = 0;
			
			for(var i = 0; i < the_intervals.length; i++) {
				var _interval = the_intervals[i].interval_element;
				var _interval_date = the_intervals[i].interval_date;
				var _interval_visible = the_intervals[i].interval_visible;
				var _pos = positionOnTimeline(interval, _interval_date);
				var pos = _pos.begin;
				var is_visible = true;
				var pos_offset = 50;
				
				// APPLY POSITION TO MARKER
				if (is_animated) {
					VMM.Element.animate(_interval, config.duration/2, config.ease, {"left": pos});
				} else {
					VMM.Element.css(_interval, "left", pos);
				}
				
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
				
				if (_interval_visible) {
					if (!is_visible) {
						if (is_animated) {
							VMM.Element.animate(_interval, config.duration*2, config.ease, {"opacity": 0});
						} else {
							VMM.Element.css(_interval, "opacity", 0);
						}
						the_intervals[i].interval_visible = false;
					}
				} else {
					if (is_visible) {
						if (is_animated) {
							VMM.Element.animate(_interval, config.duration*2, config.ease, {"opacity": 100});
						} else {
							VMM.Element.css(_interval, "opacity", 100);
						}
						the_intervals[i].interval_visible = true;
					}
				}
				
				last_position = pos;
				
				if (pos > config.nav.minor_width) {
					config.nav.minor_width = pos;
				}
				
			}
			
			VMM.Element.css($timeintervalminor_minor, "left", -(config.width/2));
			VMM.Element.width($timeintervalminor_minor, (config.nav.minor_width)+(config.width) );
		}
		
		var createIntervalElements = function(_interval, _array, _element_parent) {
			
			var inc_time = 0;
			var _first_run = true;
			var _last_pos = 0;
			var _largest_pos = 0;
			
			VMM.attachElement(_element_parent, "");
			
			_interval.date = new Date(data[0].startdate.getFullYear(), 0, 1, 0,0,0);
			
			for(var i = 0; i < Math.ceil(_interval.number) + 1; i++) {
				var _idd;
				var _pos;
				var pos;
				var _element = VMM.appendAndGetElement(_element_parent, "<div>", _interval.classname);
				var _date;
				var _visible = false;
				
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
				
				_idd = VMM.Util.date.prettyDate(_interval.date, true, _interval.type);
				
				inc_time = 1;
				
				_first_run = false;
				
				_pos = positionOnTimeline(_interval, _interval.date);
				pos = _pos.begin;
				
				VMM.appendElement(_element, _idd);
				
				VMM.Element.css(_element, "text-indent", -(VMM.Element.width(_element)/2));
				VMM.Element.css(_element, "opacity", "0");

				_last_pos = pos;
				
				if (pos > _largest_pos) {
					_largest_pos = pos;
				}
				
				_date = new Date(_interval.date);
				
				var _obj = {
					interval_element: 	_element,
					interval_date: 		_date,
					interval_visible: 	_visible, 
					type: 				_interval.interval_type
				};
				
				_array.push(_obj);
				
			}
			
			VMM.Element.width($timeintervalminor_minor, _largest_pos);
			
			positionInterval(_array);
			
			
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
			$timeintervalbackground = 	VMM.appendAndGetElement($timebackground, "<div>", "timenav-interval-background", "<div class='top-highlight'></div>");
			$toolbar = 					VMM.appendAndGetElement(layout, "<div>", "toolbar");
			
			buildInterval();
			buildMarkers();
			calculateMultiplier();
			positionMarkers();
			positionInterval(interval_array, false, true);
			positionInterval(interval_major_array);
			reSize(true);
			
			if (config.start_page) {
				$backhome = VMM.appendAndGetElement($toolbar, "<div>", "back-home", "<div class='icon'></div>");
				VMM.bindEvent(".back-home", onBackHome, "click");
				VMM.Element.css($toolbar, "top", 27);
				VMM.Element.attribute($backhome, "title", VMM.Timeline.Config.language.messages.return_to_title);
				VMM.Element.attribute($backhome, "rel", "tooltip");
				
			}
			
			$zoomin = 					VMM.appendAndGetElement($toolbar, "<div>", "zoom-in", "<div class='icon'></div>");
			$zoomout = 					VMM.appendAndGetElement($toolbar, "<div>", "zoom-out", "<div class='icon'></div>");
			
			VMM.Element.attribute($zoomin, "title", VMM.Timeline.Config.language.messages.expand_timeline);
			VMM.Element.attribute($zoomin, "rel", "tooltip");
			VMM.Element.attribute($zoomout, "title", VMM.Timeline.Config.language.messages.contract_timeline);
			VMM.Element.attribute($zoomout, "rel", "tooltip");

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
			
			var row = 					2; //row
			var lpos = 					0; // last marker pos;
			var row_depth = 			0;
			
			for(var i = 0; i < data.length; i++) {
				
				var _marker, _marker_flag, _marker_content, _marker_dot, _marker_line, _marker_line_event;
				
				_marker = 				VMM.appendAndGetElement($content, "<div>", "marker");
				_marker_flag = 			VMM.appendAndGetElement(_marker, "<div>", "flag");
				_marker_content = 		VMM.appendAndGetElement(_marker_flag, "<div>", "flag-content");
				_marker_dot = 			VMM.appendAndGetElement(_marker, "<div>", "dot");
				_marker_line = 			VMM.appendAndGetElement(_marker, "<div>", "line");
				_marker_line_event = 	VMM.appendAndGetElement(_marker_line, "<div>", "event-line");
				
				
				// THUMBNAIL
				if (data[i].asset != null && data[i].asset != "") {
					VMM.appendElement(_marker_content, VMM.MediaElement.thumbnail(data[i].asset, 32, 32));
				}
				
				// ADD DATE AND TITLE
				VMM.appendElement(_marker_content, "<h3>" + VMM.Util.unlinkify(data[i].title) + "</h3><h4>" + data[i].date + "</h4>");
				
				// ADD ID
				VMM.Element.attr(_marker, "id", (data[i].uniqueid).toString());
				
				// MARKER CLICK
				VMM.bindEvent(_marker_flag, onMarkerClick, "", {number: i});
				VMM.bindEvent(_marker_flag, onMarkerHover, "mouseenter mouseleave", {number: i, elem:_marker_flag});
				
				var _marker_obj = {
					marker: 			_marker,
					flag: 				_marker_flag,
					lineevent: 			_marker_line_event,
					type: 				"marker"
				};
				
				
				if (data[i].type == "start") {
					trace("BUILD MARKER HAS START PAGE")
					config.start_page = true;
					_marker_obj.type = "start";
				}
				
				markers.push(_marker_obj);
				
				
				
			}
			
			// CREATE ERAS
			for(var j = 0; j < eras.length; j++) {
				
				var era = {
					content: 			VMM.appendAndGetElement($content, "<div>", "era"),
					startdate: 			VMM.Util.parseDate(eras[j].startDate),
					enddate: 			VMM.Util.parseDate(eras[j].endDate),
					title: 				eras[j].headline,
					uniqueid: 			VMM.Util.unique_ID(4),
					color: 				eras[j].color
				};
				
				VMM.Element.attr(era.content, "id", era.uniqueid);
				VMM.Element.css(era.content, "background", era.color);
				VMM.appendElement(era.content, "<h3>" + VMM.Util.unlinkify(era.title) + "</h3>");
				
				era_markers.push(era);
				
			}
			
		}
		
	};
	
}