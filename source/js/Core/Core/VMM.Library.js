/*	* LIBRARY ABSTRACTION
================================================== */
if(typeof VMM != 'undefined') {
	
	VMM.smoothScrollTo = function(elem, duration, ease) {
		if( typeof( jQuery ) != 'undefined' ){
			var _ease		= "easein",
				_duration	= 1000;
		
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
			
			if (jQuery(window).scrollTop() != VMM.Lib.offset(elem).top) {
				VMM.Lib.animate('html,body', _duration, _ease, {scrollTop: VMM.Lib.offset(elem).top})
			}
			
		}
		
	};
	
	VMM.attachElement = function(element, content) {
		if( typeof( jQuery ) != 'undefined' ){
			jQuery(element).html(content);
		}
		
	};
	
	VMM.appendElement = function(element, content) {
		
		if( typeof( jQuery ) != 'undefined' ){
			jQuery(element).append(content);
		}
		
	};
	
	VMM.getHTML = function(element) {
		var e;
		if( typeof( jQuery ) != 'undefined' ){
			e = jQuery(element).html();
			return e;
		}
		
	};
	
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
	
	VMM.getJSON = function(url, data, callback) {
		if( typeof( jQuery ) != 'undefined' ){
			jQuery.ajaxSetup({
			     timeout: 3000
			});
			/* CHECK FOR IE
			================================================== */
			if ( VMM.Browser.browser == "Explorer" && 
				 parseInt(VMM.Browser.version, 10) >= 7 && 
				 window.XDomainRequest && 
				 url.match('^https?://')) {
				trace("old IE JSON doesn't like retrieving from different protocol");
					var colon = url.indexOf(':');
					url = url.substr(colon+1); 
			}
			return jQuery.getJSON(url, data, callback);

		}
	}
	
	VMM.parseJSON = function(the_json) {
		if( typeof( jQuery ) != 'undefined' ){
			return jQuery.parseJSON(the_json);
		}
	}
	
	// ADD ELEMENT AND RETURN IT
	VMM.appendAndGetElement = function(append_to_element, tag, cName, content) {
		var e,
			_tag		= "<div>",
			_class		= "",
			_content	= "",
			_id			= "";
		
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
			
			e = jQuery(tag);
			
			e.addClass(_class);
			e.html(_content);
			
			jQuery(append_to_element).append(e);
			
		}
		
		return e;
		
	};
	
	VMM.Lib = {
		
		init: function() {
			return this;
		},
		
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
		
		remove: function(element) {
			if( typeof( jQuery ) != 'undefined' ){
				jQuery(element).remove();
			}
		},
		
		detach: function(element) {
			if( typeof( jQuery ) != 'undefined' ){
				jQuery(element).detach();
			}
		},
		
		append: function(element, value) {
			if( typeof( jQuery ) != 'undefined' ){
				jQuery(element).append(value);
			}
		},
		
		prepend: function(element, value) {
			if( typeof( jQuery ) != 'undefined' ){
				jQuery(element).prepend(value);
			}
		},
		
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
		
		load: function(element, callback_function, event_data) {
			var _event_data = {elem:element}; // return element by default
			if (_event_data != null && _event_data != "") {
				_event_data = event_data;
			}
			if( typeof( jQuery ) != 'undefined' ){
				jQuery(element).load(_event_data, callback_function);
			}
		},
		
		addClass: function(element, cName) {
			if( typeof( jQuery ) != 'undefined' ){
				jQuery(element).addClass(cName);
			}
		},
		
		removeClass: function(element, cName) {
			if( typeof( jQuery ) != 'undefined' ){
				jQuery(element).removeClass(cName);
			}
		},
		
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
		
		prop: function(element, aName, value) {
			if (typeof jQuery == 'undefined' || !/[1-9]\.[3-9].[1-9]/.test(jQuery.fn.jquery)) {
			    VMM.Lib.attribute(element, aName, value);
			} else {
				jQuery(element).prop(aName, value);
			}
		},
		
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
		
		offset: function(element) {
			var p;
			if( typeof( jQuery ) != 'undefined' ){
				p = jQuery(element).offset();
			}
			return p;
		},
		
		position: function(element) {
			var p;
			if( typeof( jQuery ) != 'undefined' ){
				p = jQuery(element).position();
			}
			return p;
		},
		
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
		
		toggleClass: function(element, cName) {
			if( typeof( jQuery ) != 'undefined' ){
				jQuery(element).toggleClass(cName);
			}
		},
		
		each:function(element, return_function) {
			if( typeof( jQuery ) != 'undefined' ){
				jQuery(element).each(return_function);
			}
			
		},
		
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
		
		find: function(element, selec) {
			if( typeof( jQuery ) != 'undefined' ){
				return jQuery(element).find(selec);
			}
		},
		
		stop: function(element) {
			if( typeof( jQuery ) != 'undefined' ){
				jQuery(element).stop();
			}
		},
		
		delay_animate: function(delay, element, duration, ease, att, callback_function) {
			if (VMM.Browser.device == "mobile" || VMM.Browser.device == "tablet") {
				var _tdd		= Math.round((duration/1500)*10)/10,
					__duration	= _tdd + 's';
					
				VMM.Lib.css(element, '-webkit-transition', 'all '+ __duration + ' ease');
				VMM.Lib.css(element, '-moz-transition', 'all '+ __duration + ' ease');
				VMM.Lib.css(element, '-o-transition', 'all '+ __duration + ' ease');
				VMM.Lib.css(element, '-ms-transition', 'all '+ __duration + ' ease');
				VMM.Lib.css(element, 'transition', 'all '+ __duration + ' ease');
				VMM.Lib.cssmultiple(element, _att);
			} else {
				if( typeof( jQuery ) != 'undefined' ){
					jQuery(element).delay(delay).animate(att, {duration:duration, easing:ease} );
				}
			}
			
		},
		
		animate: function(element, duration, ease, att, que, callback_function) {
			
			var _ease		= "easein",
				_que		= false,
				_duration	= 1000,
				_att		= {};
			
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
			
			if (que != null && que != "") {
				_que = que;
			}
			
			
			if (att != null) {
				_att = att
			} else {
				_att = {opacity: 0}
			}
			
			
			if (VMM.Browser.device == "mobile" || VMM.Browser.device == "tablet") {
				
				var _tdd		= Math.round((_duration/1500)*10)/10,
					__duration	= _tdd + 's';
					
				_ease = " cubic-bezier(0.33, 0.66, 0.66, 1)";
				//_ease = " ease-in-out";
				for (x in _att) {
					if (Object.prototype.hasOwnProperty.call(_att, x)) {
						trace(x + " to " + _att[x]);
						VMM.Lib.css(element, '-webkit-transition',  x + ' ' + __duration + _ease);
						VMM.Lib.css(element, '-moz-transition', x + ' ' + __duration + _ease);
						VMM.Lib.css(element, '-o-transition', x + ' ' + __duration + _ease);
						VMM.Lib.css(element, '-ms-transition', x + ' ' + __duration + _ease);
						VMM.Lib.css(element, 'transition', x + ' ' + __duration + _ease);
					}
				}
				
				VMM.Lib.cssmultiple(element, _att);
				
			} else {
				if( typeof( jQuery ) != 'undefined' ){
					if (callback_function != null && callback_function != "") {
						jQuery(element).animate(_att, {queue:_que, duration:_duration, easing:_ease, complete:callback_function} );
					} else {
						jQuery(element).animate(_att, {queue:_que, duration:_duration, easing:_ease} );
					}
				}
			}
			
		}
		
	}
}

