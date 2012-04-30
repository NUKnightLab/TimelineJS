/* LIBRARY ABSTRACTION
================================================== */
if(typeof VMM != 'undefined') {
	
	//VMM.attachElement(element, content);
	VMM.attachElement = function(element, content) {
		if( typeof( jQuery ) != 'undefined' ){
			$(element).html(content);
		}
		
	};
	//VMM.appendElement(element, content);
	VMM.appendElement = function(element, content) {
		
		if( typeof( jQuery ) != 'undefined' ){
			$(element).append(content);
		}
		
	};
	
	VMM.getHTML = function(element) {
		var e;
		if( typeof( jQuery ) != 'undefined' ){
			e = jQuery(element).html();
			return e;
		}
		
	};
	//VMM.getElement(element);
	VMM.getElement = function(element, p) {
		var e;
		if( typeof( jQuery ) != 'undefined' ){
			if (p) {
				e = jQuery(element).parent().get(0);
				
			} else {
				e = jQuery(element).get(0);
			}
			return e;
		}
		
	};
	//VMM.bindEvent(element, the_handler, the_event_type, event_data);
	//VMM.bindEvent(window, the_handler, "event type", {event_data});
	VMM.bindEvent = function(element, the_handler, the_event_type, event_data) {
		var e;
		var _event_type = "click";
		var _event_data = {};
		
		if (the_event_type != null && the_event_type != "") {
			_event_type = the_event_type;
		}
		
		if (_event_data != null && _event_data != "") {
			_event_data = event_data;
		}
		
		if( typeof( jQuery ) != 'undefined' ){
			jQuery(element).bind(_event_type, _event_data, the_handler);
			
			//return e;
		}
		
	};
	//VMM.unbindEvent(window, the_handler, "event type");
	VMM.unbindEvent = function(element, the_handler, the_event_type) {
		var e;
		var _event_type = "click";
		var _event_data = {};
		
		if (the_event_type != null && the_event_type != "") {
			_event_type = the_event_type;
		}
		
		if( typeof( jQuery ) != 'undefined' ){
			jQuery(element).unbind(_event_type, the_handler);
			
			//return e;
		}
		
	};
	//VMM.fireEvent(element, "resize", [data]);
	VMM.fireEvent = function(element, the_event_type, the_data) {
		var e;
		var _event_type = "click";
		var _data = [];
		
		if (the_event_type != null && the_event_type != "") {
			_event_type = the_event_type;
		}
		if (the_data != null && the_data != "") {
			_data = the_data;
		}
		
		if( typeof( jQuery ) != 'undefined' ){
			jQuery(element).trigger(_event_type, _data);
			
			//return e;
		}
		
	};

	// VMM.getJSON(url, the_function);
	VMM.getJSON = function(url, data, callback) {
		if( typeof( jQuery ) != 'undefined' ){
			
			/* CHECK FOR IE AND USE Use Microsoft XDR
			================================================== */
			if ( VMM.Browser.browser == "Explorer" && parseInt(VMM.Browser.version, 10) >= 7 && window.XDomainRequest) {
				trace("it's ie");
				var ie_url = url;

				if (ie_url.match('^http://')){
					trace("RUNNING GET JSON")
				     ie_url = ie_url.replace("http://","//");
					return jQuery.getJSON(url, data, callback);
				} else if (ie_url.match('^https://')) {
					trace("RUNNING XDR");
					ie_url = ie_url.replace("https://","http://");
					var xdr = new XDomainRequest();
					xdr.open("get", ie_url);
					xdr.onload = function() {
						var ie_json = VMM.parseJSON(xdr.responseText);
						trace(xdr.responseText);
						if (type.of(ie_json) == "null" || type.of(ie_json) == "undefined") {
							trace("IE JSON ERROR")
						} else {
							return data(ie_json)
						}								
								
					}
					xdr.send();
				} else {
					return jQuery.getJSON(url, data, callback);
				}
			} else {
				//$.getJSON(url, data);
				trace("getJSON");
				return jQuery.getJSON(url, data, callback);
				
				
			}
		}
	}
	// VMM.parseJSON(the_json);
	VMM.parseJSON = function(the_json) {
		if( typeof( jQuery ) != 'undefined' ){
			return jQuery.parseJSON(the_json);
		}
	}
	// ADD ELEMENT AND RETURN IT
	// VMM.appendAndGetElement(append_to_element, tag, cName, content, [attrib]);
	VMM.appendAndGetElement = function(append_to_element, tag, cName, content) {
		var e;
		var _tag = "<div>";
		var _class = "";
		var _content = "";

		
		if (tag != null && tag != "") {
			_tag = tag;
		}
		
		if (cName != null && cName != "") {
			_class = cName;
		}
		
		if (content != null && content != "") {
			_content = content;
		}
		
		if( typeof( jQuery ) != 'undefined' ){
			
			e = $(tag);
			
			e.addClass(_class);
			e.html(_content);
			
			jQuery(append_to_element).append(e);
			
			//$(e).appendTo(element);
			
		}
		
		return e;
		
	};
	
	VMM.Element = ({
		
		init: function() {
			return this;
		},
		// VMM.Element.hide(element);
		hide: function(element, duration) {
			if (duration != null && duration != "") {
				if( typeof( jQuery ) != 'undefined' ){
					jQuery(element).hide(duration);
				}
			} else {
				if( typeof( jQuery ) != 'undefined' ){
					jQuery(element).hide();
				}
			}
			
		},
		// VMM.Element.remove(element);
		remove: function(element) {
			if( typeof( jQuery ) != 'undefined' ){
				jQuery(element).remove();
			}
		},
		// VMM.Element.detach(element);
		detach: function(element) {
			if( typeof( jQuery ) != 'undefined' ){
				jQuery(element).detach();
			}
		},
		// VMM.Element.append(element, value);
		append: function(element, value) {
			if( typeof( jQuery ) != 'undefined' ){
				jQuery(element).append(value);
			}
		},
		// VMM.Element.show(element);
		show: function(element, duration) {
			if (duration != null && duration != "") {
				if( typeof( jQuery ) != 'undefined' ){
					jQuery(element).show(duration);
				}
			} else {
				if( typeof( jQuery ) != 'undefined' ){
					jQuery(element).show();
				}
			}
			
		},
		// VMM.Element.load(element, callback_function, event_data);
		load: function(element, callback_function, event_data) {
			var _event_data = {elem:element}; // return element by default
			if (_event_data != null && _event_data != "") {
				_event_data = event_data;
			}
			if( typeof( jQuery ) != 'undefined' ){
				jQuery(element).load(_event_data, callback_function);
			}
		},
		//VMM.Element.addClass(element, cName);
		addClass: function(element, cName) {
			if( typeof( jQuery ) != 'undefined' ){
				jQuery(element).addClass(cName);
			}
		},
		//VMM.Element.removeClass(element, cName);
		removeClass: function(element, cName) {
			if( typeof( jQuery ) != 'undefined' ){
				jQuery(element).removeClass(cName);
			}
		},
		//VMM.Element.attr(element, aName, value);
		attr: function(element, aName, value) {
			if (value != null && value != "") {
				if( typeof( jQuery ) != 'undefined' ){
					jQuery(element).attr(aName, value);
				}
			} else {
				if( typeof( jQuery ) != 'undefined' ){
					return jQuery(element).attr(aName);
				}
			}
		},
		//VMM.Element.prop(element, aName, value);
		prop: function(element, aName, value) {
			if (typeof jQuery == 'undefined' || !/[1-9]\.[3-9].[1-9]/.test($.fn.jquery)) {
			    VMM.Element.attribute(element, aName, value);
			} else {
				jQuery(element).prop(aName, value);
			}
		},
		//VMM.Element.attribute(element, aName, value);
		attribute: function(element, aName, value) {
			
			if (value != null && value != "") {
				if( typeof( jQuery ) != 'undefined' ){
					jQuery(element).attr(aName, value);
				}
			} else {
				if( typeof( jQuery ) != 'undefined' ){
					return jQuery(element).attr(aName);
				}
			}
		},
		/* Sets  or gets the visability of a dom element
		================================================== */
		//VMM.Element.visible(element, show);
		visible: function(element, show) {
			if (show != null) {
				if( typeof( jQuery ) != 'undefined' ){
					if (show) {
						jQuery(element).show(0);
					} else {
						jQuery(element).hide(0);
					}
				}
			} else {
				if( typeof( jQuery ) != 'undefined' ){
					if ( jQuery(element).is(':visible')){
						return true;
					} else {
						return false;
					}
				}
			}
		},
		/* Sets a style for the specified element or gets the style
		================================================== */
		//VMM.Element.css(element, prop, value);
		css: function(element, prop, value) {

			if (value != null && value != "") {
				if( typeof( jQuery ) != 'undefined' ){
					jQuery(element).css(prop, value);
				}
			} else {
				if( typeof( jQuery ) != 'undefined' ){
					return jQuery(element).css(prop);
				}
			}
		},
		
		cssmultiple: function(element, propval) {

			if( typeof( jQuery ) != 'undefined' ){
				return jQuery(element).css(propval);
			}
		},
		/* Gets offset
		================================================== */
		//VMM.Element.offset(element);
		offset: function(element) {
			var p;
			if( typeof( jQuery ) != 'undefined' ){
				p = jQuery(element).offset();
			}
			return p;
		},
		/* Gets position
		================================================== */
		//VMM.Element.position(element);
		position: function(element) {
			var p;
			if( typeof( jQuery ) != 'undefined' ){
				p = jQuery(element).position();
			}
			return p;
		},
		/* Sets  or gets the width of a dom element
		================================================== */
		//VMM.Element.width(element, s);
		width: function(element, s) {
			if (s != null && s != "") {
				if( typeof( jQuery ) != 'undefined' ){
					jQuery(element).width(s);
				}
			} else {
				if( typeof( jQuery ) != 'undefined' ){
					return jQuery(element).width();
				}
			}
		},
		/* Sets  or gets the width of a dom element
		================================================== */
		height: function(element, s) {
			if (s != null && s != "") {
				if( typeof( jQuery ) != 'undefined' ){
					jQuery(element).height(s);
				}
			} else {
				if( typeof( jQuery ) != 'undefined' ){
					return jQuery(element).height();
				}
			}
		},
		/* TOGGLE CLASS
		================================================== */
		// VMM.Element.toggleClass(element, cName);
		toggleClass: function(element, cName) {
			if( typeof( jQuery ) != 'undefined' ){
				jQuery(element).toggleClass(cName);
			}
		},
		/* Each
		================================================== */
		// VMM.Element.each(element, return_function);
		each:function(element, return_function) {
			if( typeof( jQuery ) != 'undefined' ){
				jQuery(element).each(return_function);
			}
			
		},
		/* Each
		================================================== */
		// VMM.Element.html(element, str);
		html: function(element, str) {
			var e;
			if( typeof( jQuery ) != 'undefined' ){
				e = jQuery(element).html();
				return e;
			}
			
			if (str != null && str != "") {
				if( typeof( jQuery ) != 'undefined' ){
					jQuery(element).html(str);
				}
			} else {
				var e;
				if( typeof( jQuery ) != 'undefined' ){
					e = jQuery(element).html();
					return e;
				}
			}

		},
		/* Find
		================================================== */
		// VMM.Element.find(element, selec);
		find: function(element, selec) {
			if( typeof( jQuery ) != 'undefined' ){
				return jQuery(element).find(selec);
			}
		},
		/* Animate
		================================================== */
		// VMM.Element.stop(element);
		stop: function(element) {
			if( typeof( jQuery ) != 'undefined' ){
				jQuery(element).stop();
			}
		},
		// VMM.Element.animate(element, duration, ease, att, callback_function);
		animate: function(element, duration, ease, att, callback_function) {
			
			var _ease = "easein";
			var _duration = 1000;
			var _att = {};
			
			if (duration != null) {
				if (duration < 1) {
					_duration = 1;
				} else {
					_duration = Math.round(duration);
				}
				
			}
			
			if (ease != null && ease != "") {
				_ease = ease;
			}
			
			if (att != null) {
				_att = att
			} else {
				_att = {opacity: 0}
			}
			
			
			if (VMM.Browser.device == "mobile" || VMM.Browser.device == "tablet") {
				
				var _tdd = Math.round((_duration/1500)*10)/10
				var __duration = _tdd + 's';
				VMM.Element.css(element, '-webkit-transition', 'all '+ __duration + ' ease');
				VMM.Element.css(element, '-moz-transition', 'all '+ __duration + ' ease');
				VMM.Element.css(element, '-o-transition', 'all '+ __duration + ' ease');
				VMM.Element.css(element, '-ms-transition', 'all '+ __duration + ' ease');
				VMM.Element.css(element, 'transition', 'all '+ __duration + ' ease');
				VMM.Element.cssmultiple(element, _att);
				
				//callback_function();
				/*
				if( typeof( jQuery ) != 'undefined' ){
					if (callback_function != null && callback_function != "") {
						jQuery(element).animate(_att, {queue:false, duration:_duration, easing:_ease, complete:callback_function} );
					} else {
						jQuery(element).animate(_att, {queue:false, duration:_duration, easing:_ease} );
					}
				}
				*/
				
			} else {
				if( typeof( jQuery ) != 'undefined' ){
					if (callback_function != null && callback_function != "") {
						jQuery(element).animate(_att, {queue:false, duration:_duration, easing:_ease, complete:callback_function} );
					} else {
						jQuery(element).animate(_att, {queue:false, duration:_duration, easing:_ease} );
					}
				}
			}
			
			
			/*
			VMM.Element.cssmultiple(element, {
				'-webkit-transition': 'all 1s ease-in-out',
				'-moz-transition': 'all 1s ease-in-out',
				'-o-transition': 'all 1s ease-in-out',
				'-ms-transition': 'all 1s ease-in-out',
				'transition': 'all 1s ease-in-out',
				
			});
			*/
		},
		
	}).init();
}

