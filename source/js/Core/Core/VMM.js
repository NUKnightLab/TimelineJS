/**
	* VéritéCo JS Core
	* Designed and built by Zach Wise at VéritéCo zach@verite.co

	* This Source Code Form is subject to the terms of the Mozilla Public
	* License, v. 2.0. If a copy of the MPL was not distributed with this
	* file, You can obtain one at http://mozilla.org/MPL/2.0/.

*/  


/*	Simple JavaScript Inheritance
	By John Resig http://ejohn.org/
	MIT Licensed.
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

/*	Access to the Global Object
	access the global object without hard-coding the identifier window
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
	
	/* Debug
	================================================== */
	VMM.debug = true;
	
	/* Master Config
	================================================== */
	
	VMM.master_config = ({
		
		init: function() {
			return this;
		},
		
		sizes: {
			api: {
				width:			0,
				height:			0
			}
		},
		
		vp:				"Pellentesque nibh felis, eleifend id, commodo in, interdum vitae, leo",
		
		api_keys_master: {
			flickr:		"RAIvxHY4hE/Elm5cieh4X5ptMyDpj7MYIxziGxi0WGCcy1s+yr7rKQ==",
			//google:		"jwNGnYw4hE9lmAez4ll0QD+jo6SKBJFknkopLS4FrSAuGfIwyj57AusuR0s8dAo=",
			google:		"uQKadH1VMlCsp560gN2aOiMz4evWkl1s34yryl3F/9FJOsn+/948CbBUvKLN46U=",
			twitter:	""
		},
		
		timers: {
			api:			7000
		},
		
		api:	{
			pushques:		[]
			
		},
		
		twitter: {
			active:			false,
			array:			[],
			api_loaded:		false,
			que:			[]
		},
		
		flickr: {
			active:			false,
			array:			[],
			api_loaded:		false,
			que:			[]
		},
		
		youtube: {
			active:			false,
			array:			[],
			api_loaded:		false,
			que:			[]
		},
		
		vimeo: {
			active:			false,
			array:			[],
			api_loaded:		false,
			que:			[]
		},
		
		vine: {
			active:			false,
			array:			[],
			api_loaded:		false,
			que:			[]
		},
		
		webthumb: {
			active:			false,
			array:			[],
			api_loaded:		false,
			que:			[]
		},
		
		googlemaps: {
			active:			false,
			map_active:		false,
			places_active:	false,
			array:			[],
			api_loaded:		false,
			que:			[]
		},
		
		googledocs: {
			active:			false,
			array:			[],
			api_loaded:		false,
			que:			[]
		},
		
		googleplus: {
			active:			false,
			array:			[],
			api_loaded:		false,
			que:			[]
		},
		
		wikipedia: {
			active:			false,
			array:			[],
			api_loaded:		false,
			que:			[],
			tries:			0
		},
		
		soundcloud: {
			active:			false,
			array:			[],
			api_loaded:		false,
			que:			[]
		}
		
	}).init();
	
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
				ce += " style='" + styles + "'";
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
	

}

/* Trace (console.log)
================================================== */
function trace( msg ) {
	if (VMM.debug) {
		if (window.console) {
			console.log(msg);
		} else if ( typeof( jsTrace ) != 'undefined' ) {
			jsTrace.send( msg );
		} else {
			//alert(msg);
		}
	}
}

/*	Array Remove - By John Resig (MIT Licensed)
	http://ejohn.org/blog/javascript-array-remove/
================================================== */
Array.prototype.remove = function(from, to) {
  var rest = this.slice((to || from) + 1 || this.length);
  this.length = from < 0 ? this.length + from : from;
  return this.push.apply(this, rest);
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



