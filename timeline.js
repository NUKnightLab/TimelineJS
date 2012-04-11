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




/*********************************************** 
     Begin VMM.Core.js 
***********************************************/ 

/* Core
================================================== */


/* Slider
================================================== */
if(typeof VMM != 'undefined' && typeof VMM.Slider == 'undefined') {
	
	VMM.Slider = function(parent, content_width, content_height, is_timeline) {
		
		
		/* PRIVATE VARS
		================================================== */
		var _private_var = "private";
		var events = {}; // CUSTOM EVENT HOLDER
		var data = []; // HOLDS SLIDE DATA
		var slides_content = "";
		var slides = [];
		var medias = [];
		var current_slide = 0;
		var current_width = 960;
		var touch = {
			move: false,
			x: 10,
			y:0,
			off: 0,
			dampen: 48
		};
		var slide_positions = [];
		
		var config = {
			interval: 10,
			something: 0,
			width: 720,
			height: 400,
			content_width: 720,
			content_height: 400,
			content_padding: 130,
			ease: "easeInOutExpo",
			duration: 1000,
			nav_width: 100,
			nav_height: 200,
			timeline: false,
			spacing: 15,
		};
		
		
		
		var slider_width = 1000;
		
		if (content_width != null && content_width != "") {
			config.width = content_width;
		} 
		if (content_height != null && content_height != "") {
			config.height = content_height;
		} 
		if (is_timeline != null && is_timeline != "") {
			config.timeline = is_timeline;
		}
		
		var content = "";
		var _active = false;
		
		/* ELEMENTS
		================================================== */
		var $slider = "";
		var $slider_mask = "";
		var $slider_container = "";
		var $slides_items = "";
		//var $slide = "";
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
		this.init = function(d) {
			if(typeof d != 'undefined') {
				this.setData(d);
			} else {
				trace("WAITING ON DATA");
			}
		};
		
		this.width = function(w) {
			if (w != null && w != "") {
				config.width = w;
				reSize();
			} else {
				return config.width;
			}
		}
		
		this.height = function(h) {
			if (h != null && h != "") {
				config.height = h;
				reSize();
			} else {
				return config.height;
			}
		}
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
		
		this.getData = function() {
			return data;
		};
		
		this.setConfig = function(d) {
			if(typeof d != 'undefined') {
				config = d;
				// TO DO
				// FIRE AN EVENT ETC
			} else{
				trace("NO CONFIG DATA");
			}
		}
		
		this.getConfig = function() {
			return config;
		};
		
		this.setSize = function(w, h) {
			if (w != null) {config.width = w};
			if (h != null) {config.height = h};
			if (_active) {
				reSize();
			}
			
		}
		
		this.active = function() {
			return _active;
		};
		
		this.getCurrentNumber = function() {
			return current_slide;
		};
		
		this.setSlide = function(n) {
			goToSlide(n);
		};

		
		/* ON EVENT
		================================================== */
		
		function onConfigSet() {
			trace("onConfigSet");
		};
		
		
		function reSize(go_to_slide, from_start) {
			
			var _go_to_slide = true;
			var _from_start = false;
			
			if (go_to_slide != null) {_go_to_slide = go_to_slide};
			if (from_start != null) {_from_start = from_start};
			
			current_width = config.width;
			
			config.nav_height = VMM.Element.height(navigation.prevBtnContainer);
			
			config.content_width = current_width - (config.content_padding *2);
			
			VMM.Element.width($slides_items, (slides.length * config.content_width));
			
			if (_from_start) {
				var _pos = VMM.Element.position(slides[current_slide]);
				VMM.Element.css($slider_container, "left", _pos.left);
			}
			
			
			// Position slides
			positionSlides();
			
			// Position Nav
			VMM.Element.css(navigation.nextBtn, "left", (current_width - config.nav_width));
			VMM.Element.height(navigation.prevBtn, config.height);
			VMM.Element.height(navigation.nextBtn, config.height);
			VMM.Element.css(navigation.nextBtnContainer, "top", ( (config.height/2) - (config.nav_height/2) ) );
			VMM.Element.css(navigation.prevBtnContainer, "top", ( (config.height/2) - (config.nav_height/2) ) );
			
			// Animate Changes
			VMM.Element.height($slider_mask, config.height);
			VMM.Element.width($slider_mask, current_width);
			
			if (_go_to_slide) {
				goToSlide(current_slide, "linear", 1);
			};
			
			if (current_slide == 0) {
				VMM.Element.visible(navigation.prevBtn, false);
			}
			
		}
		
		function onNextClick(e) {
			if (current_slide == slides.length - 1) {
				VMM.Element.animate($slider_container, config.duration, config.ease, {"left": -(VMM.Element.position(slides[current_slide]).left)});
			} else {
				goToSlide(current_slide+1);
				upDate();
			}
			
		}
		
		function onPrevClick(e) {
			if (current_slide == 0) {
				goToSlide(current_slide);
			} else {
				goToSlide(current_slide-1);
				upDate();
			}

		}

		function onKeypressNav(e) {
			switch(e.keyCode) {
				//right arrow
				case 39:
					onNextClick(e);
				break;

				//left arrow
				case 37:
					onPrevClick(e);
				break;
			}
		}
		
		function onTouchUpdate(e, b) {
			if (slide_positions.length == 0) {
				for(var i = 0; i < slides.length; i++) {
					var sp = VMM.Element.position(slides[i]);
					slide_positions.push(sp.left);
				}
			}
			if (typeof b.left == "number") {
				var _pos = b.left;
				if (_pos < -(VMM.Element.position(slides[current_slide]).left) - (config.width/3)) {
					onNextClick();
				} else if (_pos > -(VMM.Element.position(slides[current_slide]).left) + (config.width/3)) {
					onPrevClick();
				} else {
					VMM.Element.animate($slider_container, config.duration, config.ease, {"left": -(VMM.Element.position(slides[current_slide]).left)});
				}
			} else {
				VMM.Element.animate($slider_container, config.duration, config.ease, {"left": -(VMM.Element.position(slides[current_slide]).left)});
			}
			
			if (typeof b.top == "number") {
				VMM.Element.animate($slider_container, config.duration, config.ease, {"top": -b.top});
				//VMM.Element.animate(layout, _duration, _ease, {scrollTop: VMM.Element.prop(layout, "scrollHeight")  + b.top });
				//VMM.Element.animate(layout, _duration, _ease, {scrollTop: VMM.Element.prop(layout, "scrollHeight") + VMM.Element.height(layout) });
				//VMM.Element.animate($slider_container, config.duration, config.ease, {"top": -400});
			} else {
				
			}
		};
		
		function upDate() {
			VMM.fireEvent(layout, "UPDATE");
		};
		/* PRIVATE FUNCTIONS
		================================================== */
		
		var getData = function(d) {
			data = d;
		};
		
		/* SLIDES
		================================================== */
		// BUILD SLIDES
		var buildSlides = function(d) {
			
			// Clear out existing content
			VMM.attachElement($slides_items, "");
			
			for(var i = 0; i < d.length; i++) {
				var bw = "";
				var _slide;
				var _media;
				
				bw = VMM.createElement("div", d[i].content, "content");
				
				_slide = VMM.appendAndGetElement($slides_items, "<div>", "slider-item" , bw);
				
				slides.push(_slide);
			}
			
			
		}
		
		// POSITION SLIDES AND SIZE THEM
		var positionSlides = function() {
			
			/* SIZE SLIDES
			================================================== */
			
			VMM.Element.css(".slider-item", "width", config.content_width );
			VMM.Element.height(".slider-item", config.height);
			VMM.Element.css(".slider-item .layout-text-media .media .media-container img", "max-height", config.height - 50 );
			VMM.Element.css(".slider-item .layout-media .media .media-container img", "max-height", config.height - 150 );
			

			
			VMM.Element.css(".slider-item .media .media-container .soundcloud", "max-height", 168 );

			/* RESIZE IFRAME MEDIA ELEMENTS
			================================================== */
			//var _iframe_height = Math.round(config.height) - 60;
			var _iframe_height_full = Math.round(config.height) - 160;
			//var _iframe_width = Math.round((_iframe_height / 9) * 16);
			var _iframe_width_full = Math.round((_iframe_height_full / 9) * 16);
			
			var _iframe_width =  (config.content_width/100)*60 ;
			var _iframe_height = Math.round((_iframe_width / 16) * 9) + 25;


			// NORMAL
			VMM.Element.height(".slider-item .media .media-container .media-frame", _iframe_height);
			VMM.Element.width(".slider-item .media .media-container .media-frame", _iframe_width);
			//VMM.Element.width(".slider-item .media .media-container .media-frame", _iframe_width);
			//VMM.Element.css(".slider-item .media .media-container .media-frame", "max-width", config.content_width );
			
			// IFRAME FULL SIZE VIDEO
			VMM.Element.height(".slider-item .layout-media .media .media-container .media-frame", _iframe_height_full);
			VMM.Element.width(".slider-item .layout-media .media .media-container .media-frame", _iframe_width_full);

			// IFRAME FULL SIZE NON VIDEO
			VMM.Element.height(".slider-item .layout-media .media .media-container .soundcloud", config.height - 150);
			VMM.Element.width(".slider-item .layout-media .media .media-container .soundcloud", config.content_width);
			VMM.Element.width(".slider-item .layout-text-media .media .media-container .soundcloud", _iframe_width);
			
			// MAPS
			VMM.Element.height(".slider-item .media .media-container .map", _iframe_height_full);
			
			// MAX WIDTH
			VMM.Element.css(".slider-item .layout-text-media .media .media-container .media-frame", "max-width", config.content_width );
			//VMM.Element.width(".slider-item .layout-text-media .media .media-container .media-frame", _iframe_width);
			//VMM.Element.css(".slider-item .layout-text-media .media .media-container .media-frame", "max-height", _iframe_height );
			
			/* POSITION SLIDES
			================================================== */
			var pos = 0;
			for(var i = 0; i < slides.length; i++) {
				pos = i * (config.width+config.spacing);
				VMM.Element.css(slides[i], "left", pos);
			}
			
		}
		
		var opacitySlides = function(n) {
			var _ease = "linear";
			for(var i = 0; i < slides.length; i++) {
				if (i == current_slide) {
					VMM.Element.animate(slides[i], config.duration, _ease, {"opacity": 1});
				} else if (i == current_slide - 1) {
					VMM.Element.animate(slides[i], config.duration, _ease, {"opacity": 0.1});	
				} else if (i == current_slide + 1) {
					VMM.Element.animate(slides[i], config.duration, _ease, {"opacity": 0.1});	
				} else {
					VMM.Element.css(slides[i], "opacity", n);	
				}
				
			}
		}
		
		// Go to slide
		//goToSlide(n, ease, duration);
		var goToSlide = function(n, ease, duration, fast, firstrun) {
			
			/* STOP ANY VIDEO PLAYERS ACTIVE
			================================================== */
			VMM.ExternalAPI.youtube.stopPlayers();
			
			// Set current slide
			current_slide = n;
			
			var _ease = config.ease;
			var _duration = config.duration;
			var is_last = false;
			var is_first = false;
			
			if (current_slide == 0) {
				is_first = true;
			}
			if (current_slide +1 == slides.length) {
				is_last = true
			}
			
			if (ease != null && ease != "") {_ease = ease};
			if (duration != null && duration != "") {_duration = duration};
			
			/* get slide position
			================================================== */
			var _pos = VMM.Element.position(slides[current_slide]);
			
			/* set proper nav titles and dates etc.
			================================================== */
			if (is_first) {
				VMM.Element.visible(navigation.prevBtn, false);
			} else {
				VMM.Element.visible(navigation.prevBtn, true);
				if (config.timeline) {
					VMM.attachElement(navigation.prevDate, data[current_slide - 1].date);
				}
				VMM.attachElement(navigation.prevTitle, VMM.Util.unlinkify(data[current_slide - 1].title));
			}
			if (is_last) {
				VMM.Element.visible(navigation.nextBtn, false);
			} else {
				VMM.Element.visible(navigation.nextBtn, true);
				if (config.timeline) {
					VMM.attachElement(navigation.nextDate, data[current_slide + 1].date);
				}
				VMM.attachElement(navigation.nextTitle,  VMM.Util.unlinkify(data[current_slide + 1].title) );
			}
			
			/* ANIMATE SLIDE
			================================================== */
			if (fast) {
				VMM.Element.css($slider_container, "left", -(_pos.left - config.content_padding));	
			} else{
				VMM.Element.stop($slider_container);
				VMM.Element.animate($slider_container, _duration, _ease, {"left": -(_pos.left - config.content_padding)});
			}
			
			if (firstrun) {
				VMM.fireEvent(layout, "LOADED");
			}
			
			/* SET Vertical Scoll
			================================================== */
			//opacitySlides(0.85);
			if (VMM.Element.height(slides[current_slide]) > config.height) {
				VMM.Element.css(".slider", "overflow-y", "scroll" );
			} else {
				VMM.Element.css(layout, "overflow-y", "hidden" );
			   VMM.Element.animate(layout, _duration, _ease, {scrollTop: VMM.Element.prop(layout, "scrollHeight") - VMM.Element.height(layout) });
				
			}
			
			
		}

		/* NAVIGATION
		================================================== */
		var buildNavigation = function() {
			
			var temp_icon = "<div class='icon'>&nbsp;</div>";
			
			navigation.nextBtn = VMM.appendAndGetElement($slider, "<div>", "nav-next");
			navigation.prevBtn = VMM.appendAndGetElement($slider, "<div>", "nav-previous");
			navigation.nextBtnContainer = VMM.appendAndGetElement(navigation.nextBtn, "<div>", "nav-container", temp_icon);
			navigation.prevBtnContainer = VMM.appendAndGetElement(navigation.prevBtn, "<div>", "nav-container", temp_icon);
			if (config.timeline) {
				navigation.nextDate = VMM.appendAndGetElement(navigation.nextBtnContainer, "<div>", "date", "1957");
				navigation.prevDate = VMM.appendAndGetElement(navigation.prevBtnContainer, "<div>", "date", "1957");
			}
			navigation.nextTitle = VMM.appendAndGetElement(navigation.nextBtnContainer, "<div>", "title", "Title Goes Here");
			navigation.prevTitle = VMM.appendAndGetElement(navigation.prevBtnContainer, "<div>", "title", "Title Goes Here");
			
			VMM.bindEvent(".nav-next", onNextClick);
			VMM.bindEvent(".nav-previous", onPrevClick);
			VMM.bindEvent(window, onKeypressNav, 'keydown');
		}
		
		/* BUILD
		================================================== */
		var build = function() {
			
			// Clear out existing content
			VMM.attachElement(layout, "");
			
			// Get DOM Objects to local objects
			$slider = VMM.getElement("div.slider");
			$slider_mask = VMM.appendAndGetElement($slider, "<div>", "slider-container-mask");
			$slider_container = VMM.appendAndGetElement($slider_mask, "<div>", "slider-container");
			$slides_items = VMM.appendAndGetElement($slider_container, "<div>", "slider-item-container");
			
			// BUILD NAVIGATION
			buildNavigation();

			// ATTACH SLIDES
			buildSlides(data);
			
			/* MAKE SLIDER TOUCHABLE
			================================================== */
			
			var __duration = 3000;
			
			if (VMM.Browser.device == "tablet" || VMM.Browser.device == "mobile") {
				config.duration = 500;
				__duration = 1000;
				VMM.TouchSlider.createPanel($slider_container, $slider_container, VMM.Element.width(slides[0]), config.spacing, true);
				VMM.bindEvent($slider_container, onTouchUpdate, "TOUCHUPDATE");
			} else if (VMM.Browser.device == "mobile") {
				
			} else {
				//VMM.DragSlider.createPanel($slider_container, $slider_container, VMM.Element.width(slides[0]), config.spacing, true);
			}
			
			reSize(false, true);
			VMM.Element.visible(navigation.prevBtn, false);
			// GO TO FIRST SLIDE
			goToSlide(0, "easeOutExpo", __duration, true, true);
			
			_active = true;
		};
		
	};
	
	
	

}






