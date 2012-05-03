/* Utilities and Useful Functions
================================================== */
if(typeof VMM != 'undefined' && typeof VMM.Util == 'undefined') {
	
	VMM.Util = ({
		
		init: function() {
			return this;
		},

		/* RANDOM BETWEEN
		================================================== */
		//VMM.Util.randomBetween(1, 3)
		randomBetween: function(min, max) {
			return Math.floor(Math.random() * (max - min + 1) + min);
		},
		
		/* AVERAGE
			http://jsfromhell.com/array/average
			var x = VMM.Util.average([2, 3, 4]);
			VMM.Util.average([2, 3, 4]).mean
		================================================== */
		average: function(a) {
		    var r = {mean: 0, variance: 0, deviation: 0}, t = a.length;
		    for(var m, s = 0, l = t; l--; s += a[l]);
		    for(m = r.mean = s / t, l = t, s = 0; l--; s += Math.pow(a[l] - m, 2));
		    return r.deviation = Math.sqrt(r.variance = s / t), r;
		},
		
		/* CUSTOM SORT
		================================================== */
		
		customSort: function(a, b) {
			var a1= a, b1= b;
			if(a1== b1) return 0;
			return a1> b1? 1: -1;
		},
		
		/* Given an int or decimal, turn that into string in $xxx,xxx.xx format.
		================================================== */
		number2money: function(n, symbol, padding) {
			var symbol = (symbol !== null) ? symbol : true; // add $
			var padding = (padding !== null) ? padding : false; //pad with .00
			var number = VMM.Math2.floatPrecision(n,2); // rounded correctly to two digits, if decimals passed
			var formatted = this.niceNumber(number);
			// no decimal and padding is enabled
			if (!formatted.split(/\./g)[1] && padding) formatted = formatted + ".00";
			// add money sign
			if (symbol) formatted = "$"+formatted;
			return formatted;
		},
		
		
		/* Returns a word count number
		================================================== */
		wordCount: function(s) {
			var fullStr = s + " ";
			var initial_whitespace_rExp = /^[^A-Za-z0-9\'\-]+/gi;
			var left_trimmedStr = fullStr.replace(initial_whitespace_rExp, "");
			var non_alphanumerics_rExp = /[^A-Za-z0-9\'\-]+/gi;
			var cleanedStr = left_trimmedStr.replace(non_alphanumerics_rExp, " ");
			var splitString = cleanedStr.split(" ");
			var word_count = splitString.length -1;
			if (fullStr.length <2) {
				word_count = 0;
			}
			return word_count;
		},
		
		ratio: {
			fit: function(w, h, ratio_w, ratio_h) {
				//VMM.Util.ratio.fit(w, h, ratio_w, ratio_h).width;
				var _fit = {width:0,height:0};
				// TRY WIDTH FIRST
				_fit.width = w;
				//_fit.height = Math.round((h / ratio_h) * ratio_w);
				_fit.height = Math.round((w / ratio_w) * ratio_h);
				if (_fit.height > h) {
					_fit.height = h;
					//_fit.width = Math.round((w / ratio_w) * ratio_h);
					_fit.width = Math.round((h / ratio_h) * ratio_w);
					
					if (_fit.width > w) {
						trace("FIT: DIDN'T FIT!!! ")
					}
				}
				
				return _fit;
				
			},
			r16_9: function(w,h) {
				//VMM.Util.ratio.r16_9(w, h) // Returns corresponding number
				if (w !== null && w !== "") {
					return Math.round((h / 16) * 9);
				} else if (h !== null && h !== "") {
					return Math.round((w / 9) * 16);
				}
			},
			r4_3: function(w,h) {
				if (w !== null && w !== "") {
					return Math.round((h / 4) * 3);
				} else if (h !== null && h !== "") {
					return Math.round((w / 3) * 4);
				}
			}
		},
		
		date: {
			dateformats: {
				year: "yyyy",
				month_short: "mmm",
				month: "mmmm yyyy",
				full_short: "mmm d",
				full: "mmmm d',' yyyy",
				time_no_seconds_short: "h:MM TT",
				time_no_seconds_small_date: "dddd', 'h:MM TT'<br/><small>'mmmm d',' yyyy'</small>'",
				full_long: "dddd',' mmm d',' yyyy 'at' hh:MM TT",
				full_long_small_date: "hh:MM TT'<br/><small>'dddd',' mmm d',' yyyy'</small>'",
			},
			month: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
			month_abbr: ["Jan.", "Feb.", "March", "April", "May", "June", "July", "Aug.", "Sept.", "Oct.", "Nov.", "Dec."],
			day: ["Sunday","Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
			day_abbr: ["Sun.","Mon.", "Tues.", "Wed.", "Thurs.", "Fri.", "Sat."],
			hour: [1,2,3,4,5,6,7,8,9,10,11,12,1,2,3,4,5,6,7,8,9,10,11,12],
			hour_suffix: ["am"],
			
			//B.C.
			bc_format: {
				year: "yyyy",
				month_short: "mmm",
				month: "mmmm yyyy",
				full_short: "mmm d",
				full: "mmmm d',' yyyy",
				time_no_seconds_short: "h:MM TT",
				time_no_seconds_small_date: "dddd', 'h:MM TT'<br/><small>'mmmm d',' yyyy'</small>'",
				full_long: "dddd',' mmm d',' yyyy 'at' hh:MM TT",
				full_long_small_date: "hh:MM TT'<br/><small>'dddd',' mmm d',' yyyy'</small>'",
			},
			
			setLanguage: function(lang) {
				trace("SET DATE LANGUAGE");
				VMM.Util.date.dateformats	=	lang.dateformats;	
				VMM.Util.date.month			=	lang.date.month;
				VMM.Util.date.month_abbr	=	lang.date.month_abbr;
				VMM.Util.date.day			=	lang.date.day;
				VMM.Util.date.day_abbr		=	lang.date.day_abbr;
				dateFormat.i18n.dayNames	=	lang.date.day_abbr.concat(lang.date.day);
				dateFormat.i18n.monthNames	=	lang.date.month_abbr.concat(lang.date.month);
			},
			
			parse: function(d) {
				if (type.of(d) == "date") {
					return d;
				} else {
					var _date = new Date(0, 0, 1, 0, 0, 0, 0);
					var _d_array; // DATE ARRAY
					var _t_array; // TIME ARRAY
					if ( d.match(/,/gi) ) {
						_d_array = d.split(",");
						for(var i = 0; i < _d_array.length; i++) {
							_d_array[i] = parseInt(_d_array[i]);
						}
						if (	_d_array[0]			) {	_date.setFullYear(		_d_array[0]);			}
						if (	_d_array[1]	> 1		) {	_date.setMonth(			_d_array[1] - 1);		}
						if (	_d_array[2]	> 1		) {	_date.setDate(			_d_array[2]);			}
						if (	_d_array[3]	> 1		) {	_date.setHours(			_d_array[3]);			}
						if (	_d_array[4]	> 1		) {	_date.setMinutes(		_d_array[4]);			}
						if (	_d_array[5]	> 1		) {	_date.setSeconds(		_d_array[5]);			}
						if (	_d_array[6]	> 1		) {	_date.setMilliseconds(	_d_array[6]);			}
					} else if (d.match("/")) {
						var _time_parse;
						var _times;
						if (d.match(" ")) {
							_time_parse = d.split(" ");
							if (d.match(":")) {
								_t_array = _time_parse[1].split(":");
								if (	_t_array[0]	>= 1	) {		_date.setHours(			_t_array[0]);	}
								if (	_t_array[1]	>= 1	) {		_date.setMinutes(		_t_array[1]);	}
								if (	_t_array[2]	>= 1	) {		_date.setSeconds(		_t_array[2]);	}
								if (	_t_array[3]	>= 1	) {		_date.setMilliseconds(	_t_array[3]);	}
							}
							_d_array = _time_parse[0].split("/");
						} else {
							_d_array = d.split("/");
						}
						if (	_d_array[2]			) {	_date.setFullYear(		_d_array[2]);			}
						if (	_d_array[0]	> 1		) {	_date.setMonth(			_d_array[0] - 1);		}
						if (	_d_array[1]	> 1		) {	_date.setDate(			_d_array[1]);			}
					} else if (d.length < 5) {
						_date.setFullYear(parseInt(d));
						_date.setMonth(0);
						_date.setDate(1);
						_date.setHours(0);
						_date.setMinutes(0);
						_date.setSeconds(0);
						_date.setMilliseconds(0);
					}else {
						_date = new Date(
							parseInt(d.slice(0,4)), 
							parseInt(d.slice(4,6)) - 1, 
							parseInt(d.slice(6,8)), 
							parseInt(d.slice(8,10)), 
							parseInt(d.slice(10,12))
						);
					}
					return _date;
				}
			},
			
			//VMM.Util.date.prettyDate(d, is_abbr)
			prettyDate: function(d, is_abbr, date_type) {
				var _date;
				var bc_check;
				
				if (type.of(d) == "date") {
					if (d.getMonth() === 0 && d.getDate() == 1 && d.getHours() === 0 && d.getMinutes() === 0 ) {
						// trace("YEAR ONLY");
						_date = dateFormat(d, VMM.Util.date.dateformats.year);
					} else {
						if (d.getDate() <= 1 && d.getHours() === 0 && d.getMinutes() === 0) {
							// trace("YEAR MONTH");
							if (is_abbr) {
								_date = dateFormat(d, VMM.Util.date.dateformats.month_short );
								
							} else {
								_date = dateFormat(d, VMM.Util.date.dateformats.month);
							}
							
						} else if (d.getHours() === 0 && d.getMinutes() === 0) {
							// trace("YEAR MONTH DAY");
							if (is_abbr) {
								_date = dateFormat(d, VMM.Util.date.dateformats.full_short);
							} else {
								_date = dateFormat(d, VMM.Util.date.dateformats.full);
							}
						} else  if (d.getMinutes() === 0) {
							// trace("YEAR MONTH DAY HOUR");
							if (is_abbr) {
								_date = dateFormat(d, VMM.Util.date.dateformats.time_no_seconds_short);
							} else {
								_date = dateFormat(d, VMM.Util.date.dateformats.time_no_seconds_small_date );
							}
						} else {
							// trace("YEAR MONTH DAY HOUR MINUTE");
							if (is_abbr){
								_date = dateFormat(d, VMM.Util.date.dateformats.time_no_seconds_short);   
							} else {
								_date = dateFormat(d, VMM.Util.date.dateformats.full_long);
							}
						}
						
					}
					
					bc_check = _date.split(" ");
				
					for(var i = 0; i < bc_check.length; i++) {
						if ( parseInt(bc_check[i]) < 0 ) {
							trace("YEAR IS BC");
							var bc_original = 	bc_check[i];
							var bc_number = 	Math.abs( parseInt(bc_check[i]) );
							var bc_string = 	bc_number.toString() + " B.C.";
						
							_date = _date.replace(bc_original, bc_string);
						}
					}
					
					
				} else {
					trace("NOT A VALID DATE?");
					trace(d);
				}
				
				
				return _date;
			},
			
		},
		
		// VMM.Util.doubledigit(number).
		doubledigit: function(n) {
			return (n < 10 ? '0' : '') + n;
		},
		
		
		/* Returns a truncated segement of a long string of between min and max words. If possible, ends on a period (otherwise goes to max).
		================================================== */
		truncateWords: function(s, min, max) {
			
			if (!min) min = 30;
			if (!max) max = min;
			
			var initial_whitespace_rExp = /^[^A-Za-z0-9\'\-]+/gi;
			var left_trimmedStr = s.replace(initial_whitespace_rExp, "");
			var words = left_trimmedStr.split(" ");
			
			var result = [];
			
			min = Math.min(words.length, min);
			max = Math.min(words.length, max);
			
			for (var i = 0; i<min; i++) {
				result.push(words[i]);
			}		
			
			for (var j = min; i<max; i++) {
				var word = words[i];
				
				result.push(word);
				
				if (word.charAt(word.length-1) == '.') {
					break;
				}
			}		
			
			return (result.join(' '));
		},
		
		/* Turns plain text links into real links
		================================================== */
		// VMM.Util.linkify();
		linkify: function(text,targets,is_touch) {
			
			// http://, https://, ftp://
			var urlPattern = /\b(?:https?|ftp):\/\/[a-z0-9-+&@#\/%?=~_|!:,.;]*[a-z0-9-+&@#\/%=~_|]/gim;

			// www. sans http:// or https://
			var pseudoUrlPattern = /(^|[^\/])(www\.[\S]+(\b|$))/gim;

			// Email addresses
			var emailAddressPattern = /(([a-zA-Z0-9_\-\.]+)@[a-zA-Z_]+?(?:\.[a-zA-Z]{2,6}))+/gim;
			

			return text
				.replace(urlPattern, "<a target='_blank' href='$&' onclick='void(0)'>$&</a>")
				.replace(pseudoUrlPattern, "$1<a target='_blank' onclick='void(0)' href='http://$2'>$2</a>")
				.replace(emailAddressPattern, "<a target='_blank' onclick='void(0)' href='mailto:$1'>$1</a>");
		},
		
		linkify_with_twitter: function(text,targets,is_touch) {
			
			// http://, https://, ftp://
			var urlPattern = /\b(?:https?|ftp):\/\/[a-z0-9-+&@#\/%?=~_|!:,.;]*[a-z0-9-+&@#\/%=~_|]/gim;
			var url_pattern = /(\()((?:ht|f)tps?:\/\/[a-z0-9\-._~!$&'()*+,;=:\/?#[\]@%]+)(\))|(\[)((?:ht|f)tps?:\/\/[a-z0-9\-._~!$&'()*+,;=:\/?#[\]@%]+)(\])|(\{)((?:ht|f)tps?:\/\/[a-z0-9\-._~!$&'()*+,;=:\/?#[\]@%]+)(\})|(<|&(?:lt|#60|#x3c);)((?:ht|f)tps?:\/\/[a-z0-9\-._~!$&'()*+,;=:\/?#[\]@%]+)(>|&(?:gt|#62|#x3e);)|((?:^|[^=\s'"\]])\s*['"]?|[^=\s]\s+)(\b(?:ht|f)tps?:\/\/[a-z0-9\-._~!$'()*+,;=:\/?#[\]@%]+(?:(?!&(?:gt|#0*62|#x0*3e);|&(?:amp|apos|quot|#0*3[49]|#x0*2[27]);[.!&',:?;]?(?:[^a-z0-9\-._~!$&'()*+,;=:\/?#[\]@%]|$))&[a-z0-9\-._~!$'()*+,;=:\/?#[\]@%]*)*[a-z0-9\-_~$()*+=\/#[\]@%])/img;
			var url_replace = '$1$4$7$10$13<a href="$2$5$8$11$14" class="hyphenate">$2$5$8$11$14</a>$3$6$9$12';
			
			// www. sans http:// or https://
			var pseudoUrlPattern = /(^|[^\/])(www\.[\S]+(\b|$))/gim;
			function replaceURLWithHTMLLinks(text) {
			    var exp = /(\b(https?|ftp|file):\/\/([-A-Z0-9+&@#%?=~_|!:,.;]*)([-A-Z0-9+&@#%?\/=~_|!:,.;]*)[-A-Z0-9+&@#\/%=~_|])/ig;
			    return text.replace(exp, "<a href='$1' target='_blank'>$3</a>");
			}
			// Email addresses
			var emailAddressPattern = /(([a-zA-Z0-9_\-\.]+)@[a-zA-Z_]+?(?:\.[a-zA-Z]{2,6}))+/gim;
			
			var twitterHandlePattern = /(@([\w]+))/g;
			
			var twitterSearchPattern = /(#([\w]+))/g;

			return text
				//.replace(urlPattern, "<a target='_blank' href='$&' onclick='void(0)'>$&</a>")
				.replace(url_pattern, url_replace)
				.replace(pseudoUrlPattern, "$1<a target='_blank' class='hyphenate' onclick='void(0)' href='http://$2'>$2</a>")
				.replace(emailAddressPattern, "<a target='_blank' onclick='void(0)' href='mailto:$1'>$1</a>")
				.replace(twitterHandlePattern, "<a href='http://twitter.com/$2' target='_blank' onclick='void(0)'>$1</a>")
				.replace(twitterSearchPattern, "<a href='http://twitter.com/#search?q=%23$2' target='_blank' 'void(0)'>$1</a>");
		},
		
		/* Turns plain text links into real links
		================================================== */
		// VMM.Util.unlinkify();
		unlinkify: function(text) {
			if(!text) return text;
			text = text.replace(/<a\b[^>]*>/i,"");
			text = text.replace(/<\/a>/i, "");
			return text;
		},
		
		/* TK
		================================================== */
		nl2br: function(text) {
			return text.replace(/(\r\n|[\r\n]|\\n|\\r)/g,"<br/>");
		},
		
		/* Generate a Unique ID
		================================================== */
		// VMM.Util.unique_ID(size);
		unique_ID: function(size) {
			
			var getRandomNumber = function(range) {
				return Math.floor(Math.random() * range);
			};

			var getRandomChar = function() {
				var chars = "abcdefghijklmnopqurstuvwxyzABCDEFGHIJKLMNOPQURSTUVWXYZ";
				return chars.substr( getRandomNumber(62), 1 );
			};

			var randomID = function(size) {
				var str = "";
				for(var i = 0; i < size; i++) {
					str += getRandomChar();
				}
				return str;
			};
			
			return randomID(size);
		},
		/* Tells you if a number is even or not
		================================================== */
		// VMM.Util.isEven(n)
		isEven: function(n){
			return (n%2 === 0) ? true : false;
		},
		/* Get URL Variables
		================================================== */
		//	var somestring = VMM.Util.getUrlVars(str_url)["varname"];
		getUrlVars: function(string) {
			
			var str = string.toString();
			
			if (str.match('&#038;')) { 
				str = str.replace("&#038;", "&");
			} else if (str.match('&#38;')) {
				str = str.replace("&#38;", "&");
			} else if (str.match('&amp;')) {
				str = str.replace("&amp;", "&");
			}
			
			var vars = [], hash;
			var hashes = str.slice(str.indexOf('?') + 1).split('&');
			for(var i = 0; i < hashes.length; i++) {
				hash = hashes[i].split('=');
				vars.push(hash[0]);
				vars[hash[0]] = hash[1];
			}
			
			
			return vars;
		},

		/* Cleans up strings to become real HTML
		================================================== */
		toHTML: function(text) {
			
			text = this.nl2br(text);
			text = this.linkify(text);
			
			return text.replace(/\s\s/g,"&nbsp;&nbsp;");
		},
		
		/* Returns text strings as CamelCase
		================================================== */
		toCamelCase: function(s,forceLowerCase) {
			
			if(forceLowerCase !== false) forceLowerCase = true;
			
			var sps = ((forceLowerCase) ? s.toLowerCase() : s).split(" ");
			
			for(var i=0; i<sps.length; i++) {
				
				sps[i] = sps[i].substr(0,1).toUpperCase() + sps[i].substr(1);
			}
			
			return sps.join(" ");
		},
		
		/* Replaces dumb quote marks with smart ones
		================================================== */
		properQuotes: function(str) {
			return str.replace(/\"([^\"]*)\"/gi,"&#8220;$1&#8221;");
		},
		/* Given an int or decimal, return a string with pretty commas in the correct spot.
		================================================== */
		niceNumber: function(n){
		
			var amount = String( Math.abs(Number(n) ) );
		    
			var leftOfDecimal = amount.split(/\./g)[0];
			var rightOfDecimal = amount.split(/\./g)[1];
		    
			var formatted_text = '';
		    
			var num_a = leftOfDecimal.toArray();
			num_a.reverse();
		    
			for (var i=1; i <= num_a.length; i++) {
				if ( (i%3 == 0) && (i < num_a.length ) ) {
					formatted_text = "," + num_a[i-1] + formatted_text;
				} else {
					formatted_text = num_a[i-1] + formatted_text;
				}
		    }
			if (rightOfDecimal != null && rightOfDecimal != '' && rightOfDecimal != undefined) {
				return formatted_text + "." + rightOfDecimal;
			} else {
				return formatted_text;
			}
		},
		
		/* Transform text to Title Case
		================================================== */
		toTitleCase: function(t){
			
			var __TitleCase = {
				__smallWords: ['a', 'an', 'and', 'as', 'at', 'but','by', 'en', 'for', 'if', 'in', 'of', 'on', 'or','the', 'to', 'v[.]?', 'via', 'vs[.]?'],

				init: function() {
					this.__smallRE = this.__smallWords.join('|');
					this.__lowerCaseWordsRE = new RegExp('\\b(' + this.__smallRE + ')\\b', 'gi');
					this.__firstWordRE = new RegExp('^([^a-zA-Z0-9 \\r\\n\\t]*)(' + this.__smallRE + ')\\b', 'gi');
					this.__lastWordRE = new RegExp('\\b(' + this.__smallRE + ')([^a-zA-Z0-9 \\r\\n\\t]*)$', 'gi');
				},

				toTitleCase: function(string) {
					var line = '';

					var split = string.split(/([:.;?!][ ]|(?:[ ]|^)["“])/);

					for (var i = 0; i < split.length; ++i) {
						var s = split[i];

						s = s.replace(/\b([a-zA-Z][a-z.'’]*)\b/g,this.__titleCaseDottedWordReplacer);

		 				// lowercase the list of small words
						s = s.replace(this.__lowerCaseWordsRE, this.__lowerReplacer);

						// if the first word in the title is a small word then capitalize it
						s = s.replace(this.__firstWordRE, this.__firstToUpperCase);

						// if the last word in the title is a small word, then capitalize it
						s = s.replace(this.__lastWordRE, this.__firstToUpperCase);

						line += s;
					}

					// special cases
					line = line.replace(/ V(s?)\. /g, ' v$1. ');
					line = line.replace(/(['’])S\b/g, '$1s');
					line = line.replace(/\b(AT&T|Q&A)\b/ig, this.__upperReplacer);

					return line;
				},

				__titleCaseDottedWordReplacer: function (w) {
					return (w.match(/[a-zA-Z][.][a-zA-Z]/)) ? w : __TitleCase.__firstToUpperCase(w);
				},

				__lowerReplacer: function (w) { return w.toLowerCase() },

				__upperReplacer: function (w) { return w.toUpperCase() },

				__firstToUpperCase: function (w) {
					var split = w.split(/(^[^a-zA-Z0-9]*[a-zA-Z0-9])(.*)$/);
					split[1] = split[1].toUpperCase();
					return split.join('');
				},
			};

			__TitleCase.init();
			
			t = t.replace(/_/g," ");
			t = __TitleCase.toTitleCase(t);
			
			return t;
		},
		
	}).init();
	
	//'string'.linkify();
	if(!String.linkify) {
		String.prototype.linkify = function() {

			// http://, https://, ftp://
			var urlPattern = /\b(?:https?|ftp):\/\/[a-z0-9-+&@#\/%?=~_|!:,.;]*[a-z0-9-+&@#\/%=~_|]/gim;

			// www. sans http:// or https://
			var pseudoUrlPattern = /(^|[^\/])(www\.[\S]+(\b|$))/gim;

			// Email addresses
			var emailAddressPattern = /(([a-zA-Z0-9_\-\.]+)@[a-zA-Z_]+?(?:\.[a-zA-Z]{2,6}))+/gim;
			
			var twitterHandlePattern = /(@([\w]+))/g;
			
			var twitterSearchPattern = /(#([\w]+))/g;

			return this
				.replace(urlPattern, '<a target="_blank" href="$&">$&</a>')
				.replace(pseudoUrlPattern, '$1<a target="_blank" href="http://$2">$2</a>')
				.replace(emailAddressPattern, '<a target="_blank" href="mailto:$1">$1</a>')
				.replace(twitterHandlePattern, "<a href='http://twitter.com/$2' target='_blank'>$1</a>")
				.replace(twitterSearchPattern, "<a href='http://twitter.com/#search?q=%23$2' target='_blank'>$1</a>");
	    };
	};
	//str.substr(3,4)
	/*
	 * Date Format 1.2.3
	 * (c) 2007-2009 Steven Levithan <stevenlevithan.com>
	 * MIT license
	 *
	 * Includes enhancements by Scott Trenda <scott.trenda.net>
	 * and Kris Kowal <cixar.com/~kris.kowal/>
	 *
	 * Accepts a date, a mask, or a date and a mask.
	 * Returns a formatted version of the given date.
	 * The date defaults to the current date/time.
	 * The mask defaults to dateFormat.masks.default.
	 */

	var dateFormat = function () {
		var	token = /d{1,4}|m{1,4}|yy(?:yy)?|([HhMsTt])\1?|[LloSZ]|"[^"]*"|'[^']*'/g,
			timezone = /\b(?:[PMCEA][SDP]T|(?:Pacific|Mountain|Central|Eastern|Atlantic) (?:Standard|Daylight|Prevailing) Time|(?:GMT|UTC)(?:[-+]\d{4})?)\b/g,
			timezoneClip = /[^-+\dA-Z]/g,
			pad = function (val, len) {
				val = String(val);
				len = len || 2;
				while (val.length < len) val = "0" + val;
				return val;
			};

		// Regexes and supporting functions are cached through closure
		return function (date, mask, utc) {
			var dF = dateFormat;

			// You can't provide utc if you skip other args (use the "UTC:" mask prefix)
			if (arguments.length == 1 && Object.prototype.toString.call(date) == "[object String]" && !/\d/.test(date)) {
				mask = date;
				date = undefined;
			}

			// Passing date through Date applies Date.parse, if necessary
			date = date ? new Date(date) : new Date;
			if (isNaN(date)) throw SyntaxError("invalid date");

			mask = String(dF.masks[mask] || mask || dF.masks["default"]);

			// Allow setting the utc argument via the mask
			if (mask.slice(0, 4) == "UTC:") {
				mask = mask.slice(4);
				utc = true;
			}

			var	_ = utc ? "getUTC" : "get",
				d = date[_ + "Date"](),
				D = date[_ + "Day"](),
				m = date[_ + "Month"](),
				y = date[_ + "FullYear"](),
				H = date[_ + "Hours"](),
				M = date[_ + "Minutes"](),
				s = date[_ + "Seconds"](),
				L = date[_ + "Milliseconds"](),
				o = utc ? 0 : date.getTimezoneOffset(),
				flags = {
					d:    d,
					dd:   pad(d),
					ddd:  dF.i18n.dayNames[D],
					dddd: dF.i18n.dayNames[D + 7],
					m:    m + 1,
					mm:   pad(m + 1),
					mmm:  dF.i18n.monthNames[m],
					mmmm: dF.i18n.monthNames[m + 12],
					yy:   String(y).slice(2),
					yyyy: y,
					h:    H % 12 || 12,
					hh:   pad(H % 12 || 12),
					H:    H,
					HH:   pad(H),
					M:    M,
					MM:   pad(M),
					s:    s,
					ss:   pad(s),
					l:    pad(L, 3),
					L:    pad(L > 99 ? Math.round(L / 10) : L),
					t:    H < 12 ? "a"  : "p",
					tt:   H < 12 ? "am" : "pm",
					T:    H < 12 ? "A"  : "P",
					TT:   H < 12 ? "AM" : "PM",
					Z:    utc ? "UTC" : (String(date).match(timezone) || [""]).pop().replace(timezoneClip, ""),
					o:    (o > 0 ? "-" : "+") + pad(Math.floor(Math.abs(o) / 60) * 100 + Math.abs(o) % 60, 4),
					S:    ["th", "st", "nd", "rd"][d % 10 > 3 ? 0 : (d % 100 - d % 10 != 10) * d % 10]
				};

			return mask.replace(token, function ($0) {
				return $0 in flags ? flags[$0] : $0.slice(1, $0.length - 1);
			});
		};
	}();

	// Some common format strings
	dateFormat.masks = {
		"default":      "ddd mmm dd yyyy HH:MM:ss",
		shortDate:      "m/d/yy",
		mediumDate:     "mmm d, yyyy",
		longDate:       "mmmm d, yyyy",
		fullDate:       "dddd, mmmm d, yyyy",
		shortTime:      "h:MM TT",
		mediumTime:     "h:MM:ss TT",
		longTime:       "h:MM:ss TT Z",
		isoDate:        "yyyy-mm-dd",
		isoTime:        "HH:MM:ss",
		isoDateTime:    "yyyy-mm-dd'T'HH:MM:ss",
		isoUtcDateTime: "UTC:yyyy-mm-dd'T'HH:MM:ss'Z'"
	};

	// Internationalization strings
	dateFormat.i18n = {
		dayNames: [
			"Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat",
			"Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"
		],
		monthNames: [
			"Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
			"January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"
		]
	};

	// For convenience...
	Date.prototype.format = function (mask, utc) {
		return dateFormat(this, mask, utc);
	};
	
}