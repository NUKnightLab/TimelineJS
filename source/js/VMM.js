/* Verite
 * Verite JS Master
 * Version: 0.5
 * Date: April 5, 2012
 * Copyright 2012 Verite unless part of Verite Timeline, 
 * if part of Timeline then it inherits Timeline's license.
 * Designed and built by Zach Wise digitalartwork.net
 * ----------------------------------------------------- */


/* CodeKit Import
================================================== */


/* Simple JavaScript Inheritance
 * By John Resig http://ejohn.org/
 * MIT Licensed.
================================================== */
(function() {
	var initializing = false,
	fnTest = /xyz/.test(function() {
		xyz;
		}) ? /\b_super\b/: /.*/;
		// The base Class implementation (does nothing)
	this.Class = function() {};

    // Create a new Class that inherits from this class
	Class.extend = function(prop) {
		var _super = this.prototype;

        // Instantiate a base class (but only create the instance,
        // don't run the init constructor)
		initializing = true;
		var prototype = new this();
		initializing = false;

        // Copy the properties over onto the new prototype
		for (var name in prop) {
            // Check if we're overwriting an existing function
			prototype[name] = typeof prop[name] == "function" &&
			typeof _super[name] == "function" && fnTest.test(prop[name]) ?
			(function(name, fn) {
				return function() {
					var tmp = this._super;

					// Add a new ._super() method that is the same method
					// but on the super-class
					this._super = _super[name];

					// The method only need to be bound temporarily, so we
					// remove it when we're done executing
					var ret = fn.apply(this, arguments);
					this._super = tmp;

					return ret;
				};
			})(name, prop[name]) :
			prop[name];
		}

		// The dummy class constructor
		function Class() {
			// All construction is actually done in the init method
			if (!initializing && this.init)
			this.init.apply(this, arguments);
		}

		// Populate our constructed prototype object
		Class.prototype = prototype;

		// Enforce the constructor to be what we expect
		Class.prototype.constructor = Class;

		// And make this class extendable
		Class.extend = arguments.callee;

		return Class;
    };
})();

/* Access to the Global Object
 * access the global object without hard-coding the identifier window
================================================== */
var global = (function () {
   return this || (1,eval)('this');
}());

