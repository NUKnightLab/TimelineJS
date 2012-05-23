/* MediaElement
================================================== */
if(typeof VMM != 'undefined' && typeof VMM.MediaElement == 'undefined') {
	
	VMM.MediaElement = ({
		
		init: function() {
			return this;
		},
		
		thumbnail: function(data, w, h) {
			_w = 16;
			_h = 24;
			if (w != null && w != "") {_w = w};
			if (h != null && h != "") {_h = h};
			
			if (data.media != null && data.media != "") {
				_valid				=	true;
				var mediaElem		=	"";
				var m				=	VMM.MediaType(data.media); //returns an object with .type and .id
				// CREATE MEDIA CODE 
				if (m.type == "image") {
					//mediaElem		=	"<div class='thumbnail thumb-photo'><img src='" + m.id + "' width='" + _w + "px' height='" + _h + "px'></div>";
					mediaElem		=	"<div class='thumbnail thumb-photo'></div>";
					return mediaElem;
				} else if (m.type	==	"flickr") {
					mediaElem		=	"<div class='thumbnail thumb-photo' id='flickr_" + m.id + "_thumb'></div>";
					return mediaElem;
				} else if (m.type	==	"instagram") {
					mediaElem		=	"<div class='thumbnail thumb-instagram' id='instagram_" + m.id + "_thumb'><img src='" + VMM.ExternalAPI.instagram.get(m.id, true) + "'></div>";
					return mediaElem;
				} else if (m.type	==	"youtube") {
					mediaElem		=	"<div class='thumbnail thumb-youtube' id='youtube_" + m.id + "_thumb'></div>";
					return mediaElem;
				} else if (m.type	==	"googledoc") {
					mediaElem		=	"<div class='thumbnail thumb-document'></div>";
					return mediaElem;
				} else if (m.type	==	"vimeo") {
					mediaElem		=	"<div class='thumbnail thumb-vimeo' id='vimeo_" + m.id + "_thumb'></div>";
					return mediaElem;
				} else if (m.type  ==  "dailymotion") {
					mediaElem		=  "<div class='thumbnail thumb-video'></div>";
					return mediaElem;
				} else if (m.type	==	"twitter"){
					mediaElem		=	"<div class='thumbnail thumb-twitter'></div>";
					return mediaElem;
				} else if (m.type	==	"twitter-ready") {
					mediaElem		=	"<div class='thumbnail thumb-twitter'></div>";
					return mediaElem;
				} else if (m.type	==	"soundcloud") {
					mediaElem		=	"<div class='thumbnail thumb-audio'></div>";
					return mediaElem;
				} else if (m.type	==	"google-map") {
					mediaElem		=	"<div class='thumbnail thumb-map'></div>";
					return mediaElem;
				} else if (m.type	==	"wikipedia") {
					mediaElem		=	"<div class='thumbnail thumb-wikipedia'></div>";
					return mediaElem;
				} else if (m.type	==	"storify") {
					mediaElem		=	"<div class='thumbnail thumb-storify'></div>";
					return mediaElem;
				} else if (m.type	==	"quote") {
					mediaElem		=	"<div class='thumbnail thumb-quote'></div>";
					return mediaElem;
				} else if (m.type	==	"unknown") {
					if (m.id.match("blockquote")) {
						mediaElem		=	"<div class='thumbnail thumb-quote'></div>";
					} else {
						mediaElem		=	"<div class='thumbnail thumb-plaintext'></div>";
					}
					return mediaElem;
				} else if (m.type	==	"website") {
					mediaElem		=	"<div class='thumbnail thumb-website'></div>";
					//mediaElem		=	"<div class='thumbnail'><img src='http://api.snapito.com/free/sc?url=" + m.id + "' width='" + _w + "px' height='" + _h + "px'></div>";
					return mediaElem;
				} else {
					mediaElem = "<div class='thumbnail thumb-plaintext'></div>";
					return mediaElem;
				}
			} 
		},
		
		create: function(data, secondary) {
			//$mediacontainer				=	element;
			var _valid					=	false;
			
			if (data.media != null && data.media != "") {
				var mediaElem = "", captionElem = "", creditElem = "", _id = "", isTextMedia = false;
				var m					=	VMM.MediaType(data.media); //returns an object with .type and .id
				_valid					=	true;
				
			// CREDIT
				if (data.credit != null && data.credit != "") {
					creditElem			=	"<div class='credit'>" + VMM.Util.linkify_with_twitter(data.credit, "_blank") + "</div>";
				}
			// CAPTION
				if (data.caption != null && data.caption != "") {
					captionElem			=	"<div class='caption'>" + VMM.Util.linkify_with_twitter(data.caption, "_blank") + "</div>";
				}
			// IMAGE
				if (m.type				==	"image") {
					mediaElem			=	"<div class='media-image media-shadow'><img src='" + m.id + "' class='media-image'></div>";
			// FLICKR
				} else if (m.type		==	"flickr") {
					_id					=	"flickr_" + m.id;
					mediaElem			=	"<div class='media-image media-shadow'><a href='" + m.link + "' target='_blank'><img id='" + _id + "_large" + "'></a></div>";
					VMM.ExternalAPI.flickr.get(m.id, "#" + _id);
			// INSTAGRAM
				} else if (m.type		==	"instagram") {
					_id					=	"flickr_" + m.id;
					mediaElem			=	"<div class='media-image media-shadow'><a href='" + m.link + "' target='_blank'><img src='" + VMM.ExternalAPI.instagram.get(m.id) + "'></a></div>";
			// GOOGLE DOCS
				} else if (m.type		==	"googledoc") {
					_id					=	"googledoc_" + VMM.Util.unique_ID(5);
					mediaElem			=	"<div class='media-frame media-shadow doc' id='" + _id + "'><span class='messege'><p>Loading Document</p></span></div>";
					VMM.ExternalAPI.googledocs.get(m.id, _id);
			// YOUTUBE
				} else if (m.type		==	"youtube") {
					mediaElem			=	"<div class='media-shadow'><div class='media-frame video youtube' id='youtube_" + m.id + "'><span class='messege'><p>Loading YouTube video</p></span></div></div>";
					VMM.ExternalAPI.youtube.get(m.id);
			// VIMEO
				} else if (m.type		==	"vimeo") {
					mediaElem			=	"<div class='media-shadow'><iframe class='media-frame video vimeo' autostart='false' frameborder='0' width='100%' height='100%' src='http://player.vimeo.com/video/" + m.id + "?title=0&amp;byline=0&amp;portrait=0&amp;color=ffffff'></iframe></div>";
					VMM.ExternalAPI.vimeo.get(m.id);
			// DAILYMOTION
				} else if (m.type		==	"dailymotion") {
					mediaElem			=	"<div class='media-shadow'><iframe class='media-frame video dailymotion' autostart='false' frameborder='0' width='100%' height='100%' src='http://www.dailymotion.com/embed/video/" + m.id + "'></iframe></div>";
			// TWITTER
				} else if (m.type		==	"twitter"){
					mediaElem			=	"<div class='twitter' id='" + "twitter_" + m.id + "'><span class='messege'><p>Loading Tweet</p></span></div>";
					isTextMedia			=	true;
					VMM.ExternalAPI.twitter.prettyHTML(m.id, secondary);
			// TWITTER
				} else if (m.type		==	"twitter-ready") {
					isTextMedia			=	true;
					mediaElem			=	m.id;
			// SOUNDCLOUD
				} else if (m.type		==	"soundcloud") {
					_id					=	"soundcloud_" + VMM.Util.unique_ID(5);
					mediaElem			=	"<div class='media-frame media-shadow soundcloud' id='" + _id + "'><span class='messege'><p>Loading Sound</p></span></div>";
					VMM.ExternalAPI.soundcloud.get(m.id, _id);
			// GOOGLE MAPS
				} else if (m.type		==	"google-map") {
					_id					=	"googlemap_" + VMM.Util.unique_ID(7);
					mediaElem			=	"<div class='media-frame media-shadow map' id='" + _id + "'><span class='messege'><p>Loading Map</p></span></div>";
					VMM.ExternalAPI.googlemaps.get(m.id, _id);
			// WIKIPEDIA
				} else if (m.type		==	"wikipedia") {
					_id					=	"wikipedia_" + VMM.Util.unique_ID(7);
					mediaElem			=	"<div class='wikipedia' id='" + _id + "'><span class='messege'><p>Loading Wikipedia</p></span></div>";
					isTextMedia			=	true;
					VMM.ExternalAPI.wikipedia.get(m.id, _id);
			// STORIFY
				} else if (m.type		==	"storify") { 
					isTextMedia			=	true;
					mediaElem			=	"<div class='plain-text-quote'>" + m.id + "</div>";
			// QUOTE
				} else if (m.type		==	"quote") { 
					isTextMedia			=	true;
					mediaElem			=	"<div class='plain-text-quote'>" + m.id + "</div>";
			// UNKNOWN
				} else if (m.type		==	"unknown") { 
					trace("NO KNOWN MEDIA TYPE FOUND TRYING TO JUST PLACE THE HTML"); 
					isTextMedia			=	true;
					mediaElem			=	"<div class='plain-text'><div class='container'>" + VMM.Util.properQuotes(m.id) + "</div></div>";
			// WEBSITE
				} else if (m.type		==	"website") { 
					//mediaElem			=	"<div class='media-shadow'><iframe class='media-frame website' frameborder='0' autostart='false' width='100%' height='100%' scrolling='yes' marginheight='0' marginwidth='0' src='" + m.id + "'></iframe></div>";
					//mediaElem			=	"<a href='" + m.id + "' target='_blank'>" + "<img src='http://api.snapito.com/free/lc?url=" + m.id + "'></a>";
					
					mediaElem			=	"<div class='media-shadow website'><a href='" + m.id + "' target='_blank'>" + "<img src='http://api1.thumbalizr.com/?url=" + m.id.replace(/[\./]$/g, "") + "&width=300' class='media-image'></a></div>";
					
			// NO MATCH
				} else {
					trace("NO KNOWN MEDIA TYPE FOUND");
					trace(m.type);
				}
				
			// WRAP THE MEDIA ELEMENT
				mediaElem				=	"<div class='media-container' >" + mediaElem + creditElem + captionElem + "</div>";
			// RETURN
				if (isTextMedia) {
					return "<div class='text-media'><div class='media-wrapper'>" + mediaElem + "</div></div>";
				} else {
					return "<div class='media-wrapper'>" + mediaElem + "</div>";
				}
				
			};
			
		}
		
	}).init();
}