if( typeof( jQuery ) != 'undefined' ){
	
	/*	XDR AJAX EXTENTION FOR jQuery
		https://github.com/jaubourg/ajaxHooks/blob/master/src/ajax/xdr.js
	================================================== */
	(function( jQuery ) {
		if ( window.XDomainRequest ) {
			jQuery.ajaxTransport(function( s ) {
				if ( s.crossDomain && s.async ) {
					if ( s.timeout ) {
						s.xdrTimeout = s.timeout;
						delete s.timeout;
					}
					var xdr;
					return {
						send: function( _, complete ) {
							function callback( status, statusText, responses, responseHeaders ) {
								xdr.onload = xdr.onerror = xdr.ontimeout = jQuery.noop;
								xdr = undefined;
								complete( status, statusText, responses, responseHeaders );
							}
							xdr = new XDomainRequest();
							xdr.open( s.type, s.url );
							xdr.onload = function() {
								callback( 200, "OK", { text: xdr.responseText }, "Content-Type: " + xdr.contentType );
							};
							xdr.onerror = function() {
								callback( 404, "Not Found" );
							};
							if ( s.xdrTimeout ) {
								xdr.ontimeout = function() {
									callback( 0, "timeout" );
								};
								xdr.timeout = s.xdrTimeout;
							}
							xdr.send( ( s.hasContent && s.data ) || null );
						},
						abort: function() {
							if ( xdr ) {
								xdr.onerror = jQuery.noop();
								xdr.abort();
							}
						}
					};
				}
			});
		}
	})( jQuery );
	
	/*	jQuery Easing v1.3
		http://gsgd.co.uk/sandbox/jquery/easing/
	================================================== */
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
		}
	});
}
