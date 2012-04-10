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
		/* Parse Date
		================================================== */
		// VMM.Util.parseDate(str)
		parseDate: function(d) {
			var _date;
			
			if ( d.match(/,/gi) ) {
				

				var _d_array = d.split(",");
				
				
				for(var i = 0; i < _d_array.length; i++) {
					_d_array[i] = parseInt(_d_array[i]);
					
				}
				
				_date = new Date();
				if (_d_array[0]			) {	_date.setFullYear(_d_array[0]);			}
				if (_d_array[1]	> 1		) {	_date.setMonth(_d_array[1] - 1);		}	else {		_date.setMonth(0);				}
				if (_d_array[2]	> 1		) {	_date.setDate(_d_array[2]);				}	else {		_date.setDate(1);				}
				if (_d_array[3]	> 1		) {	_date.setHours(_d_array[3]);			}	else {		_date.setHours(0);				}
				if (_d_array[4]	> 1		) {	_date.setMinutes(_d_array[4]);			}	else {		_date.setMinutes(0);			}
				if (_d_array[5]	> 1		) {	_date.setSeconds(_d_array[5]);			}	else {		_date.setSeconds(0);			}
				if (_d_array[6]	> 1		) {	_date.setMilliseconds(_d_array[6]);		}	else {		_date.setMilliseconds(0);		}
			} else if (d.match("/")) {
				_date = new Date(d);
			} else if (d.length < 5) {
				_date = new Date();
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
		},
		/* Get the corresponding ratio number
		================================================== */
		// VMM.Util.ratio.r16_9(w, h) // Returns corresponding number
		ratio: {
			r16_9: function(w,h) {
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
		// VMM.Util.date.day[0];
		// VMM.Util.date.get12HRTime(time, seconds_true);
		date: {
			// somestring = VMM.Util.date.month[2]; // Returns March
			month: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
			// somestring = VMM.Util.date.month_abbrev[1]; // Returns Feb.
			month_abbr: ["Jan.", "Feb.", "March", "April", "May", "June", "July", "Aug.", "Sept.", "Oct.", "Nov.", "Dec."],
			day: ["Sunday","Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
			day_abbr: ["Sun.","Mon.", "Tues.", "Wed.", "Thurs.", "Fri.", "Sat."],
			hour: [1,2,3,4,5,6,7,8,9,10,11,12,1,2,3,4,5,6,7,8,9,10,11,12],
			hour_suffix: ["am"],
			//VMM.Util.date.prettyDate(d, is_abbr)
			prettyDate: function(d, is_abbr, date_type) {
				var _date = "";
				
				if (type.of(d) == "date") {
					if (d.getMonth() === 0 && d.getDate() == 1 && d.getHours() === 0 && d.getMinutes() === 0 ) {
						// trace("YEAR ONLY");
						_date = d.getFullYear();
					} else {
						if (d.getDate() <= 1 && d.getHours() === 0 && d.getMinutes() === 0) {
							// trace("YEAR MONTH");
							if (is_abbr) {
								_date = VMM.Util.date.month_abbr[d.getMonth()];
								
							} else {
								_date = VMM.Util.date.month[d.getMonth()] + " " + d.getFullYear() ;
							}
							
						} else if (d.getHours() === 0 && d.getMinutes() === 0) {
							// trace("YEAR MONTH DAY");
							if (is_abbr) {
								_date = VMM.Util.date.month_abbr[d.getMonth()] + " " + d.getDate();
							} else {
								_date = VMM.Util.date.month[d.getMonth()] + " " + d.getDate() + ", " + d.getFullYear() ;
							}
						} else  if (d.getMinutes() === 0) {
							// trace("YEAR MONTH DAY HOUR");
							if (is_abbr){
								//_date = VMM.Util.date.get12HRTime(d) + " " + (d.getMonth()+1) + "/" + d.getDate() + "/" + d.getFullYear() ;
								_date = VMM.Util.date.get12HRTime(d);
							} else {
								_date = VMM.Util.date.get12HRTime(d) + "<br/><small>" + VMM.Util.date.month[d.getMonth()] + " " + d.getDate() + ", " + d.getFullYear() + " </small> ";
							}
						} else {
							// trace("YEAR MONTH DAY HOUR MINUTE");
							if (is_abbr){
								_date = VMM.Util.date.day[d.getDay()] + ", " + VMM.Util.date.month_abbr[d.getMonth()] + " " + d.getDate() + ", " + d.getFullYear() + " at " + VMM.Util.date.get12HRTime(d);
							} else {
								_date = VMM.Util.date.get12HRTime(d) + "<br/><small>" + VMM.Util.date.day[d.getDay()] + ", " + VMM.Util.date.month[d.getMonth()] + " " + d.getDate() + ", " + d.getFullYear() + " </small> ";
							}
						}
						
					}	
					//_date = d.getFullYear();
					
					
				} else {
					trace("NOT A VALID DATE?");
					trace(d);
				}
				
				return _date;
			},
			
			prettyMonth: function(m, is_year) {
				var _month = "";
				if (type.of(t) == "date") {
					
					
				}
				return _month;
			},
			
			get12HRTime: function(t, is_seconds) {
				var _time = "";
				
				if (type.of(t) == "date") {
					
					_time = VMM.Util.date.theHour(t.getHours()) + ":" + VMM.Util.date.minuteZeroFill(t.getMinutes());
					
					if (is_seconds) {
						_time = _time + ":" + VMM.Util.date.minuteZeroFill(t.getSeconds());
					}
					
					_time = _time +  VMM.Util.date.hourSuffix(t.getHours());
					
				}
				
				return _time;
			},

			theHour: function(hr) {
				if (hr > 0 && hr < 13) {
					return (hr);
				}
				if (hr == "0") {
					hr = 12;
					return (hr);
				}
				if (hr === 0) {
					return (12);
				}
				return (hr-12);
			},
			minuteZeroFill: function(v) {
				if (v > 9) {
					return "" + v;
				}
				return "0" + v;
			},
			hourSuffix: function(t) {
				if (t < 12) {
					return (" am");
				}
				return (" pm");
			}
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
			var url_replace = '$1$4$7$10$13<a href="$2$5$8$11$14">$2$5$8$11$14</a>$3$6$9$12';
			//return text.replace(url_pattern, url_replace);

			// www. sans http:// or https://
			var pseudoUrlPattern = /(^|[^\/])(www\.[\S]+(\b|$))/gim;

			// Email addresses
			var emailAddressPattern = /(([a-zA-Z0-9_\-\.]+)@[a-zA-Z_]+?(?:\.[a-zA-Z]{2,6}))+/gim;
			
			var twitterHandlePattern = /(@([\w]+))/g;
			
			var twitterSearchPattern = /(#([\w]+))/g;

			return text
				//.replace(urlPattern, "<a target='_blank' href='$&' onclick='void(0)'>$&</a>")
				.replace(url_pattern, url_replace)
				.replace(pseudoUrlPattern, "$1<a target='_blank' onclick='void(0)' href='http://$2'>$2</a>")
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
	}
	
}