/*********************************************** 
     Begin VMM.Util.js 
***********************************************/ 

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

/*********************************************** 
     Begin VMM.LoadLib.js 
***********************************************/ 

/*
	LoadLib
	Based on LazyLoad by Ryan Grove
	https://github.com/rgrove/lazyload/ 
	Copyright (c) 2011 Ryan Grove <ryan@wonko.com>
	All rights reserved.

	Permission is hereby granted, free of charge, to any person obtaining a copy of
	this software and associated documentation files (the 'Software'), to deal in
	the Software without restriction, including without limitation the rights to
	use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
	the Software, and to permit persons to whom the Software is furnished to do so,
	subject to the following conditions:

	The above copyright notice and this permission notice shall be included in all
	copies or substantial portions of the Software.

================================================== */
window.loadedJS = [];


if(typeof VMM != 'undefined' && typeof VMM.LoadLib == 'undefined') {
	//VMM.LoadLib.js('http://ajax.googleapis.com/ajax/libs/jquery/1.7.1/jquery.min.js', onJQueryLoaded);
	//VMM.LoadLib.css('http://someurl.css', onCSSLoaded);
	
	
	
	VMM.LoadLib = (function (doc) {
		var env,
		head,
		pending = {},
		pollCount = 0,
		queue = {css: [], js: []},
		styleSheets = doc.styleSheets;
	
		var loaded_Array = [];
	
		function isLoaded(url) {
			var has_been_loaded = false;
			for(var i=0; i<loaded_Array.length; i++) {
				if (loaded_Array[i] == url) {
					has_been_loaded = true;
				}
			}
			if (!has_been_loaded) {
				loaded_Array.push(url);
			}
			return has_been_loaded;
		}

		function createNode(name, attrs) {
			var node = doc.createElement(name), attr;

			for (attr in attrs) {
				if (attrs.hasOwnProperty(attr)) {
					node.setAttribute(attr, attrs[attr]);
				}
			}

			return node;
		}

	  function finish(type) {
	    var p = pending[type],
	        callback,
	        urls;

	    if (p) {
	      callback = p.callback;
	      urls     = p.urls;
	      urls.shift();
	      pollCount = 0;
	      if (!urls.length) {
	        callback && callback.call(p.context, p.obj);
	        pending[type] = null;
	        queue[type].length && load(type);
	      }
	    }
	  }

	  function getEnv() {
	    var ua = navigator.userAgent;

	    env = {

	      async: doc.createElement('script').async === true
	    };

	    (env.webkit = /AppleWebKit\//.test(ua))
	      || (env.ie = /MSIE/.test(ua))
	      || (env.opera = /Opera/.test(ua))
	      || (env.gecko = /Gecko\//.test(ua))
	      || (env.unknown = true);
	  }

	  function load(type, urls, callback, obj, context) {
	    var _finish = function () { finish(type); },
	        isCSS   = type === 'css',
	        nodes   = [],
	        i, len, node, p, pendingUrls, url;

	    env || getEnv();

	    if (urls) {

	      urls = typeof urls === 'string' ? [urls] : urls.concat();

	      if (isCSS || env.async || env.gecko || env.opera) {

	        queue[type].push({
	          urls    : urls,
	          callback: callback,
	          obj     : obj,
	          context : context
	        });
	      } else {
	        for (i = 0, len = urls.length; i < len; ++i) {
	          queue[type].push({
	            urls    : [urls[i]],
	            callback: i === len - 1 ? callback : null,
	            obj     : obj,
	            context : context
	          });
	        }
	      }
	    }

	    if (pending[type] || !(p = pending[type] = queue[type].shift())) {
	      return;
	    }

	    head || (head = doc.head || doc.getElementsByTagName('head')[0]);
	    pendingUrls = p.urls;

	    for (i = 0, len = pendingUrls.length; i < len; ++i) {
	      url = pendingUrls[i];

	      if (isCSS) {
	          node = env.gecko ? createNode('style') : createNode('link', {
	            href: url,
	            rel : 'stylesheet'
	          });
	      } else {
	        node = createNode('script', {src: url});
	        node.async = false;
	      }

	      node.className = 'lazyload';
	      node.setAttribute('charset', 'utf-8');

	      if (env.ie && !isCSS) {
	        node.onreadystatechange = function () {
	          if (/loaded|complete/.test(node.readyState)) {
	            node.onreadystatechange = null;
	            _finish();
	          }
	        };
	      } else if (isCSS && (env.gecko || env.webkit)) {
	        if (env.webkit) {
	          p.urls[i] = node.href; 
	          pollWebKit();
	        } else {
	          node.innerHTML = '@import "' + url + '";';
	          pollGecko(node);
	        }
	      } else {
	        node.onload = node.onerror = _finish;
	      }

	      nodes.push(node);
	    }

	    for (i = 0, len = nodes.length; i < len; ++i) {
	      head.appendChild(nodes[i]);
	    }
	  }

	  function pollGecko(node) {
	    var hasRules;

	    try {

	      hasRules = !!node.sheet.cssRules;
	    } catch (ex) {
	      pollCount += 1;

	      if (pollCount < 200) {
	        setTimeout(function () { pollGecko(node); }, 50);
	      } else {

	        hasRules && finish('css');
	      }

	      return;
	    }

	    finish('css');
	  }

	  function pollWebKit() {
	    var css = pending.css, i;

	    if (css) {
	      i = styleSheets.length;

	      while (--i >= 0) {
	        if (styleSheets[i].href === css.urls[0]) {
	          finish('css');
	          break;
	        }
	      }

	      pollCount += 1;

	      if (css) {
	        if (pollCount < 200) {
	          setTimeout(pollWebKit, 50);
	        } else {

	          finish('css');
	        }
	      }
	    }
	  }

	  return {

		css: function (urls, callback, obj, context) {
			if (isLoaded(urls)) {
				return callback;
			} else {
				load('css', urls, callback, obj, context);
			}
		},

		js: function (urls, callback, obj, context) {
			if (isLoaded(urls)) {
				return callback;
			} else {
				load('js', urls, callback, obj, context);
			}
		}

	  };
	})(this.document);
}



/*********************************************** 
     Begin bootstrap-tooltip.js 
***********************************************/ 

/* ===========================================================
 * bootstrap-tooltip.js v2.0.1
 * http://twitter.github.com/bootstrap/javascript.html#tooltips
 * Inspired by the original jQuery.tipsy by Jason Frame
 * ===========================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ========================================================== */

!function( $ ) {

  "use strict"

 /* TOOLTIP PUBLIC CLASS DEFINITION
  * =============================== */

  var Tooltip = function ( element, options ) {
    this.init('tooltip', element, options)
  }

  Tooltip.prototype = {

    constructor: Tooltip

  , init: function ( type, element, options ) {
      var eventIn
        , eventOut

      this.type = type
      this.$element = $(element)
      this.options = this.getOptions(options)
      this.enabled = true

      if (this.options.trigger != 'manual') {
        eventIn  = this.options.trigger == 'hover' ? 'mouseenter' : 'focus'
        eventOut = this.options.trigger == 'hover' ? 'mouseleave' : 'blur'
        this.$element.on(eventIn, this.options.selector, $.proxy(this.enter, this))
        this.$element.on(eventOut, this.options.selector, $.proxy(this.leave, this))
      }

      this.options.selector ?
        (this._options = $.extend({}, this.options, { trigger: 'manual', selector: '' })) :
        this.fixTitle()
    }

  , getOptions: function ( options ) {
      options = $.extend({}, $.fn[this.type].defaults, options, this.$element.data())

      if (options.delay && typeof options.delay == 'number') {
        options.delay = {
          show: options.delay
        , hide: options.delay
        }
      }

      return options
    }

  , enter: function ( e ) {
      var self = $(e.currentTarget)[this.type](this._options).data(this.type)

      if (!self.options.delay || !self.options.delay.show) {
        self.show()
      } else {
        self.hoverState = 'in'
        setTimeout(function() {
          if (self.hoverState == 'in') {
            self.show()
          }
        }, self.options.delay.show)
      }
    }

  , leave: function ( e ) {
      var self = $(e.currentTarget)[this.type](this._options).data(this.type)

      if (!self.options.delay || !self.options.delay.hide) {
        self.hide()
      } else {
        self.hoverState = 'out'
        setTimeout(function() {
          if (self.hoverState == 'out') {
            self.hide()
          }
        }, self.options.delay.hide)
      }
    }

  , show: function () {
      var $tip
        , inside
        , pos
        , actualWidth
        , actualHeight
        , placement
        , tp

      if (this.hasContent() && this.enabled) {
        $tip = this.tip()
        this.setContent()

        if (this.options.animation) {
          $tip.addClass('fade')
        }

        placement = typeof this.options.placement == 'function' ?
          this.options.placement.call(this, $tip[0], this.$element[0]) :
          this.options.placement

        inside = /in/.test(placement)

        $tip
          .remove()
          .css({ top: 0, left: 0, display: 'block' })
          .appendTo(inside ? this.$element : document.body)

        pos = this.getPosition(inside)

        actualWidth = $tip[0].offsetWidth
        actualHeight = $tip[0].offsetHeight

        switch (inside ? placement.split(' ')[1] : placement) {
          case 'bottom':
            tp = {top: pos.top + pos.height, left: pos.left + pos.width / 2 - actualWidth / 2}
            break
          case 'top':
            tp = {top: pos.top - actualHeight, left: pos.left + pos.width / 2 - actualWidth / 2}
            break
          case 'left':
            tp = {top: pos.top + pos.height / 2 - actualHeight / 2, left: pos.left - actualWidth}
            break
          case 'right':
            tp = {top: pos.top + pos.height / 2 - actualHeight / 2, left: pos.left + pos.width}
            break
        }

        $tip
          .css(tp)
          .addClass(placement)
          .addClass('in')
      }
    }

  , setContent: function () {
      var $tip = this.tip()
      $tip.find('.tooltip-inner').html(this.getTitle())
      $tip.removeClass('fade in top bottom left right')
    }

  , hide: function () {
      var that = this
        , $tip = this.tip()

      $tip.removeClass('in')

      function removeWithAnimation() {
        var timeout = setTimeout(function () {
          $tip.off($.support.transition.end).remove()
        }, 500)

        $tip.one($.support.transition.end, function () {
          clearTimeout(timeout)
          $tip.remove()
        })
      }

      $.support.transition && this.$tip.hasClass('fade') ?
        removeWithAnimation() :
        $tip.remove()
    }

  , fixTitle: function () {
      var $e = this.$element
      if ($e.attr('title') || typeof($e.attr('data-original-title')) != 'string') {
        $e.attr('data-original-title', $e.attr('title') || '').removeAttr('title')
      }
    }

  , hasContent: function () {
      return this.getTitle()
    }

  , getPosition: function (inside) {
      return $.extend({}, (inside ? {top: 0, left: 0} : this.$element.offset()), {
        width: this.$element[0].offsetWidth
      , height: this.$element[0].offsetHeight
      })
    }

  , getTitle: function () {
      var title
        , $e = this.$element
        , o = this.options

      title = $e.attr('data-original-title')
        || (typeof o.title == 'function' ? o.title.call($e[0]) :  o.title)

      title = title.toString().replace(/(^\s*|\s*$)/, "")

      return title
    }

  , tip: function () {
      return this.$tip = this.$tip || $(this.options.template)
    }

  , validate: function () {
      if (!this.$element[0].parentNode) {
        this.hide()
        this.$element = null
        this.options = null
      }
    }

  , enable: function () {
      this.enabled = true
    }

  , disable: function () {
      this.enabled = false
    }

  , toggleEnabled: function () {
      this.enabled = !this.enabled
    }

  , toggle: function () {
      this[this.tip().hasClass('in') ? 'hide' : 'show']()
    }

  }


 /* TOOLTIP PLUGIN DEFINITION
  * ========================= */

  $.fn.tooltip = function ( option ) {
    return this.each(function () {
      var $this = $(this)
        , data = $this.data('tooltip')
        , options = typeof option == 'object' && option
      if (!data) $this.data('tooltip', (data = new Tooltip(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  $.fn.tooltip.Constructor = Tooltip

  $.fn.tooltip.defaults = {
    animation: true
  , delay: 0
  , selector: false
  , placement: 'top'
  , trigger: 'hover'
  , title: ''
  , template: '<div class="tooltip"><div class="tooltip-arrow"></div><div class="tooltip-inner"></div></div>'
  }

}( window.jQuery );

/*********************************************** 
     Begin AES.js 
***********************************************/ 

/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */
/*  AES implementation in JavaScript (c) Chris Veness 2005-2011                                   */
/*   - see http://csrc.nist.gov/publications/PubsFIPS.html#197                                    */
/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */

var Aes = {};  // Aes namespace

/**
 * AES Cipher function: encrypt 'input' state with Rijndael algorithm
 *   applies Nr rounds (10/12/14) using key schedule w for 'add round key' stage
 *
 * @param {Number[]} input 16-byte (128-bit) input state array
 * @param {Number[][]} w   Key schedule as 2D byte-array (Nr+1 x Nb bytes)
 * @returns {Number[]}     Encrypted output state array
 */
Aes.cipher = function(input, w) {    // main Cipher function [§5.1]
  var Nb = 4;               // block size (in words): no of columns in state (fixed at 4 for AES)
  var Nr = w.length/Nb - 1; // no of rounds: 10/12/14 for 128/192/256-bit keys

  var state = [[],[],[],[]];  // initialise 4xNb byte-array 'state' with input [§3.4]
  for (var i=0; i<4*Nb; i++) state[i%4][Math.floor(i/4)] = input[i];

  state = Aes.addRoundKey(state, w, 0, Nb);

  for (var round=1; round<Nr; round++) {
    state = Aes.subBytes(state, Nb);
    state = Aes.shiftRows(state, Nb);
    state = Aes.mixColumns(state, Nb);
    state = Aes.addRoundKey(state, w, round, Nb);
  }

  state = Aes.subBytes(state, Nb);
  state = Aes.shiftRows(state, Nb);
  state = Aes.addRoundKey(state, w, Nr, Nb);

  var output = new Array(4*Nb);  // convert state to 1-d array before returning [§3.4]
  for (var i=0; i<4*Nb; i++) output[i] = state[i%4][Math.floor(i/4)];
  return output;
}

/**
 * Perform Key Expansion to generate a Key Schedule
 *
 * @param {Number[]} key Key as 16/24/32-byte array
 * @returns {Number[][]} Expanded key schedule as 2D byte-array (Nr+1 x Nb bytes)
 */
Aes.keyExpansion = function(key) {  // generate Key Schedule (byte-array Nr+1 x Nb) from Key [§5.2]
  var Nb = 4;            // block size (in words): no of columns in state (fixed at 4 for AES)
  var Nk = key.length/4  // key length (in words): 4/6/8 for 128/192/256-bit keys
  var Nr = Nk + 6;       // no of rounds: 10/12/14 for 128/192/256-bit keys

  var w = new Array(Nb*(Nr+1));
  var temp = new Array(4);

  for (var i=0; i<Nk; i++) {
    var r = [key[4*i], key[4*i+1], key[4*i+2], key[4*i+3]];
    w[i] = r;
  }

  for (var i=Nk; i<(Nb*(Nr+1)); i++) {
    w[i] = new Array(4);
    for (var t=0; t<4; t++) temp[t] = w[i-1][t];
    if (i % Nk == 0) {
      temp = Aes.subWord(Aes.rotWord(temp));
      for (var t=0; t<4; t++) temp[t] ^= Aes.rCon[i/Nk][t];
    } else if (Nk > 6 && i%Nk == 4) {
      temp = Aes.subWord(temp);
    }
    for (var t=0; t<4; t++) w[i][t] = w[i-Nk][t] ^ temp[t];
  }

  return w;
}

/*
 * ---- remaining routines are private, not called externally ----
 */
 
Aes.subBytes = function(s, Nb) {    // apply SBox to state S [§5.1.1]
  for (var r=0; r<4; r++) {
    for (var c=0; c<Nb; c++) s[r][c] = Aes.sBox[s[r][c]];
  }
  return s;
}

Aes.shiftRows = function(s, Nb) {    // shift row r of state S left by r bytes [§5.1.2]
  var t = new Array(4);
  for (var r=1; r<4; r++) {
    for (var c=0; c<4; c++) t[c] = s[r][(c+r)%Nb];  // shift into temp copy
    for (var c=0; c<4; c++) s[r][c] = t[c];         // and copy back
  }          // note that this will work for Nb=4,5,6, but not 7,8 (always 4 for AES):
  return s;  // see asmaes.sourceforge.net/rijndael/rijndaelImplementation.pdf
}

Aes.mixColumns = function(s, Nb) {   // combine bytes of each col of state S [§5.1.3]
  for (var c=0; c<4; c++) {
    var a = new Array(4);  // 'a' is a copy of the current column from 's'
    var b = new Array(4);  // 'b' is a•{02} in GF(2^8)
    for (var i=0; i<4; i++) {
      a[i] = s[i][c];
      b[i] = s[i][c]&0x80 ? s[i][c]<<1 ^ 0x011b : s[i][c]<<1;

    }
    // a[n] ^ b[n] is a•{03} in GF(2^8)
    s[0][c] = b[0] ^ a[1] ^ b[1] ^ a[2] ^ a[3]; // 2*a0 + 3*a1 + a2 + a3
    s[1][c] = a[0] ^ b[1] ^ a[2] ^ b[2] ^ a[3]; // a0 * 2*a1 + 3*a2 + a3
    s[2][c] = a[0] ^ a[1] ^ b[2] ^ a[3] ^ b[3]; // a0 + a1 + 2*a2 + 3*a3
    s[3][c] = a[0] ^ b[0] ^ a[1] ^ a[2] ^ b[3]; // 3*a0 + a1 + a2 + 2*a3
  }
  return s;
}

Aes.addRoundKey = function(state, w, rnd, Nb) {  // xor Round Key into state S [§5.1.4]
  for (var r=0; r<4; r++) {
    for (var c=0; c<Nb; c++) state[r][c] ^= w[rnd*4+c][r];
  }
  return state;
}

Aes.subWord = function(w) {    // apply SBox to 4-byte word w
  for (var i=0; i<4; i++) w[i] = Aes.sBox[w[i]];
  return w;
}

Aes.rotWord = function(w) {    // rotate 4-byte word w left by one byte
  var tmp = w[0];
  for (var i=0; i<3; i++) w[i] = w[i+1];
  w[3] = tmp;
  return w;
}

// sBox is pre-computed multiplicative inverse in GF(2^8) used in subBytes and keyExpansion [§5.1.1]
Aes.sBox =  [0x63,0x7c,0x77,0x7b,0xf2,0x6b,0x6f,0xc5,0x30,0x01,0x67,0x2b,0xfe,0xd7,0xab,0x76,
             0xca,0x82,0xc9,0x7d,0xfa,0x59,0x47,0xf0,0xad,0xd4,0xa2,0xaf,0x9c,0xa4,0x72,0xc0,
             0xb7,0xfd,0x93,0x26,0x36,0x3f,0xf7,0xcc,0x34,0xa5,0xe5,0xf1,0x71,0xd8,0x31,0x15,
             0x04,0xc7,0x23,0xc3,0x18,0x96,0x05,0x9a,0x07,0x12,0x80,0xe2,0xeb,0x27,0xb2,0x75,
             0x09,0x83,0x2c,0x1a,0x1b,0x6e,0x5a,0xa0,0x52,0x3b,0xd6,0xb3,0x29,0xe3,0x2f,0x84,
             0x53,0xd1,0x00,0xed,0x20,0xfc,0xb1,0x5b,0x6a,0xcb,0xbe,0x39,0x4a,0x4c,0x58,0xcf,
             0xd0,0xef,0xaa,0xfb,0x43,0x4d,0x33,0x85,0x45,0xf9,0x02,0x7f,0x50,0x3c,0x9f,0xa8,
             0x51,0xa3,0x40,0x8f,0x92,0x9d,0x38,0xf5,0xbc,0xb6,0xda,0x21,0x10,0xff,0xf3,0xd2,
             0xcd,0x0c,0x13,0xec,0x5f,0x97,0x44,0x17,0xc4,0xa7,0x7e,0x3d,0x64,0x5d,0x19,0x73,
             0x60,0x81,0x4f,0xdc,0x22,0x2a,0x90,0x88,0x46,0xee,0xb8,0x14,0xde,0x5e,0x0b,0xdb,
             0xe0,0x32,0x3a,0x0a,0x49,0x06,0x24,0x5c,0xc2,0xd3,0xac,0x62,0x91,0x95,0xe4,0x79,
             0xe7,0xc8,0x37,0x6d,0x8d,0xd5,0x4e,0xa9,0x6c,0x56,0xf4,0xea,0x65,0x7a,0xae,0x08,
             0xba,0x78,0x25,0x2e,0x1c,0xa6,0xb4,0xc6,0xe8,0xdd,0x74,0x1f,0x4b,0xbd,0x8b,0x8a,
             0x70,0x3e,0xb5,0x66,0x48,0x03,0xf6,0x0e,0x61,0x35,0x57,0xb9,0x86,0xc1,0x1d,0x9e,
             0xe1,0xf8,0x98,0x11,0x69,0xd9,0x8e,0x94,0x9b,0x1e,0x87,0xe9,0xce,0x55,0x28,0xdf,
             0x8c,0xa1,0x89,0x0d,0xbf,0xe6,0x42,0x68,0x41,0x99,0x2d,0x0f,0xb0,0x54,0xbb,0x16];

// rCon is Round Constant used for the Key Expansion [1st col is 2^(r-1) in GF(2^8)] [§5.2]
Aes.rCon = [ [0x00, 0x00, 0x00, 0x00],
             [0x01, 0x00, 0x00, 0x00],
             [0x02, 0x00, 0x00, 0x00],
             [0x04, 0x00, 0x00, 0x00],
             [0x08, 0x00, 0x00, 0x00],
             [0x10, 0x00, 0x00, 0x00],
             [0x20, 0x00, 0x00, 0x00],
             [0x40, 0x00, 0x00, 0x00],
             [0x80, 0x00, 0x00, 0x00],
             [0x1b, 0x00, 0x00, 0x00],
             [0x36, 0x00, 0x00, 0x00] ]; 


/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */
/*  AES Counter-mode implementation in JavaScript (c) Chris Veness 2005-2011                      */
/*   - see http://csrc.nist.gov/publications/nistpubs/800-38a/sp800-38a.pdf                       */
/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */

Aes.Ctr = {};  // Aes.Ctr namespace: a subclass or extension of Aes

/** 
 * Encrypt a text using AES encryption in Counter mode of operation
 *
 * Unicode multi-byte character safe
 *
 * @param {String} plaintext Source text to be encrypted
 * @param {String} password  The password to use to generate a key
 * @param {Number} nBits     Number of bits to be used in the key (128, 192, or 256)
 * @returns {string}         Encrypted text
 */
Aes.Ctr.encrypt = function(plaintext, password, nBits) {
  var blockSize = 16;  // block size fixed at 16 bytes / 128 bits (Nb=4) for AES
  if (!(nBits==128 || nBits==192 || nBits==256)) return '';  // standard allows 128/192/256 bit keys
  plaintext = Utf8.encode(plaintext);
  password = Utf8.encode(password);
  //var t = new Date();  // timer
	
  // use AES itself to encrypt password to get cipher key (using plain password as source for key 
  // expansion) - gives us well encrypted key (though hashed key might be preferred for prod'n use)
  var nBytes = nBits/8;  // no bytes in key (16/24/32)
  var pwBytes = new Array(nBytes);
  for (var i=0; i<nBytes; i++) {  // use 1st 16/24/32 chars of password for key
    pwBytes[i] = isNaN(password.charCodeAt(i)) ? 0 : password.charCodeAt(i);
  }
  var key = Aes.cipher(pwBytes, Aes.keyExpansion(pwBytes));  // gives us 16-byte key
  key = key.concat(key.slice(0, nBytes-16));  // expand key to 16/24/32 bytes long

  // initialise 1st 8 bytes of counter block with nonce (NIST SP800-38A §B.2): [0-1] = millisec, 
  // [2-3] = random, [4-7] = seconds, together giving full sub-millisec uniqueness up to Feb 2106
  var counterBlock = new Array(blockSize);
  
  var nonce = (new Date()).getTime();  // timestamp: milliseconds since 1-Jan-1970
  var nonceMs = nonce%1000;
  var nonceSec = Math.floor(nonce/1000);
  var nonceRnd = Math.floor(Math.random()*0xffff);
  
  for (var i=0; i<2; i++) counterBlock[i]   = (nonceMs  >>> i*8) & 0xff;
  for (var i=0; i<2; i++) counterBlock[i+2] = (nonceRnd >>> i*8) & 0xff;
  for (var i=0; i<4; i++) counterBlock[i+4] = (nonceSec >>> i*8) & 0xff;
  
  // and convert it to a string to go on the front of the ciphertext
  var ctrTxt = '';
  for (var i=0; i<8; i++) ctrTxt += String.fromCharCode(counterBlock[i]);

  // generate key schedule - an expansion of the key into distinct Key Rounds for each round
  var keySchedule = Aes.keyExpansion(key);
  
  var blockCount = Math.ceil(plaintext.length/blockSize);
  var ciphertxt = new Array(blockCount);  // ciphertext as array of strings
  
  for (var b=0; b<blockCount; b++) {
    // set counter (block #) in last 8 bytes of counter block (leaving nonce in 1st 8 bytes)
    // done in two stages for 32-bit ops: using two words allows us to go past 2^32 blocks (68GB)
    for (var c=0; c<4; c++) counterBlock[15-c] = (b >>> c*8) & 0xff;
    for (var c=0; c<4; c++) counterBlock[15-c-4] = (b/0x100000000 >>> c*8)

    var cipherCntr = Aes.cipher(counterBlock, keySchedule);  // -- encrypt counter block --
    
    // block size is reduced on final block
    var blockLength = b<blockCount-1 ? blockSize : (plaintext.length-1)%blockSize+1;
    var cipherChar = new Array(blockLength);
    
    for (var i=0; i<blockLength; i++) {  // -- xor plaintext with ciphered counter char-by-char --
      cipherChar[i] = cipherCntr[i] ^ plaintext.charCodeAt(b*blockSize+i);
      cipherChar[i] = String.fromCharCode(cipherChar[i]);
    }
    ciphertxt[b] = cipherChar.join(''); 
  }

  // Array.join is more efficient than repeated string concatenation in IE
  var ciphertext = ctrTxt + ciphertxt.join('');
  ciphertext = Base64.encode(ciphertext);  // encode in base64
  
  //alert((new Date()) - t);
  return ciphertext;
}

/** 
 * Decrypt a text encrypted by AES in counter mode of operation
 *
 * @param {String} ciphertext Source text to be encrypted
 * @param {String} password   The password to use to generate a key
 * @param {Number} nBits      Number of bits to be used in the key (128, 192, or 256)
 * @returns {String}          Decrypted text
 */
Aes.Ctr.decrypt = function(ciphertext, password, nBits) {
  var blockSize = 16;  // block size fixed at 16 bytes / 128 bits (Nb=4) for AES
  if (!(nBits==128 || nBits==192 || nBits==256)) return '';  // standard allows 128/192/256 bit keys
  ciphertext = Base64.decode(ciphertext);
  password = Utf8.encode(password);
  //var t = new Date();  // timer
  
  // use AES to encrypt password (mirroring encrypt routine)
  var nBytes = nBits/8;  // no bytes in key
  var pwBytes = new Array(nBytes);
  for (var i=0; i<nBytes; i++) {
    pwBytes[i] = isNaN(password.charCodeAt(i)) ? 0 : password.charCodeAt(i);
  }
  var key = Aes.cipher(pwBytes, Aes.keyExpansion(pwBytes));
  key = key.concat(key.slice(0, nBytes-16));  // expand key to 16/24/32 bytes long

  // recover nonce from 1st 8 bytes of ciphertext
  var counterBlock = new Array(8);
  ctrTxt = ciphertext.slice(0, 8);
  for (var i=0; i<8; i++) counterBlock[i] = ctrTxt.charCodeAt(i);
  
  // generate key schedule
  var keySchedule = Aes.keyExpansion(key);

  // separate ciphertext into blocks (skipping past initial 8 bytes)
  var nBlocks = Math.ceil((ciphertext.length-8) / blockSize);
  var ct = new Array(nBlocks);
  for (var b=0; b<nBlocks; b++) ct[b] = ciphertext.slice(8+b*blockSize, 8+b*blockSize+blockSize);
  ciphertext = ct;  // ciphertext is now array of block-length strings

  // plaintext will get generated block-by-block into array of block-length strings
  var plaintxt = new Array(ciphertext.length);

  for (var b=0; b<nBlocks; b++) {
    // set counter (block #) in last 8 bytes of counter block (leaving nonce in 1st 8 bytes)
    for (var c=0; c<4; c++) counterBlock[15-c] = ((b) >>> c*8) & 0xff;
    for (var c=0; c<4; c++) counterBlock[15-c-4] = (((b+1)/0x100000000-1) >>> c*8) & 0xff;

    var cipherCntr = Aes.cipher(counterBlock, keySchedule);  // encrypt counter block

    var plaintxtByte = new Array(ciphertext[b].length);
    for (var i=0; i<ciphertext[b].length; i++) {
      // -- xor plaintxt with ciphered counter byte-by-byte --
      plaintxtByte[i] = cipherCntr[i] ^ ciphertext[b].charCodeAt(i);
      plaintxtByte[i] = String.fromCharCode(plaintxtByte[i]);
    }
    plaintxt[b] = plaintxtByte.join('');
  }

  // join array of blocks into single plaintext string
  var plaintext = plaintxt.join('');
  plaintext = Utf8.decode(plaintext);  // decode from UTF8 back to Unicode multi-byte chars
  
  //alert((new Date()) - t);
  return plaintext;
}


/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */
/*  Base64 class: Base 64 encoding / decoding (c) Chris Veness 2002-2011                          */
/*    note: depends on Utf8 class                                                                 */
/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */

var Base64 = {};  // Base64 namespace

Base64.code = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";

/**
 * Encode string into Base64, as defined by RFC 4648 [http://tools.ietf.org/html/rfc4648]
 * (instance method extending String object). As per RFC 4648, no newlines are added.
 *
 * @param {String} str The string to be encoded as base-64
 * @param {Boolean} [utf8encode=false] Flag to indicate whether str is Unicode string to be encoded 
 *   to UTF8 before conversion to base64; otherwise string is assumed to be 8-bit characters
 * @returns {String} Base64-encoded string
 */ 
Base64.encode = function(str, utf8encode) {  // http://tools.ietf.org/html/rfc4648
  utf8encode =  (typeof utf8encode == 'undefined') ? false : utf8encode;
  var o1, o2, o3, bits, h1, h2, h3, h4, e=[], pad = '', c, plain, coded;
  var b64 = Base64.code;
   
  plain = utf8encode ? str.encodeUTF8() : str;
  
  c = plain.length % 3;  // pad string to length of multiple of 3
  if (c > 0) { while (c++ < 3) { pad += '='; plain += '\0'; } }
  // note: doing padding here saves us doing special-case packing for trailing 1 or 2 chars
   
  for (c=0; c<plain.length; c+=3) {  // pack three octets into four hexets
    o1 = plain.charCodeAt(c);
    o2 = plain.charCodeAt(c+1);
    o3 = plain.charCodeAt(c+2);
      
    bits = o1<<16 | o2<<8 | o3;
      
    h1 = bits>>18 & 0x3f;
    h2 = bits>>12 & 0x3f;
    h3 = bits>>6 & 0x3f;
    h4 = bits & 0x3f;

    // use hextets to index into code string
    e[c/3] = b64.charAt(h1) + b64.charAt(h2) + b64.charAt(h3) + b64.charAt(h4);
  }
  coded = e.join('');  // join() is far faster than repeated string concatenation in IE
  
  // replace 'A's from padded nulls with '='s
  coded = coded.slice(0, coded.length-pad.length) + pad;
   
  return coded;
}

/**
 * Decode string from Base64, as defined by RFC 4648 [http://tools.ietf.org/html/rfc4648]
 * (instance method extending String object). As per RFC 4648, newlines are not catered for.
 *
 * @param {String} str The string to be decoded from base-64
 * @param {Boolean} [utf8decode=false] Flag to indicate whether str is Unicode string to be decoded 
 *   from UTF8 after conversion from base64
 * @returns {String} decoded string
 */ 
Base64.decode = function(str, utf8decode) {
  utf8decode =  (typeof utf8decode == 'undefined') ? false : utf8decode;
  var o1, o2, o3, h1, h2, h3, h4, bits, d=[], plain, coded;
  var b64 = Base64.code;

  coded = utf8decode ? str.decodeUTF8() : str;
  
  
  for (var c=0; c<coded.length; c+=4) {  // unpack four hexets into three octets
    h1 = b64.indexOf(coded.charAt(c));
    h2 = b64.indexOf(coded.charAt(c+1));
    h3 = b64.indexOf(coded.charAt(c+2));
    h4 = b64.indexOf(coded.charAt(c+3));
      
    bits = h1<<18 | h2<<12 | h3<<6 | h4;
      
    o1 = bits>>>16 & 0xff;
    o2 = bits>>>8 & 0xff;
    o3 = bits & 0xff;
    
    d[c/4] = String.fromCharCode(o1, o2, o3);
    // check for padding
    if (h4 == 0x40) d[c/4] = String.fromCharCode(o1, o2);
    if (h3 == 0x40) d[c/4] = String.fromCharCode(o1);
  }
  plain = d.join('');  // join() is far faster than repeated string concatenation in IE
   
  return utf8decode ? plain.decodeUTF8() : plain; 
}


/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */
/*  Utf8 class: encode / decode between multi-byte Unicode characters and UTF-8 multiple          */
/*              single-byte character encoding (c) Chris Veness 2002-2011                         */
/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */

var Utf8 = {};  // Utf8 namespace

/**
 * Encode multi-byte Unicode string into utf-8 multiple single-byte characters 
 * (BMP / basic multilingual plane only)
 *
 * Chars in range U+0080 - U+07FF are encoded in 2 chars, U+0800 - U+FFFF in 3 chars
 *
 * @param {String} strUni Unicode string to be encoded as UTF-8
 * @returns {String} encoded string
 */
Utf8.encode = function(strUni) {
  // use regular expressions & String.replace callback function for better efficiency 
  // than procedural approaches
  var strUtf = strUni.replace(
      /[\u0080-\u07ff]/g,  // U+0080 - U+07FF => 2 bytes 110yyyyy, 10zzzzzz
      function(c) { 
        var cc = c.charCodeAt(0);
        return String.fromCharCode(0xc0 | cc>>6, 0x80 | cc&0x3f); }
    );
  strUtf = strUtf.replace(
      /[\u0800-\uffff]/g,  // U+0800 - U+FFFF => 3 bytes 1110xxxx, 10yyyyyy, 10zzzzzz
      function(c) { 
        var cc = c.charCodeAt(0); 
        return String.fromCharCode(0xe0 | cc>>12, 0x80 | cc>>6&0x3F, 0x80 | cc&0x3f); }
    );
  return strUtf;
}

/**
 * Decode utf-8 encoded string back into multi-byte Unicode characters
 *
 * @param {String} strUtf UTF-8 string to be decoded back to Unicode
 * @returns {String} decoded string
 */
Utf8.decode = function(strUtf) {
  // note: decode 3-byte chars first as decoded 2-byte strings could appear to be 3-byte char!
  var strUni = strUtf.replace(
      /[\u00e0-\u00ef][\u0080-\u00bf][\u0080-\u00bf]/g,  // 3-byte chars
      function(c) {  // (note parentheses for precence)
        var cc = ((c.charCodeAt(0)&0x0f)<<12) | ((c.charCodeAt(1)&0x3f)<<6) | ( c.charCodeAt(2)&0x3f); 
        return String.fromCharCode(cc); }
    );
  strUni = strUni.replace(
      /[\u00c0-\u00df][\u0080-\u00bf]/g,                 // 2-byte chars
      function(c) {  // (note parentheses for precence)
        var cc = (c.charCodeAt(0)&0x1f)<<6 | c.charCodeAt(1)&0x3f;
        return String.fromCharCode(cc); }
    );
  return strUni;
}

/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */

/*********************************************** 
     Begin timeline.js 
***********************************************/ 

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