/*	jQuery Easing v1.3
	http://gsgd.co.uk/sandbox/jquery/easing/
================================================== */
if( typeof( jQuery ) != 'undefined' ){
	
	jQuery.easing['jswing'] = jQuery.easing['swing'];

	jQuery.extend( jQuery.easing, {
		def: 'easeOutQuad',
		swing: function (x, t, b, c, d) {
			//alert(jQuery.easing.default);
			return jQuery.easing[jQuery.easing.def](x, t, b, c, d);
		},
		easeInExpo: function (x, t, b, c, d) {
			return (t==0) ? b : c * Math.pow(2, 10 * (t/d - 1)) + b;
		},
		easeOutExpo: function (x, t, b, c, d) {
			return (t==d) ? b+c : c * (-Math.pow(2, -10 * t/d) + 1) + b;
		},
		easeInOutExpo: function (x, t, b, c, d) {
			if (t==0) return b;
			if (t==d) return b+c;
			if ((t/=d/2) < 1) return c/2 * Math.pow(2, 10 * (t - 1)) + b;
			return c/2 * (-Math.pow(2, -10 * --t) + 2) + b;
		},
		easeInQuad: function (x, t, b, c, d) {
			return c*(t/=d)*t + b;
		},
		easeOutQuad: function (x, t, b, c, d) {
			return -c *(t/=d)*(t-2) + b;
		},
		easeInOutQuad: function (x, t, b, c, d) {
			if ((t/=d/2) < 1) return c/2*t*t + b;
			return -c/2 * ((--t)*(t-2) - 1) + b;
		},
	});
}
