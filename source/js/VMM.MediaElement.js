/* MediaElement
================================================== */
if(typeof VMM != 'undefined' && typeof VMM.MediaElement == 'undefined') {
	
	VMM.MediaElement = ({
		
		init: function() {
			return this;
		},
		
		thumbnail: function(data, w, h) {
			_w = 32;
			_h = 32;
			if (w != null && w != "") {_w = w};
			if (h != null && h != "") {_h = h};
			
			if (data.media != null && data.media != "") {
				_valid				=	true;
				var mediaElem		=	"";
				var m				=	VMM.MediaType(data.media); //returns an object with .type and .id
				// CREATE MEDIA CODE 
				if (m.type == "image") {
					mediaElem		=	"<div class='thumbnail'><img src='" + m.id + "' width='" + _w + "px' height='" + _h + "px'></div>";
					return mediaElem;
				} else if (m.type	==	"flickr") {
					mediaElem		=	"<div class='thumbnail'><img id='flickr_" + m.id + "_thumb' width='" + _w + "px' height='" + _h + "px'></div>";
					return mediaElem;
				} else if (m.type	==	"youtube") {
					mediaElem		=	"<div class='thumbnail youtube'></div>";
					return mediaElem;
				} else if (m.type	==	"googledoc") {
					mediaElem		=	"";
				} else if (m.type	==	"vimeo") {
					mediaElem		=	"<div class='thumbnail vimeo'></div>";
					return mediaElem;
				} else if (m.type	==	"twitter"){
					mediaElem		=	"<div class='thumbnail twitter'></div>";
					return mediaElem;
				} else if (m.type	==	"twitter-ready") {
					mediaElem		=	"<div class='thumbnail twitter'></div>";
					return mediaElem;
				} else if (m.type	==	"soundcloud") {
					mediaElem		=	"<div class='thumbnail soundcloud'></div>";
					return mediaElem;
				} else if (m.type	==	"google-map") {
					mediaElem		=	"<div class='thumbnail map'></div>";
					return mediaElem;
				} else if (m.type	==	"unknown") {
					mediaElem		=	"";
					return mediaElem;
				} else if (m.type	==	"website") {
					mediaElem		=	"<div class='thumbnail website'></div>";
					//mediaElem		=	"<div class='thumbnail'><img src='http://api.snapito.com/free/sc?url=" + m.id + "' width='" + _w + "px' height='" + _h + "px'></div>";
					return mediaElem;
				} else {
					mediaElem = "<div class='thumbnail'></div>";
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
					var flickr_id		=	"flickr_" + m.id;
					mediaElem			=	"<a href='" + m.link + "' target='_blank'><img id='" + flickr_id + "_large" + "'></a>";
					VMM.ExternalAPI.flickr.get(m.id, "#" + flickr_id);
			// GOOGLE DOCS
				} else if (m.type		==	"googledoc") {
					var googledocs_id	=	"googledoc_" + VMM.Util.unique_ID(5);
					mediaElem			=	"<div class='media-frame doc' id='" + googledocs_id + "'><span class='messege'>Loading Document</span></div>";
					VMM.ExternalAPI.googledocs.get(m.id, googledocs_id);
			// YOUTUBE
				} else if (m.type		==	"youtube") {
					mediaElem			=	"<div class='media-frame video youtube' id='youtube_" + m.id + "'>Loading YouTube video...</div>";
					VMM.ExternalAPI.youtube.get(m.id);
			// VIMEO
				} else if (m.type		==	"vimeo") {
					mediaElem			=	"<iframe class='media-frame video vimeo' autostart='false' frameborder='0' width='100%' height='100%' src='http://player.vimeo.com/video/" + m.id + "?title=0&amp;byline=0&amp;portrait=0&amp;color=ffffff'></iframe>";
			// TWITTER
				} else if (m.type		==	"twitter"){
					mediaElem			=	"<div class='twitter' id='" + "twitter_" + m.id + "'><span class='messege'>Loading Tweet</span></div>";
					isTextMedia			=	true;
					VMM.ExternalAPI.twitter.prettyHTML(m.id);
			// TWITTER
				} else if (m.type		==	"twitter-ready") {
					mediaElem			=	m.id;
			// SOUNDCLOUD
				} else if (m.type		==	"soundcloud") {
					var soundcloud_id	=	"soundcloud_" + VMM.Util.unique_ID(5);
					mediaElem			=	"<div class='media-frame soundcloud' id='" + soundcloud_id + "'><span class='messege'>Loading Sound</span></div>";
					VMM.ExternalAPI.soundcloud.get(m.id, soundcloud_id);
			// GOOGLE MAPS
				} else if (m.type		==	"google-map") {
					var map_id			=	"googlemap_" + VMM.Util.unique_ID(7);
					mediaElem			=	"<div class='media-frame map' id='" + map_id + "'><span class='messege'>Loading Map</span></div>";
					VMM.ExternalAPI.googlemaps.get(m.id, map_id);
			// UNKNOWN
				} else if (m.type		==	"unknown") { 
					trace("NO KNOWN MEDIA TYPE FOUND TRYING TO JUST PLACE THE HTML"); 
					mediaElem			=	"<div class='media-frame plain-text'><div class='container'>" + VMM.Util.properQuotes(m.id) + "</div></div>";
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