/* VMM
================================================== */
if (typeof VMM == 'undefined') {
	
	/* Main Scope Container
	================================================== */
	//var VMM = {};
	var VMM = Class.extend({});
	
	/* Master Config
	================================================== */
	
	VMM.master_config = ({
		
		init: function() {
			return this;
		},
		
		vp: "Pellentesque nibh felis, eleifend id, commodo in, interdum vitae, leo",
		
		keys: {
			flickr: "RAIvxHY4hE/Elm5cieh4X5ptMyDpj7MYIxziGxi0WGCcy1s+yr7rKQ==",
			google: "jwNGnYw4hE9lmAez4ll0QD+jo6SKBJFknkopLS4FrSAuGfIwyj57AusuR0s8dAo="
		},
		
		youtube: {
			active: false,
			array: [],
			api_loaded:false,
			que: []
		},
		
		googlemaps: {
			active: false,
			map_active: false,
			places_active: false,
			array: [],
			api_loaded:false,
			que: []
		}
		
	}).init();
	
	/* Abstract out DOM element creation to make independent of library
	================================================== */
	//VMM.createElement(tag, value, cName, attrs, styles);
	VMM.createElement = function(tag, value, cName, attrs, styles) {
		
		var ce = "";
		
		if (tag != null && tag != "") {
			
			// TAG
			ce += "<" + tag;
			if (cName != null && cName != "") {
				ce += " class='" + cName + "'";
			};
			
			if (attrs != null && attrs != "") {
				ce += " " + attrs;
			};
			
			if (styles != null && styles != "") {
				ce += " " + styles;
			};
			
			ce += ">";
			
			if (value != null && value != "") {
				ce += value;
			}
			
			// CLOSE TAG
			ce = ce + "</" + tag + ">";
		}
		
		return ce;
		
    };

	VMM.createMediaElement = function(media, caption, credit) {
		
		var ce = "";
		
		var _valid = false;
		
		ce += "<div class='media'>";
		
		if (media != null && media != "") {
			
			valid = true;
			
			ce += "<img src='" + media + "'>";
			
			// CREDIT
			if (credit != null && credit != "") {
				ce += VMM.createElement("div", credit, "credit");
			}
			
			// CAPTION
			if (caption != null && caption != "") {
				ce += VMM.createElement("div", caption, "caption");
			}

		}
		
		ce += "</div>";
		
		return ce;
		
    };

	
	/* LIBRARY ABSTRACTION
	================================================== */
	
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
			e = $(element).html();
			return e;
		}
		
	};
	//VMM.getElement(element);
	VMM.getElement = function(element, p) {
		var e;
		if( typeof( jQuery ) != 'undefined' ){
			if (p) {
				e = $(element).parent().get(0);
				
			} else {
				e = $(element).get(0);
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
			$(element).bind(_event_type, _event_data, the_handler);
			
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
			$(element).unbind(_event_type, the_handler);
			
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
			$(element).trigger(_event_type, _data);
			
			//return e;
		}
		
	};

	// VMM.getJSON(url, the_function);
	VMM.getJSON = function(url, data, callback) {
		if( typeof( jQuery ) != 'undefined' ){
			
			/* CHECK FOR IE AND USE Use Microsoft XDR
			================================================== */
			if ( VMM.Browser.browser == "Explorer" && parseInt(VMM.Browser.version, 10) >= 8 && window.XDomainRequest) {
				trace("it's ie");
				var ie_url = url;

				if (ie_url.match('^http://')){
					trace("RUNNING GET JSON")
				     //ie_url = ie_url.replace("http://","//");
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
						
								//.error(function() { trace("IE ERROR")})
								//.success(function() { trace("IE SUCCESS")});
								
								
					}
					xdr.send();
				} else {
					return jQuery.getJSON(url, data, callback);
				}
			} else {
				//$.getJSON(url, data);
				return jQuery.getJSON(url, data, callback);
				
				
			}
		}
	}
	// VMM.parseJSON(the_json);
	VMM.parseJSON = function(the_json) {
		if( typeof( jQuery ) != 'undefined' ){
			return $.parseJSON(the_json);
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
			
			$(append_to_element).append(e);
			
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
					$(element).hide(duration);
				}
			} else {
				if( typeof( jQuery ) != 'undefined' ){
					$(element).hide();
				}
			}
			
		},
		// VMM.Element.remove(element);
		remove: function(element) {
			if( typeof( jQuery ) != 'undefined' ){
				$(element).remove();
			}
		},
		// VMM.Element.detach(element);
		detach: function(element) {
			if( typeof( jQuery ) != 'undefined' ){
				$(element).detach();
			}
		},
		// VMM.Element.append(element, value);
		append: function(element, value) {
			if( typeof( jQuery ) != 'undefined' ){
				$(element).append(value);
			}
		},
		// VMM.Element.show(element);
		show: function(element, duration) {
			if (duration != null && duration != "") {
				if( typeof( jQuery ) != 'undefined' ){
					$(element).show(duration);
				}
			} else {
				if( typeof( jQuery ) != 'undefined' ){
					$(element).show();
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
				$(element).load(_event_data, callback_function);
			}
		},
		//VMM.Element.addClass(element, cName);
		addClass: function(element, cName) {
			if( typeof( jQuery ) != 'undefined' ){
				$(element).addClass(cName);
			}
		},
		//VMM.Element.removeClass(element, cName);
		removeClass: function(element, cName) {
			if( typeof( jQuery ) != 'undefined' ){
				$(element).removeClass(cName);
			}
		},
		//VMM.Element.attr(element, aName, value);
		attr: function(element, aName, value) {
			if (value != null && value != "") {
				if( typeof( jQuery ) != 'undefined' ){
					$(element).attr(aName, value);
				}
			} else {
				if( typeof( jQuery ) != 'undefined' ){
					return $(element).attr(aName);
				}
			}
		},
		//VMM.Element.prop(element, aName, value);
		prop: function(element, aName, value) {
			if (typeof jQuery == 'undefined' || !/[1-9]\.[3-9].[1-9]/.test($.fn.jquery)) {
			    VMM.Element.attribute(element, aName, value);
			} else {
				$(element).prop(aName, value);
			}
		},
		//VMM.Element.attribute(element, aName, value);
		attribute: function(element, aName, value) {
			
			if (value != null && value != "") {
				if( typeof( jQuery ) != 'undefined' ){
					$(element).attr(aName, value);
				}
			} else {
				if( typeof( jQuery ) != 'undefined' ){
					return $(element).attr(aName);
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
						$(element).show(0);
					} else {
						$(element).hide(0);
					}
				}
			} else {
				if( typeof( jQuery ) != 'undefined' ){
					if ( $(element).is(':visible')){
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
					$(element).css(prop, value);
				}
			} else {
				if( typeof( jQuery ) != 'undefined' ){
					return $(element).css(prop);
				}
			}
		},
		
		cssmultiple: function(element, propval) {

			if( typeof( jQuery ) != 'undefined' ){
				return $(element).css(propval);
			}
		},
		/* Gets offset
		================================================== */
		//VMM.Element.offset(element);
		offset: function(element) {
			var p;
			if( typeof( jQuery ) != 'undefined' ){
				p = $(element).offset();
			}
			return p;
		},
		/* Gets position
		================================================== */
		//VMM.Element.position(element);
		position: function(element) {
			var p;
			if( typeof( jQuery ) != 'undefined' ){
				p = $(element).position();
			}
			return p;
		},
		/* Sets  or gets the width of a dom element
		================================================== */
		//VMM.Element.width(element, s);
		width: function(element, s) {
			if (s != null && s != "") {
				if( typeof( jQuery ) != 'undefined' ){
					$(element).width(s);
				}
			} else {
				if( typeof( jQuery ) != 'undefined' ){
					return $(element).width();
				}
			}
		},
		/* Sets  or gets the width of a dom element
		================================================== */
		height: function(element, s) {
			if (s != null && s != "") {
				if( typeof( jQuery ) != 'undefined' ){
					$(element).height(s);
				}
			} else {
				if( typeof( jQuery ) != 'undefined' ){
					return $(element).height();
				}
			}
		},
		/* TOGGLE CLASS
		================================================== */
		// VMM.Element.toggleClass(element, cName);
		toggleClass: function(element, cName) {
			if( typeof( jQuery ) != 'undefined' ){
				$(element).toggleClass(cName);
			}
		},
		/* Each
		================================================== */
		// VMM.Element.each(element, return_function);
		each:function(element, return_function) {
			if( typeof( jQuery ) != 'undefined' ){
				$(element).each(return_function);
			}
			
		},
		/* Each
		================================================== */
		// VMM.Element.html(element, str);
		html: function(element, str) {
			var e;
			if( typeof( jQuery ) != 'undefined' ){
				e = $(element).html();
				return e;
			}
			
			if (str != null && str != "") {
				if( typeof( jQuery ) != 'undefined' ){
					$(element).html(str);
				}
			} else {
				var e;
				if( typeof( jQuery ) != 'undefined' ){
					e = $(element).html();
					return e;
				}
			}

		},
		/* Find
		================================================== */
		// VMM.Element.find(element, selec);
		find: function(element, selec) {
			if( typeof( jQuery ) != 'undefined' ){
				return $(element).find(selec);
			}
		},
		/* Animate
		================================================== */
		// VMM.Element.stop(element);
		stop: function(element) {
			if( typeof( jQuery ) != 'undefined' ){
				$(element).stop();
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
						$(element).animate(_att, {queue:false, duration:_duration, easing:"ease", complete:callback_function} );
					} else {
						$(element).animate(_att, {queue:false, duration:_duration, easing:"ease"} );
					}
				}
				*/
				
			} else {
				if( typeof( jQuery ) != 'undefined' ){
					if (callback_function != null && callback_function != "") {
						$(element).animate(_att, {queue:false, duration:_duration, easing:_ease, complete:callback_function} );
					} else {
						$(element).animate(_att, {queue:false, duration:_duration, easing:_ease} );
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
	
	/* TOUCH
	================================================== */
	// VMM.TouchSlider.createSlidePanel(touch_object, move_object, w, padding, vertical, h) ;
	VMM.TouchSlider = {
		createPanel: function(touch_object, move_object, w, padding, vertical, h) {
			VMM.TouchSlider.vertical = false;
			VMM.TouchSlider.vertical = vertical;
			
			var x = padding;
			VMM.TouchSlider.width = w;
			VMM.TouchSlider.height = h;
			VMM.TouchSlider.makeTouchable(touch_object, move_object);
			/*
			if (sticky != null && sticky != "") {
				VMM.TouchSlider.sticky = sticky;
			} else {
				VMM.TouchSlider.sticky = false;
			}
			*/
			// VMM.TouchSlider.sticky = sticky;
			
		},
		
		removePanel: function(touch_object) {
			VMM.unbindEvent(touch_object, VMM.TouchSlider.onTouchStart, "touchstart");
			VMM.unbindEvent(touch_object, VMM.TouchSlider.onTouchMove, "touchmove");
			VMM.unbindEvent(touch_object, VMM.TouchSlider.onTouchEnd, "touchend");
		},
		
		makeTouchable: function(touch_object, move_object) {
			VMM.bindEvent(touch_object, VMM.TouchSlider.onTouchStart, "touchstart", {element: move_object});
			VMM.bindEvent(touch_object, VMM.TouchSlider.onTouchMove, "touchmove", {element: move_object});
			VMM.bindEvent(touch_object, VMM.TouchSlider.onTouchEnd, "touchend", {element: move_object});
	    },
		onTouchStart: function(e) {
			VMM.TouchSlider.touchStart(e.data.element, e);
			e.preventDefault();
			e.stopPropagation();
			return true;
		},
		onTouchEnd: function(e) {
			e.preventDefault();
			e.stopPropagation();
			
			if (VMM.TouchSlider.sliding) {
				VMM.TouchSlider.sliding = false;
				VMM.TouchSlider.touchEnd(e.data.element, e);
				return false;
			} else {
				return true;
			}
			
		},
		onTouchMove: function(e) {
			VMM.TouchSlider.touchMove(e.data.element, e);
			e.preventDefault();
			e.stopPropagation();
			return false;
		},
		getLeft: function(elem) {
			return parseInt(VMM.Element.css(elem, 'left').substring(0, VMM.Element.css(elem, 'left').length - 2), 10);
		},
		getTop: function(elem) {
			return parseInt(VMM.Element.css(elem, 'top').substring(0, VMM.Element.css(elem, 'top').length - 2), 10);
		},
	    touchStart: function(elem, e) {
			
			VMM.Element.css(elem, '-webkit-transition-duration', '0');
			
			VMM.TouchSlider.startX = e.originalEvent.touches[0].screenX;
			VMM.TouchSlider.startY = e.originalEvent.touches[0].screenY;
			
			VMM.TouchSlider.startLeft = VMM.TouchSlider.getLeft(elem);
			VMM.TouchSlider.startTop = VMM.TouchSlider.getTop(elem);
			
			VMM.TouchSlider.touchStartTime = new Date().getTime();

	    },
		touchEnd: function(elem, e) {
			if (VMM.TouchSlider.getLeft(elem) > 0) {
				
				//This means they dragged to the right past the first item
				
				if (VMM.TouchSlider.vertical) {
					VMM.Element.animate(elem, 1000, "", {"top": 0});
				} else {
					VMM.Element.animate(elem, 1000, "", {"left": 0});
				}
				
				VMM.TouchSlider.startX = null;
				VMM.TouchSlider.startY = null;
				
				VMM.fireEvent(elem, "TOUCHUPDATE", [0]);
				
			} else {
				//This means they were just dragging within the bounds of the grid and we just need to handle the momentum and snap to the grid.
				VMM.TouchSlider.slideMomentum(elem, e);
	         }
	    },
		slideMomentum: function(elem, e) {
			var slideAdjust = (new Date().getTime() - VMM.TouchSlider.touchStartTime) * 10;
			var timeAdjust = slideAdjust;
			
			var left = VMM.TouchSlider.getLeft(elem);
			var top = VMM.TouchSlider.getTop(elem);
			
			var changeX = 6000 * (Math.abs(VMM.TouchSlider.startLeft) - Math.abs(left));
			var changeY = 6000 * (Math.abs(VMM.TouchSlider.startTop) - Math.abs(top));
			
			slideAdjust = Math.round(changeX / slideAdjust);
			slideAdjustY = Math.round(changeY / slideAdjust);

			var newLeft = slideAdjust + left;
			var newTop = slideAdjustY + top;
			
			var y = newTop % VMM.TouchSlider.height;
			var t = newLeft % VMM.TouchSlider.width;
			
			
			var _r_object = {
				top: Math.min(0, newTop),
				left: Math.min(0, newLeft),
				time: timeAdjust
			}
			VMM.fireEvent(elem, "TOUCHUPDATE", [_r_object]);
			/*
			if (VMM.TouchSlider.sticky) {
				trace("sticky");
				if ((Math.abs(t)) > ((VMM.TouchSlider.width / 2))) {
					//Show the next cell
					newLeft -= (VMM.TouchSlider.width - Math.abs(t));
				} else {
		             //Stay on the current cell
					newLeft -= t;
				}
				
				VMM.fireEvent(elem, "TOUCHUPDATE", [Math.min(0, newLeft)]);
				
			} else {
				trace("not sticky");
				//VMM.TouchSlider.doSlide(elem, Math.min(0, newLeft), '0.5s');
				VMM.Element.animate(elem, 500, "", {"left": Math.min(0, newLeft)});
			}
			*/
			
			VMM.TouchSlider.startX = null;
			VMM.TouchSlider.startY = null;
			
	    },
		doSlide: function(elem, x, duration) {
			VMM.Element.css(elem, '-webkit-transition-property', 'left');
			VMM.Element.css(elem, '-webkit-transition-duration', duration);
			VMM.Element.css(elem, 'left', x);
		},
		touchMove: function(elem, e) {
			
			if (!VMM.TouchSlider.sliding) {
				//elem.parent().addClass('sliding');
			}

			VMM.TouchSlider.sliding = true;
			
			if (VMM.TouchSlider.vertical) {
				
				if (VMM.TouchSlider.startY > e.originalEvent.touches[0].screenY) {
					VMM.Element.css(elem, 'top', -(VMM.TouchSlider.startY - e.originalEvent.touches[0].screenY - VMM.TouchSlider.startTop));
					VMM.TouchSlider.slidingTop = true;
				} else {
					var top = (e.originalEvent.touches[0].screenY - VMM.TouchSlider.startY + VMM.TouchSlider.startTop);
					VMM.Element.css(elem, 'top', -(VMM.TouchSlider.startY - e.originalEvent.touches[0].screenY - VMM.TouchSlider.startTop));
					VMM.TouchSlider.slidingTop = false;
				}
				
			} else {
				
				if (VMM.TouchSlider.startX > e.originalEvent.touches[0].screenX) {
					VMM.Element.css(elem, 'left', -(VMM.TouchSlider.startX - e.originalEvent.touches[0].screenX - VMM.TouchSlider.startLeft));
					VMM.TouchSlider.slidingLeft = true;
				} else {
					var left = (e.originalEvent.touches[0].screenX - VMM.TouchSlider.startX + VMM.TouchSlider.startLeft);
					VMM.Element.css(elem, 'left', -(VMM.TouchSlider.startX - e.originalEvent.touches[0].screenX - VMM.TouchSlider.startLeft));
					VMM.TouchSlider.slidingLeft = false;
				}
				
			}
			
			
		}
	}
	
	// Hide URL Bar for iOS and Android by Scott Jehl
	// https://gist.github.com/1183357

	VMM.hideUrlBar = function () {
		var win = window,
			doc = win.document;

		// If there's a hash, or addEventListener is undefined, stop here
		if( !location.hash || !win.addEventListener ){

			//scroll to 1
			window.scrollTo( 0, 1 );
			var scrollTop = 1,

			//reset to 0 on bodyready, if needed
			bodycheck = setInterval(function(){
				if( doc.body ){
					clearInterval( bodycheck );
					scrollTop = "scrollTop" in doc.body ? doc.body.scrollTop : 1;
					win.scrollTo( 0, scrollTop === 1 ? 0 : 1 );
				}	
			}, 15 );

			win.addEventListener( "load", function(){
				setTimeout(function(){
					//reset to hide addr bar at onload
					win.scrollTo( 0, scrollTop === 1 ? 0 : 1 );
				}, 0);
			}, false );
		}
	};
	
	/* DRAG
	================================================== */
	// VMM.DragSlider.createSlidePanel(drag_object, move_object, w, padding, sticky);
	// VMM.DragSlider.cancelSlide();
	VMM.DragSlider = {
		createPanel: function(drag_object, move_object, w, padding, sticky) {
			

			
			var x = padding;
			VMM.DragSlider.width = w;
			VMM.DragSlider.makeDraggable(drag_object, move_object);
			VMM.DragSlider.drag_elem = drag_object;
			/*
			if (sticky != null && sticky != "") {
				VMM.TouchSlider.sticky = sticky;
			} else {
				VMM.TouchSlider.sticky = false;
			}
			*/
			VMM.DragSlider.sticky = sticky;
		},
		makeDraggable: function(drag_object, move_object) {
			VMM.bindEvent(drag_object, VMM.DragSlider.onDragStart, "mousedown", {element: move_object, delement: drag_object});
			//VMM.bindEvent(drag_object, VMM.DragSlider.onDragMove, "mousemove", {element: move_object});
			VMM.bindEvent(drag_object, VMM.DragSlider.onDragEnd, "mouseup", {element: move_object, delement: drag_object});
			VMM.bindEvent(drag_object, VMM.DragSlider.onDragLeave, "mouseleave", {element: move_object, delement: drag_object});
	    },
		cancelSlide: function(e) {
			VMM.unbindEvent(VMM.DragSlider.drag_elem, VMM.DragSlider.onDragMove, "mousemove");
			//VMM.DragSlider.drag_elem.preventDefault();
			//VMM.DragSlider.drag_elem.stopPropagation();
			return true;
		},
		onDragLeave: function(e) {

			VMM.unbindEvent(e.data.delement, VMM.DragSlider.onDragMove, "mousemove");
			e.preventDefault();
			e.stopPropagation();
			return true;
		},
		onDragStart: function(e) {
			VMM.DragSlider.dragStart(e.data.element, e.data.delement, e);
			
			e.preventDefault();
			e.stopPropagation();
			return true;
		},
		onDragEnd: function(e) {
			e.preventDefault();
			e.stopPropagation();
			
			if (VMM.DragSlider.sliding) {
				VMM.DragSlider.sliding = false;
				VMM.DragSlider.dragEnd(e.data.element, e.data.delement, e);
				return false;
			} else {
				return true;
			}
			
		},
		onDragMove: function(e) {
			VMM.DragSlider.dragMove(e.data.element, e);
			e.preventDefault();
			e.stopPropagation();
			return false;
		},
		dragStart: function(elem, delem, e) {
			
			VMM.DragSlider.startX = e.pageX;
			
			VMM.DragSlider.startLeft = VMM.DragSlider.getLeft(elem);
			VMM.DragSlider.dragStartTime = new Date().getTime();
			VMM.DragSlider.dragWidth = VMM.Element.width(delem);
			
			// CANCEL CURRENT ANIMATION IF ANIMATING
			var _newx = Math.round(VMM.DragSlider.startX - e.pageX - VMM.DragSlider.startLeft);
			
			VMM.Element.stop(elem);
			VMM.bindEvent(delem, VMM.DragSlider.onDragMove, "mousemove", {element: elem});

	    },
		dragEnd: function(elem, delem, e) {
			VMM.unbindEvent(delem, VMM.DragSlider.onDragMove, "mousemove");
			//VMM.DragSlider.dragMomentum(elem, e);
			if (VMM.DragSlider.getLeft(elem) > 0) {
				//(VMM.DragSlider.dragWidth/2)
				//This means they dragged to the right past the first item
				//VMM.Element.animate(elem, 1000, "linear", {"left": 0});
				
				//VMM.fireEvent(elem, "DRAGUPDATE", [0]);
			} else {
				//This means they were just dragging within the bounds of the grid and we just need to handle the momentum and snap to the grid.
				VMM.DragSlider.dragMomentum(elem, e);
	         }
		},
		dragMove: function(elem, e) {
			if (!VMM.DragSlider.sliding) {
				//elem.parent().addClass('sliding');
			}
			
			VMM.DragSlider.sliding = true;
			if (VMM.DragSlider.startX > e.pageX) {
				//Sliding to the left
				VMM.Element.css(elem, 'left', -(VMM.DragSlider.startX - e.pageX - VMM.DragSlider.startLeft));
				VMM.DragSlider.slidingLeft = true;
			} else {
				//Sliding to the right
				var left = (e.pageX - VMM.DragSlider.startX + VMM.DragSlider.startLeft);
				VMM.Element.css(elem, 'left', -(VMM.DragSlider.startX - e.pageX - VMM.DragSlider.startLeft));
				VMM.DragSlider.slidingLeft = false;
			}
		},
		dragMomentum: function(elem, e) {
			var slideAdjust = (new Date().getTime() - VMM.DragSlider.dragStartTime) * 10;
			var timeAdjust = slideAdjust;
			var left = VMM.DragSlider.getLeft(elem);

			var changeX = 6000 * (Math.abs(VMM.DragSlider.startLeft) - Math.abs(left));
			//var changeX = 6000 * (VMM.DragSlider.startLeft - left);
			slideAdjust = Math.round(changeX / slideAdjust);
			
			var newLeft = left + slideAdjust;
			
			var t = newLeft % VMM.DragSlider.width;
			//left: Math.min(0, newLeft),
			var _r_object = {
				left: Math.min(newLeft),
				time: timeAdjust
			}
			
			VMM.fireEvent(elem, "DRAGUPDATE", [_r_object]);
			var _ease = "easeOutExpo";
			if (_r_object.time > 0) {
				VMM.Element.animate(elem, _r_object.time, _ease, {"left": _r_object.left});
			};
			
			
			//VMM.DragSlider.startX = null;
		},
		getLeft: function(elem) {
			return parseInt(VMM.Element.css(elem, 'left').substring(0, VMM.Element.css(elem, 'left').length - 2), 10);
		}
	
	}
	
	/* DEVICE
	================================================== */
	
	VMM.Browser = {
		init: function () {
			this.browser = this.searchString(this.dataBrowser) || "An unknown browser";
			this.version = this.searchVersion(navigator.userAgent)
				|| this.searchVersion(navigator.appVersion)
				|| "an unknown version";
			this.OS = this.searchString(this.dataOS) || "an unknown OS";
			this.device = this.searchDevice(navigator.userAgent);
			
		},
		searchDevice: function(d) {
			if (d.match(/Android/i) || d.match(/iPhone|iPod/i)) {
				return "mobile";
			} else if (d.match(/iPad/i)) {
				return "tablet";
			} else if (d.match(/BlackBerry/i) || d.match(/IEMobile/i)) {
				return "other mobile";
			} else {
				return "desktop";
			}
		},
		searchString: function (data) {
			for (var i=0;i<data.length;i++)	{
				var dataString = data[i].string;
				var dataProp = data[i].prop;
				this.versionSearchString = data[i].versionSearch || data[i].identity;
				if (dataString) {
					if (dataString.indexOf(data[i].subString) != -1)
						return data[i].identity;
				}
				else if (dataProp)
					return data[i].identity;
			}
		},
		searchVersion: function (dataString) {
			var index = dataString.indexOf(this.versionSearchString);
			if (index == -1) return;
			return parseFloat(dataString.substring(index+this.versionSearchString.length+1));
		},
		dataBrowser: [
			{
				string: navigator.userAgent,
				subString: "Chrome",
				identity: "Chrome"
			},
			{ 	string: navigator.userAgent,
				subString: "OmniWeb",
				versionSearch: "OmniWeb/",
				identity: "OmniWeb"
			},
			{
				string: navigator.vendor,
				subString: "Apple",
				identity: "Safari",
				versionSearch: "Version"
			},
			{
				prop: window.opera,
				identity: "Opera",
				versionSearch: "Version"
			},
			{
				string: navigator.vendor,
				subString: "iCab",
				identity: "iCab"
			},
			{
				string: navigator.vendor,
				subString: "KDE",
				identity: "Konqueror"
			},
			{
				string: navigator.userAgent,
				subString: "Firefox",
				identity: "Firefox"
			},
			{
				string: navigator.vendor,
				subString: "Camino",
				identity: "Camino"
			},
			{		// for newer Netscapes (6+)
				string: navigator.userAgent,
				subString: "Netscape",
				identity: "Netscape"
			},
			{
				string: navigator.userAgent,
				subString: "MSIE",
				identity: "Explorer",
				versionSearch: "MSIE"
			},
			{
				string: navigator.userAgent,
				subString: "Gecko",
				identity: "Mozilla",
				versionSearch: "rv"
			},
			{ 		// for older Netscapes (4-)
				string: navigator.userAgent,
				subString: "Mozilla",
				identity: "Netscape",
				versionSearch: "Mozilla"
			}
		],
		dataOS : [
			{
				string: navigator.platform,
				subString: "Win",
				identity: "Windows"
			},
			{
				string: navigator.platform,
				subString: "Mac",
				identity: "Mac"
			},
			{
				string: navigator.userAgent,
				subString: "iPhone",
				identity: "iPhone/iPod"
		    },
			{
				string: navigator.userAgent,
				subString: "iPad",
				identity: "iPad"
		    },
			{
				string: navigator.platform,
				subString: "Linux",
				identity: "Linux"
			}
		]

	}
	VMM.Browser.init();
	
	/* MEDIA TYPE
	================================================== */
	VMM.MediaElement = ({
		
		init: function() {
			return this;
		},
		// somestring = VMM.MediaElement.thumbnail(data);
		thumbnail: function(data, w, h) {
			_w = 32;
			_h = 32;
			if (w != null && w != "") {
				_w = w;
			}
			if (h != null && h != "") {
				_h = h;
			}
			
			if (data.media != null && data.media != "") {
				_valid = true;
				var mediaElem = "";
				var m = {};
				
				// MEDIA TYPE
				m = VMM.MediaType(data.media); //returns an object with .type and .id
				
				// CREATE MEDIA CODE 
				if (m.type == "image") {
					mediaElem = "<div class='thumbnail'><img src='" + m.id + "' width='" + _w + "px' height='" + _h + "px'></div>";
					return mediaElem;
				} else if (m.type == "flickr") {
					mediaElem = "<div class='thumbnail'><img id='flickr_" + m.id + "_thumb' width='" + _w + "px' height='" + _h + "px'></div>";
					return mediaElem;
				} else if (m.type == "youtube") {
					mediaElem = "<div class='thumbnail youtube'></div>";
					return mediaElem;
				} else if (m.type == "googledoc") {
					mediaElem = "";
				} else if (m.type == "vimeo") {
					mediaElem = "<div class='thumbnail vimeo'></div>";
					return mediaElem;
				} else if (m.type == "twitter"){
					mediaElem = "<div class='thumbnail twitter'></div>";
					return mediaElem;
				} else if (m.type == "twitter-ready") {
					mediaElem = "<div class='thumbnail twitter'></div>";
					return mediaElem;
				} else if (m.type == "soundcloud") {
					mediaElem = "<div class='thumbnail soundcloud'></div>";
					return mediaElem;
				} else if (m.type == "google-map") {
					mediaElem = "<div class='thumbnail map'></div>";
					return mediaElem;
				} else if (m.type == "unknown") {
					mediaElem = "";
					return mediaElem;
				} else if (m.type == "website") {
					//mediaElem = "<div class='thumbnail website'></div>";
					mediaElem = "<div class='thumbnail'><img src='http://api.snapito.com/free/sc?url=" + m.id + "' width='" + _w + "px' height='" + _h + "px'></div>";
					
					return mediaElem;
				} else {
					mediaElem = "<div class='thumbnail'></div>";
					return mediaElem;
				}
			}
		},
		//VMM.MediaElement.create(element, data, returntrue);
		create: function(element, data, __return, w, h) {
			
			_return = __return;
			_w = 500;
			_h = 400;
			$mediacontainer = element;
			//VMM.MediaElement.container = element;
			var _valid = false;
			if (w != null && w != "") {
				_w = w;
			}
			if (h != null && h != "") {
				_h = h;
			}
			
			if (data.media != null && data.media != "") {

				_valid = true;
				var mediaElem = "";
				var captionElem = "";
				var creditElem = "";
				var m = {};
				var media_height = (_h - 50);
				var isTextMedia = false;
				
				// CREDIT
				if (data.credit != null && data.credit != "") {
					creditElem = "<div class='credit'>" + VMM.Util.linkify_with_twitter(data.credit, "_blank") + "</div>";
				}
				// CAPTION
				if (data.caption != null && data.caption != "") {
					captionElem = "<div class='caption'>" + VMM.Util.linkify_with_twitter(data.caption, "_blank") + "</div>";
				}
				
				// MEDIA TYPE
				m = VMM.MediaType(data.media); //returns an object with .type and .id
				
				// CREATE MEDIA CODE 
				if (m.type == "image") {
					mediaElem = "<img src='" + m.id + "'>";
				} else if (m.type == "flickr") {
					var flickr_id = "flickr_" + m.id;
					mediaElem = "<a href='" + m.link + "' target='_blank'><img id='" + flickr_id + "_large" + "'></a>";
					VMM.ExternalAPI.flickr.getPhoto(m.id, "#" + flickr_id);
				} else if (m.type == "googledoc") {
					if (m.id.match(/docs.google.com/i)) {
						mediaElem = "<iframe class='media-frame doc' frameborder='0' width='100%' height='100%' src='" + m.id + "&embedded=true'></iframe>";
					} else {
						mediaElem = "<iframe class='media-frame doc' frameborder='0' width='100%' height='100%' src='http://docs.google.com/viewer?url=" + m.id + "&embedded=true'></iframe>";
					}
					
					
				} else if (m.type == "youtube") {
					mediaElem = "<div class='media-frame video youtube' id='youtube_" + m.id + "'>Loading YouTube video...</div>";
					VMM.ExternalAPI.youtube.init(m.id);
					//mediaElem = "<iframe class='media-frame youtube' onload='timeline.iframeLoaded()' frameborder='0' width='100%' height='100%' src='http://www.youtube.com/embed/" + m.id + "?&rel=0&theme=light&showinfo=0&hd=1&autohide=0&color=white&enablejsapi=1' allowfullscreen></iframe>";
				} else if (m.type == "vimeo") {
					mediaElem = "<iframe class='media-frame video vimeo' frameborder='0' width='100%' height='100%' src='http://player.vimeo.com/video/" + m.id + "?title=0&amp;byline=0&amp;portrait=0&amp;color=ffffff'></iframe>";
				} else if (m.type == "twitter"){
					mediaElem = "<div class='twitter' id='" + "twitter_" + m.id + "'>Loading Tweet</div>";
					//VMM.ExternalAPI.twitter.getHTML(m.id);
					trace("TWITTER");
					VMM.ExternalAPI.twitter.prettyHTML(m.id);
					isTextMedia = true;
				} else if (m.type == "twitter-ready") {
					mediaElem = m.id;
				} else if (m.type == "soundcloud") {
					var soundcloud_id = "soundcloud_" + VMM.Util.unique_ID(5);
					mediaElem = "<div class='media-frame soundcloud' id='" + soundcloud_id + "'>Loading Sound</div>";
					VMM.ExternalAPI.soundcloud.getSound(m.id, soundcloud_id)
				} else if (m.type == "google-map") {
					//mediaElem = "<iframe class='media-frame map' frameborder='0' width='100%' height='100%' scrolling='no' marginheight='0' marginwidth='0' src='" + m.id + "&amp;output=embed'></iframe>"
					var map_id = "googlemap_" + VMM.Util.unique_ID(7);
					mediaElem = "<div class='media-frame map' id='" + map_id + "'>Loading Map...</div>";
					VMM.ExternalAPI.googlemaps.getMap(m.id, map_id);
				} else if (m.type == "unknown") { 
					trace("NO KNOWN MEDIA TYPE FOUND TRYING TO JUST PLACE THE HTML"); 
					mediaElem = VMM.Util.properQuotes(m.id); 
				} else if (m.type == "website") { 
					//mediaElem = "<iframe class='media-frame' frameborder='0' width='100%' height='100%' scrolling='yes' marginheight='0' marginwidth='0' src='" + m.id + "'></iframe>";
					mediaElem = "<a href='" + m.id + "' target='_blank'>" + "<img src='http://api.snapito.com/free/lc?url=" + m.id + "'></a>";
				} else {
					trace("NO KNOWN MEDIA TYPE FOUND");
					trace(m.type);
				}
				// WRAP THE MEDIA ELEMENT
				mediaElem = "<div class='media-container' >" + mediaElem + creditElem + captionElem + "</div>";
				
				if (_return) {
					if (isTextMedia) {
						return "<div class='media text-media'><div class='media-wrapper'>" + mediaElem + "</div></div>";
					} else {
						return "<div class='media'><div class='media-wrapper'>" + mediaElem + "</div></div>";
					}
				} else {
					VMM.appendElement($mediacontainer, mediaElem);
					VMM.appendElement($mediacontainer, creditElem);
					VMM.appendElement($mediacontainer, captionElem);
				}
			};
			
		},
		
	}).init();
	
	//VMM.mediaType.youtube(d); //should return a true or false
	// VMM.MediaType(url); //returns an object with .type and .id
	VMM.MediaType = function(d) {
		var success = false;
		var media   = {};
		if (d.match("div class='twitter'")) {
			media.type  = "twitter-ready";
		    media.id    = d;
		    success = true;
		} else if (d.match('(www.)?youtube|youtu\.be')) {
			if (d.match('embed')) { 
				youtube_id = d.split(/embed\//)[1].split('"')[0];
			} else { 
				youtube_id = d.split(/v\/|v=|youtu\.be\//)[1].split(/[?&]/)[0];
			}
			//youtube_id = d.split(/v\/|v=|youtu\.be\//)[1].split(/[?&]/)[0];
		    media.type  = "youtube";
		    media.id    = youtube_id;
		    success = true;
		} else if (d.match('(player.)?vimeo\.com')) {
		    //vimeo_id = d.split(/video\/|http:\/\/vimeo\.com\//)[1].split(/[?&]/)[0];
		    vimeo_id = d.split(/video\/|\/\/vimeo\.com\//)[1].split(/[?&]/)[0];
		
		    media.type  = "vimeo";
		    media.id    = vimeo_id;
		    success = true;
		} else if (d.match('(player.)?soundcloud\.com')) {
			//soundcloud_url = unescape(d.split(/value="/)[1].split(/["]/)[0]);
			//soundcloud_id = soundcloud_url.split(/tracks\//)[1].split(/[&"]/)[0];
			media.type  = "soundcloud";
			media.id    = d;
			success = true;
		} else if (d.match('(www.)?twitter\.com')) {
			trace("TWITTER MATCH");
			// https://twitter.com/#!/twitterapi/statuses/133640144317198338
			// https://twitter.com/#!/DeliciousHot/status/23189589820702720
			if (d.match("status\/")) {
				twitter_id = d.split("status\/")[1];
			} else if (d.match("statuses\/")) {
				twitter_id = d.split("statuses\/")[1];
			} else {
				twitter_id = "";
			}

			media.type = "twitter";
			media.id = twitter_id;
			success = true;
		} else if (d.match("maps.google")) {
			//maps.google.com
			media.type  = "google-map";
		    media.id    = d.split(/src=['|"][^'|"]*?['|"]/gi);
			//trace("google map " + media.id);
			success = true;
		} else if (d.match("flickr.com/photos")) {
			media.type = "flickr";
			//media.id = d.split('/photos/[^/]+/([0-9]+)/gi');
			
			media.id = d.split("photos\/")[1].split("/")[1];
			media.link = d;
			//media.id = media.id.split("/")[1];
			//trace("FLICKR " + media.id);
			success = true;
		} else if (d.match(/jpg|jpeg|png|gif/i)) {
			media.type  = "image";
			media.id    = d;
			success = true;
		} else if (VMM.FileExtention.googleDocType(d)) {
			media.type  = "googledoc";
			media.id    = d;
			success = true;
		} 	else if (d.indexOf('http://') == 0) {
			media.type  = "website";
			media.id    = d;
			success = true;
		} else {
			trace("unknown media");  
			media.type  = "unknown";
			media.id    = d;
			success = true;
		}
		
		if (success) { 
			return media;
		} else {
			trace("No valid media id detected");
			trace(d);
		}
		return false;
	}
	//VMM.FileExtention.googleDocType(url);
	VMM.FileExtention = {
		googleDocType: function(url) {
			var fileName = url;
			var fileExtension = "";
			//fileExtension = fileName.substr(5);
			fileExtension = fileName.substr(fileName.length - 5, 5);
			var validFileExtensions = ["DOC","DOCX","XLS","XLSX","PPT","PPTX","PDF","PAGES","AI","PSD","TIFF","DXF","SVG","EPS","PS","TTF","XPS","ZIP","RAR"];
			var flag = false;
			
			for (var i = 0; i < validFileExtensions.length; i++) {

				
				if (fileExtension.toLowerCase().match(validFileExtensions[i].toString().toLowerCase()) || fileName.match("docs.google.com") ) {
					flag = true;
				}
				
			}
			
			return flag;

		}
	}
	
	
	
	
	VMM.ExternalAPI = {
		
		twitter: {
			tweetArray: [],
			// VMM.ExternalAPI.twitter.getHTML(id);
			getHTML: function(id) {
				//var the_url = document.location.protocol + "//api.twitter.com/1/statuses/oembed.json?id=" + id+ "&callback=?";
				var the_url = "http://api.twitter.com/1/statuses/oembed.json?id=" + id+ "&callback=?";
				VMM.getJSON(the_url, VMM.ExternalAPI.twitter.onJSONLoaded);
			},
			onJSONLoaded: function(d) {
				trace("TWITTER JSON LOADED");
				var id = d.id;
				VMM.attachElement("#"+id, VMM.Util.linkify_with_twitter(d.html) );
			},
			
			// VMM.ExternalAPI.twitter.parseTwitterDate(date);
			parseTwitterDate: function(d) {
				var date = new Date(Date.parse(d));
				/*
				var t = d.replace(/(\d{1,2}[:]\d{2}[:]\d{2}) (.*)/, '$2 $1');
				t = t.replace(/(\+\S+) (.*)/, '$2 $1');
				var date = new Date(Date.parse(t)).toLocaleDateString();
				var time = new Date(Date.parse(t)).toLocaleTimeString();
				*/
				return date;
			},
			
			prettyParseTwitterDate: function(d) {
				var date = new Date(Date.parse(d));
				return VMM.Util.date.prettyDate(date, true);
			},

			// VMM.ExternalAPI.twitter.getTweets(tweets_array);
			getTweets: function(tweets) {
				var tweetArray = [];
				var number_of_tweets = tweets.length;
				
				for(var i = 0; i < tweets.length; i++) {
					
					var twitter_id = "";
					
					
					/* FIND THE TWITTER ID
					================================================== */
					if (tweets[i].tweet.match("status\/")) {
						twitter_id = tweets[i].tweet.split("status\/")[1];
					} else if (tweets[i].tweet.match("statuses\/")) {
						twitter_id = tweets[i].tweet.split("statuses\/")[1];
					} else {
						twitter_id = "";
					}
					
					/* FETCH THE DATA
					================================================== */
					var the_url = "http://api.twitter.com/1/statuses/show.json?id=" + twitter_id + "&include_entities=true&callback=?";
					VMM.getJSON(the_url, function(d) {
						
						var tweet = {}
						/* FORMAT RESPONSE
						================================================== */
						var twit = "<div class='twitter'><blockquote><p>";
						var td = VMM.Util.linkify_with_twitter(d.text, "_blank");
						twit += td;
						twit += "</p>";
						
						twit += "— " + d.user.name + " (<a href='https://twitter.com/" + d.user.screen_name + "'>@" + d.user.screen_name + "</a>) <a href='https://twitter.com/" + d.user.screen_name + "/status/" + d.id + "'>" + VMM.ExternalAPI.twitter.prettyParseTwitterDate(d.created_at) + " </a></blockquote></div>";
						
						tweet.content = twit;
						tweet.raw = d;
						
						tweetArray.push(tweet);
						
						
						/* CHECK IF THATS ALL OF THEM
						================================================== */
						if (tweetArray.length == number_of_tweets) {
							var the_tweets = {tweetdata: tweetArray}
							VMM.fireEvent(global, "TWEETSLOADED", the_tweets);
						}
					})
					.success(function() { trace("second success"); })
					.error(function() { trace("error"); })
					.complete(function() { trace("complete"); });
					
				}
					
				
			},
			
			// VMM.ExternalAPI.twitter.getTweetSearch(search string);
			getTweetSearch: function(tweets, number_of_tweets) {
				var _number_of_tweets = 40;
				if (number_of_tweets != null && number_of_tweets != "") {
					_number_of_tweets = number_of_tweets;
				}
				
				var the_url = "http://search.twitter.com/search.json?q=" + tweets + "&rpp=" + _number_of_tweets + "&include_entities=true&result_type=mixed";
				var tweetArray = [];
				VMM.getJSON(the_url, function(d) {
					
					/* FORMAT RESPONSE
					================================================== */
					for(var i = 0; i < d.results.length; i++) {
						var tweet = {}
						var twit = "<div class='twitter'><blockquote><p>";
						var td = VMM.Util.linkify_with_twitter(d.results[i].text, "_blank");
						twit += td;
						twit += "</p>";
						twit += "— " + d.results[i].from_user_name + " (<a href='https://twitter.com/" + d.results[i].from_user + "'>@" + d.results[i].from_user + "</a>) <a href='https://twitter.com/" + d.results[i].from_user + "/status/" + d.id + "'>" + VMM.ExternalAPI.twitter.prettyParseTwitterDate(d.results[i].created_at) + " </a></blockquote></div>";
						tweet.content = twit;
						tweet.raw = d.results[i];
						tweetArray.push(tweet);
					}
					var the_tweets = {tweetdata: tweetArray}
					VMM.fireEvent(global, "TWEETSLOADED", the_tweets);
				});
				
			},
			// VMM.ExternalAPI.twitter.prettyHTML(id);
			prettyHTML: function(id) {
				var id = id.toString();
				var error_obj = {
					twitterid: id
				};
				var the_url = "http://api.twitter.com/1/statuses/show.json?id=" + id + "&include_entities=true&callback=?";
				trace("id " + id);
				var twitter_timeout = setTimeout(VMM.ExternalAPI.twitter.notFoundError, 4000, id);
				VMM.getJSON(the_url, VMM.ExternalAPI.twitter.formatJSON)
				
					.error(function(jqXHR, textStatus, errorThrown) {
						trace("TWITTER error");
						trace("TWITTER ERROR: " + textStatus + " " + jqXHR.responseText);
						VMM.attachElement("#twitter_"+id, "<p>ERROR LOADING TWEET " + id + "</p>" );
					})
					.success(function() {
						clearTimeout(twitter_timeout);
					});
					
				
			},
			
			notFoundError: function(id) {
				trace("TWITTER JSON ERROR TIMEOUT " + id);
				VMM.attachElement("#twitter_" + id, "<p>TWEET NOT FOUND " + id + "</p>"  );
			},
			
			formatJSON: function(d) {
				trace("TWITTER JSON LOADED F");
				trace(d);
				var id = d.id_str;
				
				var twit = "<blockquote><p>";
				var td = VMM.Util.linkify_with_twitter(d.text, "_blank");
				//td = td.replace(/(@([\w]+))/g,"<a href='http://twitter.com/$2' target='_blank'>$1</a>");
				//td = td.replace(/(#([\w]+))/g,"<a href='http://twitter.com/#search?q=%23$2' target='_blank'>$1</a>");
				twit += td;
				twit += "</p></blockquote>";
				twit += " <a href='https://twitter.com/" + d.user.screen_name + "/status/" + d.id + "' target='_blank' alt='link to original tweet' title='link to original tweet'>" + "<span class='created-at'></span>" + " </a>";
				twit += "<div class='vcard author'>";
				twit += "<a class='screen-name url' href='https://twitter.com/" + d.user.screen_name + "' data-screen-name='" + d.user.screen_name + "' target='_blank'>";
				twit += "<span class='avatar'><img src=' " + d.user.profile_image_url + "'  alt=''></span>";
				twit += "<span class='fn'>" + d.user.name + "</span>";
				twit += "<span class='nickname'>@" + d.user.screen_name + "</span>";
				twit += "</a>";
				twit += "</div>";
				
				VMM.attachElement("#twitter_"+id.toString(), twit );
				
			}
			
		},
		
		//VMM.ExternalAPI.googlemaps.getMap()
		googlemaps: {
			/*
				//http://gsp2.apple.com/tile?api=1&style=slideshow&layers=default&lang=en_US&z={z}&x={x}&y={y}&v=9
				
				http://maps.google.com/maps?q=chicago&hl=en&sll=41.874961,-87.619054&sspn=0.159263,0.351906&t=t&hnear=Chicago,+Cook,+Illinois&z=11&output=kml
				http://maps.google.com/maps/ms?msid=215143221704623082244.0004a53ad1e3365113a32&msa=0
				http://maps.google.com/maps/ms?msid=215143221704623082244.0004a53ad1e3365113a32&msa=0&output=kml
				http://maps.google.com/maps/ms?msid=215143221704623082244.0004a21354b1a2f188082&msa=0&ll=38.719738,-9.142599&spn=0.04172,0.087976&iwloc=0004a214c0e99e2da91e0
				http://maps.google.com/maps?q=Bavaria&hl=en&ll=47.597829,9.398804&spn=1.010316,2.709503&sll=37.0625,-95.677068&sspn=73.579623,173.408203&hnear=Bavaria,+Germany&t=m&z=10&output=embed
			*/
			getMap: function(url, id) {
				var map_vars = VMM.Util.getUrlVars(url);
				trace(map_vars);
				var map_url = "http://maps.googleapis.com/maps/api/js?key=" + Aes.Ctr.decrypt(VMM.master_config.keys.google, VMM.master_config.vp, 256) + "&libraries=places&sensor=false&callback=VMM.ExternalAPI.googlemaps.onMapAPIReady";
				var map = {
					url: url,
					vars: map_vars,
					id: id
				}
				
				if (VMM.master_config.googlemaps.active) {
					VMM.master_config.googlemaps.createMap(map);
				} else {
					
					VMM.master_config.googlemaps.que.push(map);
					
					if (VMM.master_config.googlemaps.api_loaded) {
						
					} else {
						
						VMM.LoadLib.js(map_url, function() {
							trace("Google Maps API Library Loaded");
						});
					}
					
				}
				

				
			},
			
			onMapAPIReady: function() {
				VMM.master_config.googlemaps.map_active = true;
				VMM.master_config.googlemaps.places_active = true;
				VMM.ExternalAPI.googlemaps.onAPIReady();
			},
			onPlacesAPIReady: function() {
				VMM.master_config.googlemaps.places_active = true;
				VMM.ExternalAPI.googlemaps.onAPIReady();
			},
			onAPIReady: function() {
				if (!VMM.master_config.googlemaps.active) {
					if (VMM.master_config.googlemaps.map_active && VMM.master_config.googlemaps.places_active) {
						VMM.master_config.googlemaps.active = true;
						for(var i = 0; i < VMM.master_config.googlemaps.que.length; i++) {
							VMM.ExternalAPI.googlemaps.createMap(VMM.master_config.googlemaps.que[i]);
						}
					}
				}
			},
			

			
			
			map_subdomains: ["", "a.", "b.", "c.", "d."],
			
			
			map_attribution: {
				"stamen": "Map tiles by <a href='http://stamen.com'>Stamen Design</a>, under <a href='http://creativecommons.org/licenses/by/3.0'>CC BY 3.0</a>. Data by <a href='http://openstreetmap.org'>OpenStreetMap</a>, under <a href='http://creativecommons.org/licenses/by-sa/3.0'>CC BY SA</a>.",
				"apple": "Map data &copy; 2012  Apple, Imagery &copy; 2012 Apple"
			},
						
			map_providers: {
				"toner": {
					"url": "http://{S}tile.stamen.com/toner/{Z}/{X}/{Y}.png",
					"minZoom": 0,
					"maxZoom": 20,
					"attribution": "stamen"
					
				},
				"toner-lines": {
					"url": "http://{S}tile.stamen.com/toner-lines/{Z}/{X}/{Y}.png",
					"minZoom": 0,
					"maxZoom": 20,
					"attribution": "stamen"
				},
				"toner-labels": {
					"url": "http://{S}tile.stamen.com/toner-labels/{Z}/{X}/{Y}.png",
					"minZoom": 0,
					"maxZoom": 20,
					"attribution": "stamen"
				},
				"sterrain": {
					"url": "http://{S}tile.stamen.com/terrain/{Z}/{X}/{Y}.jpg",
					"minZoom": 4,
					"maxZoom": 20,
					"attribution": "stamen"
				},
				"apple": {
					"url": "http://gsp2.apple.com/tile?api=1&style=slideshow&layers=default&lang=en_US&z={z}&x={x}&y={y}&v=9",
					"minZoom": 4,
					"maxZoom": 20,
					"attribution": "apple"
				},
				"watercolor": {
					"url": "http://{S}tile.stamen.com/watercolor/{Z}/{X}/{Y}.jpg",
					"minZoom": 3,
					"maxZoom": 16,
					"attribution": "stamen"
				}
			},
			
			createMap: function(m) {
				trace(VMM.ExternalAPI.googlemaps.stamen_map_attribution);
				/* 	MAP PROVIDERS
					Including Stamen Maps
					http://maps.stamen.com/
					Except otherwise noted, each of these map tile sets are © Stamen Design, under a Creative Commons Attribution (CC BY 3.0) license.
				================================================== */
				
				var map_attribution = "";
				
				function mapProvider(name) {
					if (name in VMM.ExternalAPI.googlemaps.map_providers) {
						map_attribution = VMM.ExternalAPI.googlemaps.map_attribution[VMM.ExternalAPI.googlemaps.map_providers[name].attribution];
						return VMM.ExternalAPI.googlemaps.map_providers[name];
					} else {
						throw 'No such provider: "' + name + '"';
					}
				}
				
				google.maps.VeriteMapType = function(name) {
					var provider = mapProvider(name);
					return google.maps.ImageMapType.call(this, {
						"getTileUrl": function(coord, zoom) {
							var index = (zoom + coord.x + coord.y) % VMM.ExternalAPI.googlemaps.map_subdomains.length;
							return [
								provider.url
									.replace("{S}", VMM.ExternalAPI.googlemaps.map_subdomains[index])
									.replace("{Z}", zoom)
									.replace("{X}", coord.x)
									.replace("{Y}", coord.y)
									.replace("{z}", zoom)
									.replace("{x}", coord.x)
									.replace("{y}", coord.y)
							];
						},
						"tileSize": new google.maps.Size(256, 256),
						"name":     name,
						"minZoom":  provider.minZoom,
						"maxZoom":  provider.maxZoom
					});
				};
				
				google.maps.VeriteMapType.prototype = new google.maps.ImageMapType("_");
				
				/* Make the Map
				================================================== */
				var layer;
				
				
				if (type.of(VMM.master_config.Timeline.maptype) == "string") {
					layer = VMM.master_config.Timeline.maptype;
				} else {
					layer = "toner";
				}
				
				var location = new google.maps.LatLng(41.875696,-87.624207);
				var latlong;
				var zoom = 11;
				var has_location = false;
				var has_zoom = false;
				var map_bounds;
				
				if (type.of(VMM.Util.getUrlVars(m.url)["ll"]) == "string") {
					has_location = true;
					latlong = VMM.Util.getUrlVars(m.url)["ll"].split(",");
					location = new google.maps.LatLng(parseFloat(latlong[0]),parseFloat(latlong[1]));
					
				} else if (type.of(VMM.Util.getUrlVars(m.url)["sll"]) == "string") {
					has_location = true;
					latlong = VMM.Util.getUrlVars(m.url)["sll"].split(",");
					location = new google.maps.LatLng(parseFloat(latlong[0]),parseFloat(latlong[1]));
					
				} 
				
				if (type.of(VMM.Util.getUrlVars(m.url)["z"]) == "string") {
					has_zoom = true;
					zoom = parseFloat(VMM.Util.getUrlVars(m.url)["z"]);
				}
				
				var map_options = {
					zoom:zoom,
					disableDefaultUI: true,
					mapTypeControl: false,
					zoomControl: true,
					zoomControlOptions: {
						style: google.maps.ZoomControlStyle.SMALL,
						position: google.maps.ControlPosition.TOP_RIGHT
					},
					center: location,
					mapTypeId: layer,
					mapTypeControlOptions: {
				        mapTypeIds: [layer]
				    }
				}
				
				var unique_map_id = m.id.toString() + "_gmap";
				VMM.attachElement("#" + m.id, "<div class='google-map' id='" + unique_map_id + "' style='width=100%;height=100%;'></div>");
				/* ATTRIBUTION
				================================================== */
				//var map_attribution_html = "<div class='map-attribution'><div class='attribution-text'>" + map_attribution + "</div></div>";
				//VMM.appendElement("#" + m.id, map_attribution_html);
				
				var map = new google.maps.Map(document.getElementById(unique_map_id), map_options);
				map.mapTypes.set(layer, new google.maps.VeriteMapType(layer));
				
				/* ATTRIBUTION
				================================================== */
				var map_attribution_html = "<div class='map-attribution'><div class='attribution-text'>" + map_attribution + "</div></div>";
				VMM.appendElement("#"+unique_map_id, map_attribution_html);
				//.map-attribution
				//.attribution-text 
				
				loadKML();
				
				/* KML
				================================================== */
				function loadKML() {
					var kml_url = m.url + "&output=kml";
					kml_url = kml_url.replace("&output=embed", "");
					
					var kml_layer = new google.maps.KmlLayer(kml_url, {preserveViewport:true});
					kml_layer.setMap(map);
					
					var infowindow = new google.maps.InfoWindow();

					google.maps.event.addListenerOnce(kml_layer, "defaultviewport_changed", function() {
						
						
						
						if (has_location) {
							map.panTo(location);
						} 
						
						if (has_zoom) {
							map.setZoom(zoom);
						} else {
							map.fitBounds(kml_layer.getDefaultViewport() );
						}
						
						
					});

					google.maps.event.addListener(kml_layer, 'click', function(kmlEvent) {
						var text = kmlEvent.featureData.description;
						trace(kmlEvent.featureData.infoWindowHtml)
						showInfoWindow(text);
						function showInfoWindow(c) {
							//trace("showInfoWindow")
							infowindow.setContent(c);
							infowindow.open(map);
						}
					});
				}
				
			},
			
		},
		
		//VMM.ExternalAPI.flickr.getPhoto(mediaID, htmlID);
		flickr: {
			
			getPhoto: function(mid, id) {
				// http://api.flickr.com/services/rest/?method=flickr.photos.getSizes&api_key=6d6f59d8d30d79f4f402a7644d5073e3&photo_id=6115056146&format=json&nojsoncallback=1
				var the_url = "http://api.flickr.com/services/rest/?method=flickr.photos.getSizes&api_key=" + Aes.Ctr.decrypt(VMM.master_config.keys.flickr, VMM.master_config.vp, 256) + "&photo_id=" + mid + "&format=json&jsoncallback=?";
				VMM.getJSON(the_url, VMM.ExternalAPI.flickr.setPhoto);
			},
			
			setPhoto: function(d) {
				var flickr_id = d.sizes.size[0].url.split("photos\/")[1].split("/")[1];
				var id = "flickr_" + flickr_id;
				var flickr_large_id = id + "_large";
				var flickr_thumb_id = id + "_thumb";
				var flickr_img_large = d.sizes.size[d.sizes.size.length - 1].source;
				var flickr_img_thumb = d.sizes.size[0].source;
				VMM.Element.attr("#"+flickr_large_id, "src", flickr_img_large);
				VMM.Element.attr("#"+flickr_thumb_id, "src", flickr_img_thumb);
			}
			
			
		},
		
		soundcloud: {
			// VMM.ExternalAPI.soundcloud.getSound(url, id)
			/* 
				REFORMAT TO USE API FOR CUSTOM PLAYERS
			*/
			getSound: function(url, id) {
				// http://soundcloud.com/oembed?iframe=true&url=http://soundcloud.com/erasedtapes/olafur-arnalds-poland
				var the_url = "http://soundcloud.com/oembed?url=" + url + "&format=js&callback=?";
				VMM.getJSON(the_url, function(d) {
					VMM.attachElement("#"+id, d.html );
				});
			},
			
		},
		
		// VMM.ExternalAPI.youtube.init(id);
		youtube: {
			init: function(id) {
				
				if (VMM.master_config.youtube.active) {
					VMM.master_config.youtube.createPlayer(id);
				} else {
					
					VMM.master_config.youtube.que.push(id);
					
					if (VMM.master_config.youtube.api_loaded) {
						
					} else {
						
						VMM.LoadLib.js('http://www.youtube.com/player_api', function() {
							trace("YouTube API Library Loaded");
						});
					}
					
				}
			},
			
			onAPIReady: function() {
				trace("YOUTUBE API READY")
				VMM.master_config.youtube.active = true;
				
				for(var i = 0; i < VMM.master_config.youtube.que.length; i++) {
					VMM.ExternalAPI.youtube.createPlayer(VMM.master_config.youtube.que[i]);
				}
			},
			// VMM.ExternalAPI.youtube.createPlayer(id);
			createPlayer: function(id) {
				var p = {
					active:false,
					player: {},
					name:'youtube_'+id,
					playing:false
				};
				
				p.player['youtube_'+id] = new YT.Player('youtube_'+id, {
					height: '390',
					width: '640',
					playerVars: {
						enablejsapi:1,
						color: 'white',
						showinfo:0,
						theme: 'light',
						rel:0,
						origin:'http://timeline.verite.co'
					},
					videoId: id,
					events: {
						'onReady': VMM.ExternalAPI.youtube.onPlayerReady,
						'onStateChange': VMM.ExternalAPI.youtube.onStateChange
					}
				});
				
				VMM.master_config.youtube.array.push(p);
			},
			
			//VMM.ExternalAPI.youtube.stopPlayers();
			stopPlayers: function() {
				for(var i = 0; i < VMM.master_config.youtube.array.length; i++) {				
					if (VMM.master_config.youtube.array[i].playing) {
						var the_name = VMM.master_config.youtube.array[i].name;
						VMM.master_config.youtube.array[i].player[the_name].stopVideo();
					}
				}
			},
			
			onStateChange: function(e) {
				for(var i = 0; i < VMM.master_config.youtube.array.length; i++) {
					var the_name = VMM.master_config.youtube.array[i].name;
					if (VMM.master_config.youtube.array[i].player[the_name] == e.target) {
						if (e.data == YT.PlayerState.PLAYING) {
							VMM.master_config.youtube.array[i].playing = true;
						}
					}
				}
			},
			
			onPlayerReady: function(e) {
				
			}
			
			
		}
	}
	
	
	/* MEDIA
	================================================== */
	// something = new VMM.Media(parent, w, h, {thedata});
	VMM.Media = function(parent, w, h, thedata) {  
		
		/* PRIVATE VARS
		================================================== */
		var data = {}; // HOLDS DATA
		
		var _valid = false;
		
		var config = {
			width: 720,
			height: 400,
			content_width: 720,
			content_height: 400,
			ease: "easeInOutExpo",
			duration: 1000,
			spacing: 15
		};
		/* ELEMENTS
		================================================== */
		var $media = "";
		var $container = "";
		var $mediacontainer  = "";
		var $mediaelement = "";
		var layout = parent; // expecting media div
		
		if (w != null && w != "") {config.width = w};
		if (h != null && h != "") {config.height = h};
		/*
		if (typeof thedata != "undefined") {
			data = thedata;
			this.init(data);
		}
		*/
		/* PUBLIC FUNCTIONS
		================================================== */
		this.init = function(d) {
			if(typeof d != 'undefined') {
				this.setData(d);
			} else {
				trace("WAITING ON DATA");
			}
		};
		
		var build = function(media, caption, credit) {
			
			$media = VMM.appendAndGetElement(layout, "<div>", "media");
			$container = VMM.appendAndGetElement($media, "<div>", "container");
			$mediacontainer = VMM.appendAndGetElement($container, "<div>", "media-container");
			

			if (data.media != null && data.media != "") {

				_valid = true;
				var m = {};
				
				m = VMM.MediaType(data.media); //returns an object with .type and .id
				
				if (m.type == "image") {
					VMM.appendElement($mediacontainer, "<img src='" + m.id + "'>");  
				} else if (m.type == "youtube") {
					VMM.appendElement($mediacontainer, "<iframe frameborder='0' src='http://www.youtube.com/embed/" + m.id + "?&rel=0&theme=light&showinfo=0&hd=1&autohide=0&color=white' allowfullscreen>");
				} else if (m.type == "vimeo") {
					VMM.appendElement($mediacontainer, "<iframe frameborder='0' src='http://player.vimeo.com/video/" + m.id + "?title=0&amp;byline=0&amp;portrait=0&amp;color=ffffff'>");
				} else {
					
				}
				
				// CREDIT
				if (data.credit != null && data.credit != "") {
					VMM.appendElement($container, VMM.createElement("div", data.credit, "credit"));
				}

				// CAPTION
				if (data.caption != null && data.caption != "") {
					VMM.appendElement($container, VMM.createElement("div", data.caption, "caption"));
				}

			}
	    };
	
		
	
		/* GETTERS AND SETTERS
		================================================== */
		
		this.setData = function(d) {
			if(typeof d != 'undefined') {
				data = d;
				build();
			} else{
				trace("NO DATA");
			}
		};
		
		/* RESIZE
		================================================== */
		
		function reSize() {

		}
		


	}
	
	// Less expensive to use prototype
	
	VMM.Media.prototype.height = function(h) {
		if (h != null && h != "") {
			config.height = h;
			reSize();
		} else {
			return config.height;
		}
	};
	
	VMM.Media.prototype.width = function(w) {
		if (w != null && w != "") {
			config.width = w;
			reSize();
		} else {
			return config.width;
		}
	};
	
	/* GETTERS AND SETTERS
	================================================== */
	
	VMM.Media.prototype.getData = function() {
		return data;
	};
	
	VMM.Media.prototype.setConfig = function(d) {
		if(typeof d != 'undefined') {
			config = d;
		} else{
			trace("NO CONFIG DATA");
		}
	};
	
	VMM.Media.prototype.getConfig = function() {
		return config;
	};
	
	VMM.Media.prototype.setSize = function(w, h) {
		if (w != null) {config.width = w};
		if (h != null) {config.height = h};
		if (_active) {
			reSize();
		}
		
	}
	
	
	VMM.Media.prototype.active = function() {
		return _active;
	};
	
	
}



/* Trace (console.log)
================================================== */
function trace( msg ) {
	if (window.console) {
		console.log(msg);
	} else if ( typeof( jsTrace ) != 'undefined' ) {
		jsTrace.send( msg );
	} else {
		//alert(msg);
	}
}

/* Extending Date to include Week
================================================== */
Date.prototype.getWeek = function() {
	var onejan = new Date(this.getFullYear(),0,1);
	return Math.ceil((((this - onejan) / 86400000) + onejan.getDay()+1)/7);
}

/* Extending Date to include Day of Year
================================================== */
Date.prototype.getDayOfYear = function() {
	var onejan = new Date(this.getFullYear(),0,1);
	return Math.ceil((this - onejan) / 86400000);
}

/* A MORE SPECIFIC TYPEOF();
//	http://rolandog.com/archives/2007/01/18/typeof-a-more-specific-typeof/
================================================== */
// type.of()
var is={
	Null:function(a){return a===null;},
	Undefined:function(a){return a===undefined;},
	nt:function(a){return(a===null||a===undefined);},
	Function:function(a){return(typeof(a)==="function")?a.constructor.toString().match(/Function/)!==null:false;},
	String:function(a){return(typeof(a)==="string")?true:(typeof(a)==="object")?a.constructor.toString().match(/string/i)!==null:false;},
	Array:function(a){return(typeof(a)==="object")?a.constructor.toString().match(/array/i)!==null||a.length!==undefined:false;},
	Boolean:function(a){return(typeof(a)==="boolean")?true:(typeof(a)==="object")?a.constructor.toString().match(/boolean/i)!==null:false;},
	Date:function(a){return(typeof(a)==="date")?true:(typeof(a)==="object")?a.constructor.toString().match(/date/i)!==null:false;},
	HTML:function(a){return(typeof(a)==="object")?a.constructor.toString().match(/html/i)!==null:false;},
	Number:function(a){return(typeof(a)==="number")?true:(typeof(a)==="object")?a.constructor.toString().match(/Number/)!==null:false;},
	Object:function(a){return(typeof(a)==="object")?a.constructor.toString().match(/object/i)!==null:false;},
	RegExp:function(a){return(typeof(a)==="function")?a.constructor.toString().match(/regexp/i)!==null:false;}
};
var type={
	of:function(a){
		for(var i in is){
			if(is[i](a)){
				return i.toLowerCase();
			}
		}
	}
};

/*  YOUTUBE API READY
	Can't find a way to customize this callback and keep it in the VMM namespace
	Youtube wants it to be this function. 
================================================== */
function onYouTubePlayerAPIReady() {
	trace("GLOBAL YOUTUBE API CALLED")
	VMM.ExternalAPI.youtube.onAPIReady();
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


