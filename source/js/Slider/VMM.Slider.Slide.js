/* Slider Slide 
================================================== */
if (typeof VMM.Slider != 'undefined') {
	// VMM.Slider.Slide(element, data)
	VMM.Slider.Slide = function(d, _parent) {
		
		var data		=	d;
		var slide		=	{};
		var media		=	"";
		var loaded		=	false;
		var preloaded	=	false;
		var is_skinny	=	false;
		var element		=	VMM.appendAndGetElement(_parent, "<div>", "slider-item");
		var c = {slide:"", text: "", media: "", media_element: "", layout: "content-container layout", has: { headline: false, text: false, media: false }};
		var $media, $text, $slide, $wrap;
		/* PUBLIC
		================================================== */
		this.show = function(skinny) {
			if (!loaded) {
				if (preloaded) {
					reLayout(skinny);
				} else {
					render(skinny);
				}
			}
		};
		
		this.hide = function() {
			if (loaded) {
				removeSlide();
			}
		};
		
		this.layout = function(skinny) {
			if (loaded && preloaded) {
				reLayout(skinny);
			}
		};
		
		this.elem = function() {	
			return element;
		};
		
		this.position = function() {
			return VMM.Lib.position(element);
		};
		
		this.leftpos = function(p) {
			if(typeof p != 'undefined') {
				VMM.Lib.css(element, "left", p);
			} else {
				return VMM.Lib.position(element).left
			}
		};
		
		this.animate = function(d, e, p) {
			VMM.Lib.animate(element, d, e, p);
		};
		
		this.css = function(p, v) {
			VMM.Lib.css(element, p, v );
		}
		
		this.opacity = function(p) {
			VMM.Lib.css(element, "opacity", p);	
		}
		
		this.width = function() {
			return VMM.Lib.width(element);
		};
		
		this.height = function() {
			return VMM.Lib.height(element);
		};
		
		this.content_height = function () {
			var ch = VMM.Lib.find( element, ".content")[0];
			
			if (ch != 'undefined' && ch != null) {
				return VMM.Lib.height(ch);
			} else {
				return 0;
			}
		}
		
		/* PRIVATE
		================================================== */
		var render = function(skinny) {
			buildSlide(skinny);
			loaded = true;
			preloaded = true;
			var timer = setTimeout(VMM.ExternalAPI.pushQues, 500);
		};
		
		var removeSlide = function() {
			//VMM.attachElement(element, "");
			loaded = false;
		}
		
		var reLayout = function(skinny) {
			
			if (c.has.text)	{
				if (skinny) {
					if (!is_skinny) {
						VMM.Lib.removeClass($slide, "pad-left");
						VMM.Lib.detach($text);
						VMM.Lib.prepend($slide, $text);
						is_skinny = true;
					}
				} else {
					if (is_skinny) {
						VMM.Lib.addClass($slide, "pad-left");
						VMM.Lib.detach($text);
						VMM.Lib.append($slide, $text);
						is_skinny = false
					}
				}
			} 
		}
		
		var buildSlide = function(skinny) {
			$wrap	=	VMM.appendAndGetElement(element, "<div>", "content");
			$slide	=	VMM.appendAndGetElement($wrap, "<div>");
			
			/* DATE
			================================================== */
			if (data.startdate != null && data.startdate != "") {
				if (type.of(data.startdate) == "date") {
					if (data.type != "start") {
						var st = VMM.Date.prettyDate(data.startdate);
						var en = VMM.Date.prettyDate(data.enddate);
						if (st != en) {
							c.text += VMM.createElement("h2", st + " &mdash; " + en + "", "date");
						} else {
							c.text += VMM.createElement("h2", st, "date");
						}
					}
				}
			}
			
			/* HEADLINE
			================================================== */
			if (data.headline != null && data.headline != "") {
				c.has.headline		=	true;
				if (data.type == "start") {
					c.text		+=	VMM.createElement("h2", VMM.Util.linkify_with_twitter(data.headline, "_blank"), "start");
				} else { 
					c.text		+=	VMM.createElement("h3", VMM.Util.linkify_with_twitter(data.headline, "_blank"));
				}
			}
			
			/* TEXT
			================================================== */
			if (data.text != null && data.text != "") {
				c.has.text		=	true;
				c.text			+=	VMM.createElement("p", VMM.Util.linkify_with_twitter(data.text, "_blank"));
			}
			
			if (c.has.text || c.has.headline) {
				c.text			=	VMM.createElement("div", c.text, "container");
				//$text		=	VMM.appendAndGetElement($slide, "<div>", "text", c.text);
				
				$text		=	VMM.appendAndGetElement($slide, "<div>", "text", VMM.TextElement.create(c.text));
				
			}
			
			/* MEDIA
			================================================== */
			if (data.asset != null && data.asset != "") {
				if (data.asset.media != null && data.asset.media != "") {
					c.has.media	=	true;
					$media		=	VMM.appendAndGetElement($slide, "<div>", "media", VMM.MediaElement.create(data.asset));
				}
			}
			
			/* COMBINE
			================================================== */
			if (c.has.text)	{ c.layout		+=	"-text"		};
			if (c.has.media){ c.layout		+=	"-media"	};

			if (c.has.text)	{
				if (skinny) {
					VMM.Lib.addClass($slide, c.layout);
					is_skinny = true;
				} else {
					VMM.Lib.addClass($slide, c.layout);
					VMM.Lib.addClass($slide, "pad-left");
					VMM.Lib.detach($text);
					VMM.Lib.append($slide, $text);
				}
				
			} else {
				VMM.Lib.addClass($slide, c.layout);
			}
			
			
		};
		
	}
	
};
