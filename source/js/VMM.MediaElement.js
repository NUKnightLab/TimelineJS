/* MediaElement
================================================== */
if(typeof VMM != 'undefined' && typeof VMM.MediaElement == 'undefined') {
	
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
					mediaElem = "<div class='thumbnail website'></div>";
					//mediaElem = "<div class='thumbnail'><img src='http://api.snapito.com/free/sc?url=" + m.id + "' width='" + _w + "px' height='" + _h + "px'></div>";
					
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
					mediaElem = "<iframe class='media-frame video vimeo' autostart='false' frameborder='0' width='100%' height='100%' src='http://player.vimeo.com/video/" + m.id + "?title=0&amp;byline=0&amp;portrait=0&amp;color=ffffff'></iframe>";
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
					mediaElem = "<iframe class='media-frame' frameborder='0' autostart='false' width='100%' height='100%' scrolling='yes' marginheight='0' marginwidth='0' src='" + m.id + "'></iframe>";
					//mediaElem = "<a href='" + m.id + "' target='_blank'>" + "<img src='http://api.snapito.com/free/lc?url=" + m.id + "'></a>";
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
}