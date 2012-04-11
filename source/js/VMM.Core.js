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




