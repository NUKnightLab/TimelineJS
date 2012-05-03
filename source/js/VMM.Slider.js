/* Slider
================================================== */
if(typeof VMM != 'undefined' && typeof VMM.Slider == 'undefined') {
	
	VMM.Slider = function(parent, parent_config) {
		
		/* PRIVATE VARS
		================================================== */
		var events = {};
		// ARRAYS
		var data = [], slides = [], medias = [], slide_positions = [];
		var slides_content = "";
		var current_slide = 0;
		var current_width = 960;
		var touch = {move: false, x: 10, y:0, off: 0, dampen: 48};
		var content = "";
		var _active = false;
		var layout = parent;
		// ELEMENTS
		var $slider, $slider_mask, $slider_container, $slides_items;
		// CONFIG
		var config = {slider: {width: 720, height: 400, content: {width: 720, height: 400, padding: 130}, nav: {width: 100, height: 200} } };
		var _config = {interval: 10, something: 0, width: 720, height: 400, ease: "easeInOutExpo", duration: 1000, timeline: false, spacing: 15};
		// NAVIGATION
		var navigation = {nextBtn:"", prevBtn:"", nextDate:"", prevDate:"", nextTitle:"", prevTitle:""};
		
		/* PUBLIC VARS
		================================================== */
		this.ver = "0.6";
		
		/* APPLY SUPPLIED CONFIG
		================================================== */
		
		if (type.of(parent_config) == 'object') {
		    var x;
			for (x in parent_config) {
				if (Object.prototype.hasOwnProperty.call(parent_config, x)) {
					config[x] = parent_config[x];
				}
			}
		} else if (type.of(_config) == 'object') {
			var x;
			for (x in _config) {
				if (Object.prototype.hasOwnProperty.call(_config, x)) {
					config[x] = _config[x];
				}
			}
		}
		
		config.slider.width = config.width;
		config.slider.height = config.height;
		
		
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
				config.slider.width = w;
				reSize();
			} else {
				return config.slider.width;
			}
		}
		
		this.height = function(h) {
			if (h != null && h != "") {
				config.slider.height = h;
				reSize();
			} else {
				return config.slider.height;
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
			if (w != null) {config.slider.width = w};
			if (h != null) {config.slider.height = h};
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
			
			current_width = config.slider.width;
			
			config.slider.nav.height = VMM.Element.height(navigation.prevBtnContainer);
			
			config.slider.content.width = current_width - (config.slider.content.padding *2);
			
			VMM.Element.width($slides_items, (slides.length * config.slider.content.width));
			
			if (_from_start) {
				var _pos = VMM.Element.position(slides[current_slide]);
				VMM.Element.css($slider_container, "left", _pos.left);
			}
			
			// RESIZE SLIDES
			sizeSlides();
			
			// POSITION SLIDES
			positionSlides();
			
			// POSITION NAV
			VMM.Element.css(navigation.nextBtn, "left", (current_width - config.slider.nav.width));
			VMM.Element.height(navigation.prevBtn, config.slider.height);
			VMM.Element.height(navigation.nextBtn, config.slider.height);
			VMM.Element.css(navigation.nextBtnContainer, "top", ( (config.slider.height/2) - (config.slider.nav.height/2) ) );
			VMM.Element.css(navigation.prevBtnContainer, "top", ( (config.slider.height/2) - (config.slider.nav.height/2) ) );
			
			
			// Animate Changes
			VMM.Element.height($slider_mask, config.slider.height);
			VMM.Element.width($slider_mask, current_width);
			
			if (_go_to_slide) {
				goToSlide(current_slide, "linear", 1);
			};
			
			if (current_slide == 0) {
				VMM.Element.visible(navigation.prevBtn, false);
			}
			
		}
		
		/* NAVIGATION
		================================================== */
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
				case 39:
					// RIGHT ARROW
					onNextClick(e);
					break;
				case 37:
					// LEFT ARROW
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
				if (_pos < -(VMM.Element.position(slides[current_slide]).left) - (config.slider_width/3)) {
					onNextClick();
				} else if (_pos > -(VMM.Element.position(slides[current_slide]).left) + (config.slider_width/3)) {
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
		
		/* UPDATE
		================================================== */
		function upDate() {
			VMM.fireEvent(layout, "UPDATE");
		};
		
		/* GET DATA
		================================================== */
		var getData = function(d) {
			data = d;
		};
		
		/* BUILD SLIDES
		================================================== */
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
		
		/* SIZE SLIDES
		================================================== */
		var sizeSlides = function() {
			var layout_text_media = 		".slider-item .layout-text-media .media .media-container ";
			var layout_media = 				".slider-item .layout-media .media .media-container ";
			var layout_both	= 				".slider-item .media .media-container";
			var mediasize = {
				text_media: {
					width: 		(config.slider.content.width/100) * 60,
					height: 	config.slider.height - 60,
					video: {
						width: 	0,
						height: 0
					}
				},
				media: {
					width: 		config.slider.content.width,
					height: 	config.slider.height - 110,
					video: {
						width: 	0,
						height: 0
					}
				}
			}
			
			mediasize.text_media.video = 	VMM.Util.ratio.fit(mediasize.text_media.width, mediasize.text_media.height, 16, 9);
			mediasize.media.video = 		VMM.Util.ratio.fit(mediasize.media.width, mediasize.media.height, 16, 9);
			
			VMM.Element.css(".slider-item", "width", config.slider.content.width );
			VMM.Element.height(".slider-item", config.slider.height);
			
			// HANDLE SMALLER SIZES
			var is_skinny = false;
			
			if (current_width <= 650) {
				is_skinny = true;
			} else if (VMM.Browser.device == "mobile" && VMM.Browser.orientation == "portrait") {
				is_skinny = true;
			} else if (VMM.Browser.device == "tablet" && VMM.Browser.orientation == "portrait") {
				//is_skinny = true;
			}
			
			if (is_skinny) {
				
				mediasize.text_media.width = 	config.slider.content.width;
				mediasize.text_media.height = 	((config.slider.height/100) * 50 ) - 50;
				//mediasize.media.height = 		((config.slider.height/100) * 80 ) - 40;
				mediasize.media.height = 		((config.slider.height/100) * 70 ) - 40;
				
				mediasize.text_media.video = 	VMM.Util.ratio.fit(mediasize.text_media.width, mediasize.text_media.height, 16, 9);
				mediasize.media.video = 		VMM.Util.ratio.fit(mediasize.media.width, mediasize.media.height, 16, 9);
				
				VMM.Element.css(".slider-item .layout-text-media .text", "width", "100%" );
				VMM.Element.css(".slider-item .layout-text-media .text", "display", "block" );
				VMM.Element.css(".slider-item .layout-text-media .text .container", "display", "block" );
				VMM.Element.css(".slider-item .layout-text-media .text .container", "width", config.slider.content.width );
				
				VMM.Element.css(".slider-item .layout-text-media .media", "float", "none" );
				
				VMM.Element.css(".slider-item .media blockquote p", "line-height", "18px" );
				VMM.Element.css(".slider-item .media blockquote p", "font-size", "16px" );
				
				VMM.Element.css(".slider-item", "overflow-y", "auto" );
				
				// MAINTAINS VERTICAL CENTER IF IT CAN
				for(var i = 0; i < slides.length; i++) {
					if (VMM.Element.height(VMM.Element.find( slides[i], ".content")) > config.slider.height) {
						VMM.Element.css(slides[i], "display", "block" );
					} else {
						VMM.Element.css(slides[i], "display", "table" );
					}
				}
				
			} else {
				
				VMM.Element.css(".slider-item .layout-text-media .text", "width", "40%" );
				VMM.Element.css(".slider-item .layout-text-media .text", "display", "table-cell" );
				VMM.Element.css(".slider-item .layout-text-media .text .container", "display", "table-cell" );
				VMM.Element.css(".slider-item .layout-text-media .text .container", "width", "auto" );
				
				VMM.Element.css(".slider-item .layout-text-media .media", "float", "left" );
				VMM.Element.css(".slider-item .layout-text-media", "display", "table" );
				
				VMM.Element.css(".slider-item .media blockquote p", "line-height", "36px" );
				VMM.Element.css(".slider-item .media blockquote p", "font-size", "28px" );
				
				VMM.Element.css(".slider-item", "display", "table" );
				VMM.Element.css(".slider-item", "overflow-y", "auto" );
			}
			
			// MEDIA FRAME
			VMM.Element.css(	layout_text_media + ".media-frame", 		"max-width", 	mediasize.text_media.width);
			VMM.Element.height(	layout_text_media + ".media-frame", 						mediasize.text_media.height);
			VMM.Element.width(	layout_text_media + ".media-frame", 						mediasize.text_media.width);
			
			// IMAGES
			VMM.Element.css(	layout_text_media + "img", 					"max-height", 	mediasize.text_media.height );
			VMM.Element.css(	layout_media + 		"img", 					"max-height", 	mediasize.media.height );
			
			// FIX FOR NON-WEBKIT BROWSERS
			VMM.Element.css(	layout_text_media + "img", 					"max-width", 	mediasize.text_media.width );
			VMM.Element.css(	layout_text_media + ".twitter .avatar img", "max-width", 	32 );
			VMM.Element.css(	layout_text_media + ".twitter .avatar img", "max-height", 	32 );
			VMM.Element.css(	layout_media + 		".twitter .avatar img", "max-width", 	32 );
			VMM.Element.css(	layout_media + 		".twitter .avatar img", "max-height", 	32 );
			
			// IFRAME FULL SIZE VIDEO
			VMM.Element.width(	layout_text_media + ".media-frame", 						mediasize.text_media.video.width);
			VMM.Element.height(	layout_text_media + ".media-frame", 						mediasize.text_media.video.height);
			VMM.Element.width(	layout_media + 		".media-frame", 						mediasize.media.video.width);
			VMM.Element.height(	layout_media + 		".media-frame", 						mediasize.media.video.height);
			VMM.Element.css(	layout_media + 		".media-frame", 		"max-height", 	mediasize.media.video.height);
			VMM.Element.css(	layout_media + 		".media-frame", 		"max-width", 	mediasize.media.video.width);
			
			// SOUNDCLOUD
			VMM.Element.height(	layout_media + 		".soundcloud", 							168);
			VMM.Element.height(	layout_text_media + ".soundcloud", 							168);
			VMM.Element.width(	layout_media + 		".soundcloud", 							mediasize.media.width);
			VMM.Element.width(	layout_text_media + ".soundcloud", 							mediasize.text_media.width);
			VMM.Element.css(	layout_both + 		".soundcloud", 			"max-height", 	168 );
			
			// MAPS
			VMM.Element.height(	layout_text_media + ".map", 								mediasize.text_media.height);
			VMM.Element.css(	layout_media + 		".map", 				"max-height", 	mediasize.media.height);
			VMM.Element.width(	layout_media + 		".map", 								mediasize.media.width);

			// DOCS
			VMM.Element.height(	layout_text_media + ".doc", 								mediasize.text_media.height);
			VMM.Element.height(	layout_media + 		".doc", 								mediasize.media.height);
			
			trace(mediasize);
		}
		
		/* POSITION SLIDES
		================================================== */
		var positionSlides = function() {
			var pos = 0;
			for(var i = 0; i < slides.length; i++) {
				pos = i * (config.slider.width+config.spacing);
				VMM.Element.css(slides[i], "left", pos);
			}
		}
		
		/* OPACITY SLIDES
		================================================== */
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
		
		/* GO TO SLIDE
			goToSlide(n, ease, duration);
		================================================== */
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
			if (current_slide +1 >= slides.length) {
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
				if (config.type == "timeline") {
					VMM.attachElement(navigation.prevDate, data[current_slide - 1].date);
				}
				VMM.attachElement(navigation.prevTitle, VMM.Util.unlinkify(data[current_slide - 1].title));
			}
			if (is_last) {
				VMM.Element.visible(navigation.nextBtn, false);
			} else {
				VMM.Element.visible(navigation.nextBtn, true);
				if (config.type == "timeline") {
					VMM.attachElement(navigation.nextDate, data[current_slide + 1].date);
				}
				VMM.attachElement(navigation.nextTitle,  VMM.Util.unlinkify(data[current_slide + 1].title) );
			}
			
			/* ANIMATE SLIDE
			================================================== */
			if (fast) {
				VMM.Element.css($slider_container, "left", -(_pos.left - config.slider.content.padding));	
			} else{
				VMM.Element.stop($slider_container);
				VMM.Element.animate($slider_container, _duration, _ease, {"left": -(_pos.left - config.slider.content.padding)});
			}
			
			if (firstrun) {
				VMM.fireEvent(layout, "LOADED");
			}
			
			/* SET Vertical Scoll
			================================================== */
			//opacitySlides(0.85);
			if (VMM.Element.height(slides[current_slide]) > config.slider_height) {
				VMM.Element.css(".slider", "overflow-y", "scroll" );
			} else {
				VMM.Element.css(layout, "overflow-y", "hidden" );
			   VMM.Element.animate(layout, _duration, _ease, {scrollTop: VMM.Element.prop(layout, "scrollHeight") - VMM.Element.height(layout) });
				
			}
			
			//VMM.Element.css(navigation.nextBtnContainer, "left", ( VMM.Element.width(navigation.nextBtnContainer) - config.slider.nav.width) );
		}

		/* BUILD NAVIGATION
		================================================== */
		var buildNavigation = function() {
			
			var temp_icon = "<div class='icon'>&nbsp;</div>";
			
			navigation.nextBtn = VMM.appendAndGetElement($slider, "<div>", "nav-next");
			navigation.prevBtn = VMM.appendAndGetElement($slider, "<div>", "nav-previous");
			navigation.nextBtnContainer = VMM.appendAndGetElement(navigation.nextBtn, "<div>", "nav-container", temp_icon);
			navigation.prevBtnContainer = VMM.appendAndGetElement(navigation.prevBtn, "<div>", "nav-container", temp_icon);
			if (config.type == "timeline") {
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




