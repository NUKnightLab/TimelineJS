/* Slider Slide 
================================================== */
if (typeof VMM.Slider != 'undefined') {
	// VMM.Slider.Slide(element, data)
	VMM.Slider.Slide = function(d, _parent) {
		
		var data		=	d;
		var slide		=	{};
		var media		=	"";
		var loaded		=	false;
		var element		=	VMM.appendAndGetElement(_parent, "<div>", "slider-item");
		
		/* PUBLIC
		================================================== */
		this.show = function() {
			if (!loaded) {
				render();
			}
		};
		
		this.hide = function() {
			if (loaded) {
				removeSlide();
			}
		};
		
		this.elem = function() {	
			return element;
		};
		
		this.position = function() {
			return VMM.Element.position(element);
		};
		
		this.leftpos = function(p) {
			if(typeof p != 'undefined') {
				VMM.Element.css(element, "left", p);
			} else {
				trace("LEFT: " + VMM.Element.position(element).left);
				return VMM.Element.position(element).left
			}
		};
		
		this.animate = function(d, e, p) {
			VMM.Element.animate(element, d, e, p);
		};
		
		this.css = function(p, v) {
			VMM.Element.css(element, p, v );
		}
		
		this.opacity = function(p) {
			VMM.Element.css(element, "opacity", p);	
		}
		
		this.width = function() {
			return VMM.Element.width(element);
		};
		
		this.height = function() {
			return VMM.Element.height(element);
		};
		
		/* PRIVATE
		================================================== */
		var render = function() {
			VMM.attachElement(element, "");
			VMM.appendElement(element, buildSlide() );
			loaded = true;
			var timer = setTimeout(VMM.ExternalAPI.pushQues, 500);
		};
		
		var removeSlide = function() {
			VMM.attachElement(element, "");
			loaded = false;
		}
		
		var buildSlide = function() {
			var c = {slide:"", text: "", media: "", layout: "content-container layout", has: { headline: false, text: false, media: false }};
			var b_slide, c_wrap;
			
			/* DATE
			================================================== */
			if (data.startdate != null && data.startdate != "") {
				if (type.of(data.startdate) == "date") {
					if (data.type != "start") {
						var st = VMM.Util.date.prettyDate(data.startdate);
						var en = VMM.Util.date.prettyDate(data.enddate);
						if (st != en) {
							//st = VMM.Util.date.prettyDate(data.startdate, true);
							//en = VMM.Util.date.prettyDate(data.enddate, true);
							c.text += VMM.createElement("h2", st + "<small> &mdash; " + en + "</small>", "date");
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
				c.text			=	VMM.createElement("div", c.text, "text");
			}
			
			/* MEDIA
			================================================== */
			if (data.asset != null && data.asset != "") {
				if (data.asset.media != null && data.asset.media != "") {
					c.has.media	=	true;
					c.media		=	VMM.MediaElement.create(data.asset);
				}
			}
			
			/* COMBINE
			================================================== */
			if (c.has.text)	{ c.layout		+=	"-text"		};
			if (c.has.media){ c.layout		+=	"-media"	};
			
			c.slide = VMM.createElement("div", c.text + c.media, c.layout);
			c_wrap = VMM.createElement("div", c.slide, "content");
			
			/* RETURN
			================================================== */
			// return c.slide;
			return c_wrap;
			
		};
		
	}
	
};
