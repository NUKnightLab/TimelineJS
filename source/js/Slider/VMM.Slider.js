/* Slider
================================================== */
if(typeof VMM != 'undefined' && typeof VMM.Slider == 'undefined') {
	
	VMM.Slider = function(parent, parent_config) {
		
		var events = {}, config;
		var $slider, $slider_mask, $slider_container, $slides_items;
		var data = [], slides = [], slide_positions = [];
		
		var slides_content		=	"";
		var current_slide		=	0;
		var current_width		=	960;
		var touch				=	{move: false, x: 10, y:0, off: 0, dampen: 48};
		var content				=	"";
		var _active				=	false;
		var layout				=	parent;
		var navigation			=	{nextBtn:"", prevBtn:"", nextDate:"", prevDate:"", nextTitle:"", prevTitle:""};
		var timer;
		
		// CONFIG
		if(typeof VMM.Timeline != 'undefined') {
			config	= 	VMM.Timeline.Config;
		} else {
			config = {
				preload: 4,
				current_slide: 0,
				interval: 10, 
				something: 0, 
				width: 720, 
				height: 400, 
				ease: "easeInOutExpo", 
				duration: 1000, 
				timeline: false, 
				spacing: 15,
				slider: {
					width: 720, 
					height: 400, 
					content: {
						width: 720, 
						height: 400, 
						padding: 130
					}, 
					nav: {
						width: 100, 
						height: 200
					} 
				} 
			};
		}
		
		/* PUBLIC VARS
		================================================== */
		this.ver = "0.6";
		
		config.slider.width		=	config.width;
		config.slider.height	=	config.height;
		
		/* PUBLIC FUNCTIONS
		================================================== */
		this.init = function(d) {
			slides = [];
			slide_positions = [];
			
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
			
			config.slider.nav.height = VMM.Lib.height(navigation.prevBtnContainer);
			
			config.slider.content.width = current_width - (config.slider.content.padding *2);
			
			VMM.Lib.width($slides_items, (slides.length * config.slider.content.width));
			
			if (_from_start) {
				var _pos = slides[current_slide].leftpos();
				VMM.Lib.css($slider_container, "left", _pos);
			}
			
			// RESIZE SLIDES
			sizeSlides();
			
			// POSITION SLIDES
			positionSlides();
			
			// POSITION NAV
			VMM.Lib.css(navigation.nextBtn, "left", (current_width - config.slider.nav.width));
			VMM.Lib.height(navigation.prevBtn, config.slider.height);
			VMM.Lib.height(navigation.nextBtn, config.slider.height);
			VMM.Lib.css(navigation.nextBtnContainer, "top", ( (config.slider.height/2) - (config.slider.nav.height/2) ) + 10 );
			VMM.Lib.css(navigation.prevBtnContainer, "top", ( (config.slider.height/2) - (config.slider.nav.height/2) ) + 10 );
			
			// Animate Changes
			VMM.Lib.height($slider_mask, config.slider.height);
			VMM.Lib.width($slider_mask, current_width);
			
			if (_go_to_slide) {
				goToSlide(current_slide, "linear", 1);
			};
			
			if (current_slide == 0) {
				VMM.Lib.visible(navigation.prevBtn, false);
			}
			
		}
		
		/* NAVIGATION
		================================================== */
		function onNextClick(e) {
			if (current_slide == slides.length - 1) {
				VMM.Lib.animate($slider_container, config.duration, config.ease, {"left": -(slides[current_slide].leftpos()) } );
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
					slide_positions.push( slides[i].leftpos() );
				}
			}
			if (typeof b.left == "number") {
				var _pos = b.left;
				var _slide_pos = -(slides[current_slide].leftpos());
				if (_pos < _slide_pos - (config.slider_width/3)) {
					onNextClick();
				} else if (_pos > _slide_pos + (config.slider_width/3)) {
					onPrevClick();
				} else {
					VMM.Lib.animate($slider_container, config.duration, config.ease, {"left": _slide_pos });
				}
			} else {
				VMM.Lib.animate($slider_container, config.duration, config.ease, {"left": _slide_pos });
			}
			
			if (typeof b.top == "number") {
				VMM.Lib.animate($slider_container, config.duration, config.ease, {"top": -b.top});
			} else {
				
			}
		};
		
		/* UPDATE
		================================================== */
		function upDate() {
			config.current_slide = current_slide;
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
			VMM.attachElement($slides_items, "");
			slides = [];
			
			for(var i = 0; i < d.length; i++) {
				var _slide = new VMM.Slider.Slide(d[i], $slides_items);
				//_slide.show();
				slides.push(_slide);
			}
		}
		
		var preloadSlides = function(skip) {
			if (skip) {
				preloadTimeOutSlides();
			} else {
				for(var k = 0; k < slides.length; k++) {
					slides[k].clearTimers();
				}
				timer = setTimeout(preloadTimeOutSlides, config.duration);
				
			}
		}
		
		var preloadTimeOutSlides = function() {
			for(var k = 0; k < slides.length; k++) {
				slides[k].enqueue = true;
			}
			
			for(var j = 0; j < config.preload; j++) {
				if ( !((current_slide + j) > slides.length - 1)) {
					slides[current_slide + j].show();
					slides[current_slide + j].enqueue = false;
				}
				if ( !( (current_slide - j) < 0 ) ) {
					slides[current_slide - j].show();
					slides[current_slide - j].enqueue = false;
				}
			}
			
			if (slides.length > 50) {
				for(var i = 0; i < slides.length; i++) {
					if (slides[i].enqueue) {
						slides[i].hide();
					}
				}
			}
			
			sizeSlides();
		}
		
		var sizeSlide = function(slide_id) {
			
		}
		/* SIZE SLIDES
		================================================== */
		var sizeSlides = function() {
			var layout_text_media		= ".slider-item .layout-text-media .media .media-container ",
				layout_media			= ".slider-item .layout-media .media .media-container ",
				layout_both				= ".slider-item .media .media-container",
				layout_caption			= ".slider-item .media .media-container .media-shadow .caption",
				mediasize = {
					text_media: {
						width: 			(config.slider.content.width/100) * 60,
						height: 		config.slider.height - 60,
						video: {
							width:		0,
							height:		0
						},
						text: {
							width:		((config.slider.content.width/100) * 40) - 30,
							height:		config.slider.height
						}
					},
					media: {
						width: 			config.slider.content.width,
						height: 		config.slider.height - 110,
						video: {
							width: 		0,
							height: 	0
						}
					}
				};
			
			VMM.master_config.sizes.api.width	= mediasize.media.width;
			VMM.master_config.sizes.api.height	= mediasize.media.height;
			
			mediasize.text_media.video			= VMM.Util.ratio.fit(mediasize.text_media.width, mediasize.text_media.height, 16, 9);
			mediasize.media.video				= VMM.Util.ratio.fit(mediasize.media.width, mediasize.media.height, 16, 9);
			
			VMM.Lib.css(".slider-item", "width", config.slider.content.width );
			VMM.Lib.height(".slider-item", config.slider.height);
			
			// HANDLE SMALLER SIZES
			var is_skinny = false;
			
			if (current_width <= 640) {
				is_skinny = true;
			} else if (VMM.Browser.device == "mobile" && VMM.Browser.orientation == "portrait") {
				is_skinny = true;
			} else if (VMM.Browser.device == "tablet" && VMM.Browser.orientation == "portrait") {
				//is_skinny = true;
			}
			
			if (is_skinny) {
				
				mediasize.text_media.width = 	config.slider.content.width;
				mediasize.text_media.height = 	((config.slider.height/100) * 50 ) - 50;
				mediasize.media.height = 		((config.slider.height/100) * 70 ) - 40;
				
				mediasize.text_media.video = 	VMM.Util.ratio.fit(mediasize.text_media.width, mediasize.text_media.height, 16, 9);
				mediasize.media.video = 		VMM.Util.ratio.fit(mediasize.media.width, mediasize.media.height, 16, 9);
				
				VMM.Lib.css(".slider-item .layout-text-media .text", "width", "100%" );
				VMM.Lib.css(".slider-item .layout-text-media .text", "display", "block" );
				VMM.Lib.css(".slider-item .layout-text-media .text .container", "display", "block" );
				VMM.Lib.css(".slider-item .layout-text-media .text .container", "width", config.slider.content.width );
				
				VMM.Lib.css(".slider-item .layout-text-media .media", "float", "none" );
				VMM.Lib.addClass(".slider-item .content-container", "pad-top");
				
				VMM.Lib.css(".slider-item .media blockquote p", "line-height", "18px" );
				VMM.Lib.css(".slider-item .media blockquote p", "font-size", "16px" );
				
				VMM.Lib.css(".slider-item", "overflow-y", "auto" );
				
				
			} else {
				
				VMM.Lib.css(".slider-item .layout-text-media .text", "width", "40%" );
				VMM.Lib.css(".slider-item .layout-text-media .text", "display", "table-cell" );
				VMM.Lib.css(".slider-item .layout-text-media .text .container", "display", "table-cell" );
				VMM.Lib.css(".slider-item .layout-text-media .text .container", "width", "auto" );
				VMM.Lib.css(".slider-item .layout-text-media .text .container .start", "width", mediasize.text_media.text.width );
				//VMM.Lib.addClass(".slider-item .content-container", "pad-left");
				VMM.Lib.removeClass(".slider-item .content-container", "pad-top");
				
				VMM.Lib.css(".slider-item .layout-text-media .media", "float", "left" );
				VMM.Lib.css(".slider-item .layout-text-media", "display", "table" );
				
				VMM.Lib.css(".slider-item .media blockquote p", "line-height", "36px" );
				VMM.Lib.css(".slider-item .media blockquote p", "font-size", "28px" );
				
				VMM.Lib.css(".slider-item", "display", "table" );
				VMM.Lib.css(".slider-item", "overflow-y", "auto" );
			}
			
			// MEDIA FRAME
			VMM.Lib.css(	layout_text_media + ".media-frame", 		"max-width", 	mediasize.text_media.width);
			VMM.Lib.height(	layout_text_media + ".media-frame", 						mediasize.text_media.height);
			VMM.Lib.width(	layout_text_media + ".media-frame", 						mediasize.text_media.width);
			
			// WEBSITES
			//VMM.Lib.css(	layout_both + 		".website", 			"max-width", 	300 );
			
			// IMAGES
			VMM.Lib.css(	layout_text_media + "img", 					"max-height", 	mediasize.text_media.height );
			VMM.Lib.css(	layout_media + 		"img", 					"max-height", 	mediasize.media.height );
			
			// FIX FOR NON-WEBKIT BROWSERS
			VMM.Lib.css(	layout_text_media + "img", 					"max-width", 	mediasize.text_media.width );
			VMM.Lib.css(	layout_text_media + ".avatar img", "max-width", 			32 );
			VMM.Lib.css(	layout_text_media + ".avatar img", "max-height", 			32 );
			VMM.Lib.css(	layout_media + 		".avatar img", "max-width", 			32 );
			VMM.Lib.css(	layout_media + 		".avatar img", "max-height", 			32 );
			
			VMM.Lib.css(	layout_text_media + ".article-thumb", "max-width", 			"50%" );
			//VMM.Lib.css(	layout_text_media + ".article-thumb", "max-height", 		100 );
			VMM.Lib.css(	layout_media + 		".article-thumb", "max-width", 			200 );
			//VMM.Lib.css(	layout_media + 		".article-thumb", "max-height", 		100 );
			
			
			// IFRAME FULL SIZE VIDEO
			VMM.Lib.width(	layout_text_media + ".media-frame", 						mediasize.text_media.video.width);
			VMM.Lib.height(	layout_text_media + ".media-frame", 						mediasize.text_media.video.height);
			VMM.Lib.width(	layout_media + 		".media-frame", 						mediasize.media.video.width);
			VMM.Lib.height(	layout_media + 		".media-frame", 						mediasize.media.video.height);
			VMM.Lib.css(	layout_media + 		".media-frame", 		"max-height", 	mediasize.media.video.height);
			VMM.Lib.css(	layout_media + 		".media-frame", 		"max-width", 	mediasize.media.video.width);
			
			// SOUNDCLOUD
			VMM.Lib.height(	layout_media + 		".soundcloud", 							168);
			VMM.Lib.height(	layout_text_media + ".soundcloud", 							168);
			VMM.Lib.width(	layout_media + 		".soundcloud", 							mediasize.media.width);
			VMM.Lib.width(	layout_text_media + ".soundcloud", 							mediasize.text_media.width);
			VMM.Lib.css(	layout_both + 		".soundcloud", 			"max-height", 	168 );
			
			// MAPS
			VMM.Lib.height(	layout_text_media + ".map", 								mediasize.text_media.height);
			VMM.Lib.css(	layout_media + 		".map", 				"max-height", 	mediasize.media.height);
			VMM.Lib.width(	layout_media + 		".map", 								mediasize.media.width);

			// DOCS
			VMM.Lib.height(	layout_text_media + ".doc", 								mediasize.text_media.height);
			VMM.Lib.height(	layout_media + 		".doc", 								mediasize.media.height);
			
			// IE8 NEEDS THIS
			VMM.Lib.width(	layout_media + 		".wikipedia", 							mediasize.media.width);
			VMM.Lib.width(	layout_media + 		".twitter", 							mediasize.media.width);
			VMM.Lib.width(	layout_media + 		".plain-text-quote", 					mediasize.media.width);
			VMM.Lib.width(	layout_media + 		".plain-text", 							mediasize.media.width);
			
			// CAPTION WIDTH
			VMM.Lib.css( layout_text_media + 	".caption",	"max-width",	mediasize.text_media.video.width);
			VMM.Lib.css( layout_media + 		".caption",	"max-width",	mediasize.media.video.width);
			
			// MAINTAINS VERTICAL CENTER IF IT CAN
			for(var i = 0; i < slides.length; i++) {
				
				slides[i].layout(is_skinny);
				
				if (slides[i].content_height() > config.slider.height + 20) {
					slides[i].css("display", "block");
				} else {
					slides[i].css("display", "table");
				}
			}
			
		}
		
		/* POSITION SLIDES
		================================================== */
		var positionSlides = function() {
			var pos = 0;
			for(var i = 0; i < slides.length; i++) {
				pos = i * (config.slider.width+config.spacing);
				slides[i].leftpos(pos);
			}
		}
		
		/* OPACITY SLIDES
		================================================== */
		var opacitySlides = function(n) {
			var _ease = "linear";
			for(var i = 0; i < slides.length; i++) {
				if (i == current_slide) {
					slides[i].animate(config.duration, _ease, {"opacity": 1});
				} else if (i == current_slide - 1 || i == current_slide + 1) {
					slides[i].animate(config.duration, _ease, {"opacity": 0.1});
				} else {
					slides[i].opacity(n);
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
			var _pos = slides[current_slide].leftpos();
			var _title = "";
			
			if (current_slide == 0) {is_first = true};
			if (current_slide +1 >= slides.length) {is_last = true};
			if (ease != null && ease != "") {_ease = ease};
			if (duration != null && duration != "") {_duration = duration};
			
			/* set proper nav titles and dates etc.
			================================================== */
			if (is_first) {
				VMM.Lib.visible(navigation.prevBtn, false);
			} else {
				VMM.Lib.visible(navigation.prevBtn, true);
				_title = VMM.Util.unlinkify(data[current_slide - 1].title)
				if (config.type == "timeline") {
					if(typeof data[current_slide - 1].date === "undefined") {
						VMM.attachElement(navigation.prevDate, _title);
						VMM.attachElement(navigation.prevTitle, "");
					} else {
						VMM.attachElement(navigation.prevDate, VMM.Date.prettyDate(data[current_slide - 1].startdate));
						VMM.attachElement(navigation.prevTitle, _title);
					}
				} else {
					VMM.attachElement(navigation.prevTitle, _title);
				}
				
			}
			if (is_last) {
				VMM.Lib.visible(navigation.nextBtn, false);
			} else {
				VMM.Lib.visible(navigation.nextBtn, true);
				_title = VMM.Util.unlinkify(data[current_slide + 1].title);
				if (config.type == "timeline") {
					if(typeof data[current_slide + 1].date === "undefined") {
						VMM.attachElement(navigation.nextDate, _title);
						VMM.attachElement(navigation.nextTitle, "");
					} else {
						VMM.attachElement(navigation.nextDate, VMM.Date.prettyDate(data[current_slide + 1].startdate) );
						VMM.attachElement(navigation.nextTitle, _title);
					}
				} else {
					VMM.attachElement(navigation.nextTitle,  _title);
				}
				
			}
			
			/* ANIMATE SLIDE
			================================================== */
			if (fast) {
				VMM.Lib.css($slider_container, "left", -(_pos - config.slider.content.padding));	
			} else{
				VMM.Lib.stop($slider_container);
				VMM.Lib.animate($slider_container, _duration, _ease, {"left": -(_pos - config.slider.content.padding)});
			}
			
			if (firstrun) {
				VMM.fireEvent(layout, "LOADED");
			}
			
			/* SET Vertical Scoll
			================================================== */
			if (slides[current_slide].height() > config.slider_height) {
				VMM.Lib.css(".slider", "overflow-y", "scroll" );
			} else {
				VMM.Lib.css(layout, "overflow-y", "hidden" );
				var scroll_height = 0;
				try {
					scroll_height = VMM.Lib.prop(layout, "scrollHeight");
					VMM.Lib.animate(layout, _duration, _ease, {scrollTop: scroll_height - VMM.Lib.height(layout) });
				}
				catch(err) {
					scroll_height = VMM.Lib.height(layout);
				}
			}
			
			preloadSlides();
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
				navigation.nextDate = VMM.appendAndGetElement(navigation.nextBtnContainer, "<div>", "date", "");
				navigation.prevDate = VMM.appendAndGetElement(navigation.prevBtnContainer, "<div>", "date", "");
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
				//VMM.TouchSlider.createPanel($slider_container, $slider_container, VMM.Lib.width(slides[0]), config.spacing, true);
				//VMM.TouchSlider.createPanel($slider_container, $slider_container, slides[0].width(), config.spacing, true);
				//VMM.bindEvent($slider_container, onTouchUpdate, "TOUCHUPDATE");
			} else if (VMM.Browser.device == "mobile") {
				
			} else {
				//VMM.DragSlider.createPanel($slider_container, $slider_container, VMM.Lib.width(slides[0]), config.spacing, true);
			}
			
			reSize(false, true);
			VMM.Lib.visible(navigation.prevBtn, false);
			goToSlide(config.current_slide, "easeOutExpo", __duration, true, true);
			
			_active = true;
		};
		
	};
	
}




