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
		
		create: function(data) {
			//$mediacontainer				=	element;
			var _valid					=	false;
			
			if (data.media != null && data.media != "") {
				var mediaElem			=	"";
				var captionElem			=	"";
				var creditElem			=	"";
				var m					=	VMM.MediaType(data.media); //returns an object with .type and .id
				var isTextMedia			=	false;
				var _id					=	"";
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
					mediaElem			=	"<img src='" + m.id + "'>";
			// FLICKR
				} else if (m.type		==	"flickr") {
					_id					=	"flickr_" + m.id;
					mediaElem			=	"<a href='" + m.link + "' target='_blank'><img id='" + _id + "_large" + "'></a>";
					VMM.ExternalAPI.flickr.get(m.id, "#" + _id);
			// GOOGLE DOCS
				} else if (m.type		==	"googledoc") {
					_id					=	"googledoc_" + VMM.Util.unique_ID(5);
					mediaElem			=	"<div class='media-frame doc' id='" + _id + "'><span class='messege'><p>Loading Document</p></span></div>";
					VMM.ExternalAPI.googledocs.get(m.id, _id);
			// YOUTUBE
				} else if (m.type		==	"youtube") {
					mediaElem			=	"<div class='media-frame video youtube' id='youtube_" + m.id + "'><span class='messege'><p>Loading YouTube video</p></span></div>";
					VMM.ExternalAPI.youtube.get(m.id);
			// VIMEO
				} else if (m.type		==	"vimeo") {
					mediaElem			=	"<iframe class='media-frame video vimeo' autostart='false' frameborder='0' width='100%' height='100%' src='http://player.vimeo.com/video/" + m.id + "?title=0&amp;byline=0&amp;portrait=0&amp;color=ffffff'></iframe>";
					VMM.ExternalAPI.vimeo.get(m.id);
			// DAILYMOTION
				} else if (m.type		==	"dailymotion") {
					mediaElem			=	"<iframe class='media-frame video dailymotion' autostart='false' frameborder='0' width='100%' height='100%' src='http://www.dailymotion.com/embed/video/" + m.id + "'></iframe>";
			// TWITTER
				} else if (m.type		==	"twitter"){
					mediaElem			=	"<div class='twitter' id='" + "twitter_" + m.id + "'><span class='messege'><p>Loading Tweet</p></span></div>";
					isTextMedia			=	true;
					VMM.ExternalAPI.twitter.prettyHTML(m.id);
			// TWITTER
				} else if (m.type		==	"twitter-ready") {
					mediaElem			=	m.id;
			// SOUNDCLOUD
				} else if (m.type		==	"soundcloud") {
					_id					=	"soundcloud_" + VMM.Util.unique_ID(5);
					mediaElem			=	"<div class='media-frame soundcloud' id='" + _id + "'><span class='messege'><p>Loading Sound</p></span></div>";
					VMM.ExternalAPI.soundcloud.get(m.id, _id);
			// GOOGLE MAPS
				} else if (m.type		==	"google-map") {
					_id					=	"googlemap_" + VMM.Util.unique_ID(7);
					mediaElem			=	"<div class='media-frame map' id='" + _id + "'><span class='messege'><p>Loading Map</p></span></div>";
					VMM.ExternalAPI.googlemaps.get(m.id, _id);
			// WIKIPEDIA
				} else if (m.type		==	"wikipedia") {
					_id					=	"wikipedia_" + VMM.Util.unique_ID(7);
					mediaElem			=	"<div class='wikipedia' id='" + _id + "'><span class='messege'><p>Loading Wikipedia</p></span></div>";
					VMM.ExternalAPI.wikipedia.get(m.id, _id);
			// UNKNOWN
				} else if (m.type		==	"unknown") { 
					trace("NO KNOWN MEDIA TYPE FOUND TRYING TO JUST PLACE THE HTML"); 
					mediaElem			=	"<div class='plain-text'><div class='container'>" + VMM.Util.properQuotes(m.id) + "</div></div>";
			// WEBSITE
				} else if (m.type		==	"website") { 
					mediaElem			=	"<iframe class='media-frame website' frameborder='0' autostart='false' width='100%' height='100%' scrolling='yes' marginheight='0' marginwidth='0' src='" + m.id + "'></iframe>";
					//mediaElem			=	"<a href='" + m.id + "' target='_blank'>" + "<img src='http://api.snapito.com/free/lc?url=" + m.id + "'></a>";
			// NO MATCH
				} else {
					trace("NO KNOWN MEDIA TYPE FOUND");
					trace(m.type);
				}
				
			// WRAP THE MEDIA ELEMENT
				mediaElem				=	"<div class='media-container' >" + mediaElem + creditElem + captionElem + "</div>";
			// RETURN
				if (isTextMedia) {
					return "<div class='media text-media'><div class='media-wrapper'>" + mediaElem + "</div></div>";
				} else {
					return "<div class='media'><div class='media-wrapper'>" + mediaElem + "</div></div>";
				}
				
				/*
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
				*/
			};
			
		},
		
	}).init();
}