/* Media
================================================== */
if(typeof VMM != 'undefined' && typeof VMM.Media == 'undefined') {
	
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