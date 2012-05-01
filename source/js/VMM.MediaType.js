/* MediaType
================================================== */
if(typeof VMM != 'undefined' && typeof VMM.MediaType == 'undefined') {
	
	//VMM.mediaType.youtube(d); //should return a true or false
	// VMM.MediaType(url); //returns an object with .type and .id
	
	VMM.MediaType = function(d) {
		var success = false;
		var media   = {};
		if (d.match("div class='twitter'")) {
			media.type  = "twitter-ready";
		    media.id    = d;
		    success = true;
		} else if (d.match('(www.)?youtube|youtu\.be')) {
			if (d.match('v=')) {
				youtube_id = VMM.Util.getUrlVars(d)["v"];
				//youtube_id = d.split(/embed\//)[1].split('"')[0];
			} else { 
				youtube_id = d.split(/v\/|v=|youtu\.be\//)[1].split(/[?&]/)[0];
			}
			//youtube_id = d.split(/v\/|v=|youtu\.be\//)[1].split(/[?&]/)[0];
			// http://www.youtube.com/watch?feature=player_embedded&v=0l-ivcnLrSc
			//http://www.youtube.com/watch?v=0l-ivcnLrSc
		    media.type  = "youtube";
		    media.id    = youtube_id;
		    success = true;
		} else if (d.match('(player.)?vimeo\.com')) {
		    //vimeo_id = d.split(/video\/|http:\/\/vimeo\.com\//)[1].split(/[?&]/)[0];
		    vimeo_id = d.split(/video\/|\/\/vimeo\.com\//)[1].split(/[?&]/)[0];
		
		    media.type  = "vimeo";
		    media.id    = vimeo_id;
		    success = true;
		} else if (d.match('(player.)?soundcloud\.com')) {
			//soundcloud_url = unescape(d.split(/value="/)[1].split(/["]/)[0]);
			//soundcloud_id = soundcloud_url.split(/tracks\//)[1].split(/[&"]/)[0];
			media.type  = "soundcloud";
			media.id    = d;
			success = true;
		} else if (d.match('(www.)?twitter\.com')) {
			trace("TWITTER MATCH");
			// https://twitter.com/#!/twitterapi/statuses/133640144317198338
			// https://twitter.com/#!/DeliciousHot/status/23189589820702720
			if (d.match("status\/")) {
				twitter_id = d.split("status\/")[1];
			} else if (d.match("statuses\/")) {
				twitter_id = d.split("statuses\/")[1];
			} else {
				twitter_id = "";
			}

			media.type = "twitter";
			media.id = twitter_id;
			success = true;
		} else if (d.match("maps.google") && !d.match("staticmap")) {
			//maps.google.com
			media.type  = "google-map";
		    media.id    = d.split(/src=['|"][^'|"]*?['|"]/gi);
			//trace("google map " + media.id);
			success = true;
		} else if (d.match("flickr.com/photos")) {
			media.type = "flickr";
			//media.id = d.split('/photos/[^/]+/([0-9]+)/gi');
			
			media.id = d.split("photos\/")[1].split("/")[1];
			media.link = d;
			//media.id = media.id.split("/")[1];
			//trace("FLICKR " + media.id);
			success = true;
		} else if (d.match(/jpg|jpeg|png|gif/i) || d.match("staticmap")) {
			media.type  = "image";
			media.id    = d;
			success = true;
		} else if (VMM.FileExtention.googleDocType(d)) {
			media.type  = "googledoc";
			media.id    = d;
			success = true;
		} 	else if (d.indexOf('http://') == 0) {
			media.type  = "website";
			media.id    = d;
			success = true;
		} else {
			trace("unknown media");  
			media.type  = "unknown";
			media.id    = d;
			success = true;
		}
		
		if (success) { 
			return media;
		} else {
			trace("No valid media id detected");
			trace(d);
		}
		return false;
	}
}