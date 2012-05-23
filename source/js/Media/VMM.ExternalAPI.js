/* External API
================================================== */
if(typeof VMM != 'undefined' && typeof VMM.ExternalAPI == 'undefined') {
	
	VMM.ExternalAPI = {
		
		pushQues: function() {
			
			if (VMM.master_config.googlemaps.active) {
				VMM.ExternalAPI.googlemaps.pushQue();
			}
			if (VMM.master_config.youtube.active) {
				VMM.ExternalAPI.youtube.pushQue();
			}
			if (VMM.master_config.soundcloud.active) {
				VMM.ExternalAPI.soundcloud.pushQue();
			}
			if (VMM.master_config.googledocs.active) {
				VMM.ExternalAPI.googledocs.pushQue();
			}
			if (VMM.master_config.wikipedia.active) {
				VMM.ExternalAPI.wikipedia.pushQue();
			}
			if (VMM.master_config.vimeo.active) {
				VMM.ExternalAPI.vimeo.pushQue();
			}
			
		},
		
		twitter: {
			tweetArray: [],
			
			getHTML: function(id) {
				//var the_url = document.location.protocol + "//api.twitter.com/1/statuses/oembed.json?id=" + id+ "&callback=?";
				var the_url = "http://api.twitter.com/1/statuses/oembed.json?id=" + id+ "&callback=?";
				VMM.getJSON(the_url, VMM.ExternalAPI.twitter.onJSONLoaded);
			},
			
			onJSONLoaded: function(d) {
				trace("TWITTER JSON LOADED");
				var id = d.id;
				VMM.attachElement("#"+id, VMM.Util.linkify_with_twitter(d.html) );
			},
			
			parseTwitterDate: function(d) {
				var date = new Date(Date.parse(d));
				/*
				var t = d.replace(/(\d{1,2}[:]\d{2}[:]\d{2}) (.*)/, '$2 $1');
				t = t.replace(/(\+\S+) (.*)/, '$2 $1');
				var date = new Date(Date.parse(t)).toLocaleDateString();
				var time = new Date(Date.parse(t)).toLocaleTimeString();
				*/
				return date;
			},
			
			prettyParseTwitterDate: function(d) {
				var date = new Date(Date.parse(d));
				return VMM.Date.prettyDate(date, true);
			},
			
			getTweets: function(tweets) {
				var tweetArray = [];
				var number_of_tweets = tweets.length;
				
				for(var i = 0; i < tweets.length; i++) {
					
					var twitter_id = "";
					
					
					/* FIND THE TWITTER ID
					================================================== */
					if (tweets[i].tweet.match("status\/")) {
						twitter_id = tweets[i].tweet.split("status\/")[1];
					} else if (tweets[i].tweet.match("statuses\/")) {
						twitter_id = tweets[i].tweet.split("statuses\/")[1];
					} else {
						twitter_id = "";
					}
					
					/* FETCH THE DATA
					================================================== */
					var the_url = "http://api.twitter.com/1/statuses/show.json?id=" + twitter_id + "&include_entities=true&callback=?";
					VMM.getJSON(the_url, function(d) {
						
						var tweet = {}
						/* FORMAT RESPONSE
						================================================== */
						var twit = "<div class='twitter'><blockquote><p>";
						var td = VMM.Util.linkify_with_twitter(d.text, "_blank");
						twit += td;
						twit += "</p>";
						
						twit += "— " + d.user.name + " (<a href='https://twitter.com/" + d.user.screen_name + "'>@" + d.user.screen_name + "</a>) <a href='https://twitter.com/" + d.user.screen_name + "/status/" + d.id + "'>" + VMM.ExternalAPI.twitter.prettyParseTwitterDate(d.created_at) + " </a></blockquote></div>";
						
						tweet.content = twit;
						tweet.raw = d;
						
						tweetArray.push(tweet);
						
						
						/* CHECK IF THATS ALL OF THEM
						================================================== */
						if (tweetArray.length == number_of_tweets) {
							var the_tweets = {tweetdata: tweetArray}
							VMM.fireEvent(global, "TWEETSLOADED", the_tweets);
						}
					})
					.success(function() { trace("second success"); })
					.error(function() { trace("error"); })
					.complete(function() { trace("complete"); });
					
				}
					
				
			},
			
			getTweetSearch: function(tweets, number_of_tweets) {
				var _number_of_tweets = 40;
				if (number_of_tweets != null && number_of_tweets != "") {
					_number_of_tweets = number_of_tweets;
				}
				
				var the_url = "http://search.twitter.com/search.json?q=" + tweets + "&rpp=" + _number_of_tweets + "&include_entities=true&result_type=mixed";
				var tweetArray = [];
				VMM.getJSON(the_url, function(d) {
					
					/* FORMAT RESPONSE
					================================================== */
					for(var i = 0; i < d.results.length; i++) {
						var tweet = {}
						var twit = "<div class='twitter'><blockquote><p>";
						var td = VMM.Util.linkify_with_twitter(d.results[i].text, "_blank");
						twit += td;
						twit += "</p>";
						twit += "— " + d.results[i].from_user_name + " (<a href='https://twitter.com/" + d.results[i].from_user + "'>@" + d.results[i].from_user + "</a>) <a href='https://twitter.com/" + d.results[i].from_user + "/status/" + d.id + "'>" + VMM.ExternalAPI.twitter.prettyParseTwitterDate(d.results[i].created_at) + " </a></blockquote></div>";
						tweet.content = twit;
						tweet.raw = d.results[i];
						tweetArray.push(tweet);
					}
					var the_tweets = {tweetdata: tweetArray}
					VMM.fireEvent(global, "TWEETSLOADED", the_tweets);
				});
				
			},
			
			prettyHTML: function(id, secondary) {
				var id = id.toString();
				var error_obj = {
					twitterid: id
				};
				var the_url = "http://api.twitter.com/1/statuses/show.json?id=" + id + "&include_entities=true&callback=?";
				var twitter_timeout = setTimeout(VMM.ExternalAPI.twitter.notFoundError, 4000, id);
				
				VMM.getJSON(the_url, VMM.ExternalAPI.twitter.formatJSON)
					.error(function(jqXHR, textStatus, errorThrown) {
						trace("TWITTER error");
						trace("TWITTER ERROR: " + textStatus + " " + jqXHR.responseText);
						VMM.attachElement("#twitter_"+id, "<p>ERROR LOADING TWEET " + id + "</p>" );
					})
					.success(function(d) {
						clearTimeout(twitter_timeout);
						if (secondary) {
							VMM.ExternalAPI.twitter.secondaryMedia(d);
						}
					});
			},
			
			notFoundError: function(id) {
				trace("TWITTER JSON ERROR TIMEOUT " + id);
				VMM.attachElement("#twitter_" + id, "<span class='messege'><p>Error loading tweet: " + id + "</p></span>"  );
				
				// CHECK RATE STATUS
				VMM.getJSON("http://api.twitter.com/1/account/rate_limit_status.json", function(d) {
					trace("REMAINING TWITTER API CALLS " + d.remaining_hits);
					trace("TWITTER RATE LIMIT WILL RESET AT " + d.reset_time);
					var mes = "";
					if (d.remaining_hits == 0) {
						mes		= 	"<p>You've reached the maximum number of tweets you can load in an hour.</p>";
						mes 	+=	"<p>You can view tweets again starting at: <br/>" + d.reset_time + "</p>";
					} else {
						mes 	= 	"<p>Tweet " + id + " was not found.</p>";
					}
					VMM.attachElement("#twitter_" + id, "<span class='messege'>" + mes + "</span>" );
				});
				
			},
			
			formatJSON: function(d) {
				var id = d.id_str;
				
				var twit = "<blockquote><p>";
				var td = VMM.Util.linkify_with_twitter(d.text, "_blank");
				//td = td.replace(/(@([\w]+))/g,"<a href='http://twitter.com/$2' target='_blank'>$1</a>");
				//td = td.replace(/(#([\w]+))/g,"<a href='http://twitter.com/#search?q=%23$2' target='_blank'>$1</a>");
				twit += td;
				twit += "</p></blockquote>";
				twit += " <a href='https://twitter.com/" + d.user.screen_name + "/status/" + d.id_str + "' target='_blank' alt='link to original tweet' title='link to original tweet'>" + "<span class='created-at'></span>" + " </a>";
				
				twit += "<div class='vcard author'>";
				twit += "<a class='screen-name url' href='https://twitter.com/" + d.user.screen_name + "' data-screen-name='" + d.user.screen_name + "' target='_blank'>";
				twit += "<span class='avatar'><img src=' " + d.user.profile_image_url + "'  alt=''></span>";
				twit += "<span class='fn'>" + d.user.name + "</span>";
				twit += "<span class='nickname'>@" + d.user.screen_name + "</span>";
				twit += "</a>";
				twit += "</div>";
				
				if (typeof d.entities.media != 'undefined') {
					if (d.entities.media[0].type == "photo") {
						twit += "<img src=' " + d.entities.media[0].media_url + "'  alt=''>"
					}
				}
				
				VMM.attachElement("#twitter_"+id.toString(), twit );
				
			},
			
			
		},
		
		googlemaps: {
			
			get: function(url, id) {
				var timer;
				var map_vars = VMM.Util.getUrlVars(url);
				var api_key;
				
				if (VMM.master_config.Timeline.api_keys.google != "") {
					api_key = VMM.master_config.Timeline.api_keys.google;
				} else {
					api_key = Aes.Ctr.decrypt(VMM.master_config.api_keys_master.google, VMM.master_config.vp, 256);
				}
				
				var map_url = "http://maps.googleapis.com/maps/api/js?key=" + api_key + "&libraries=places&sensor=false&callback=VMM.ExternalAPI.googlemaps.onMapAPIReady";
				var map = { url: url, vars: map_vars, id: id };
				
				if (VMM.master_config.googlemaps.active) {
					VMM.master_config.googlemaps.que.push(map);
				} else {
					VMM.master_config.googlemaps.que.push(map);
					
					if (VMM.master_config.googlemaps.api_loaded) {
						
					} else {
						VMM.LoadLib.js(map_url, function() {
							trace("Google Maps API Library Loaded");
						});
					}
				}
			},
			
			create: function(m) {
				var map_attribution = "";
				var layer;
				var map;
				
				function mapProvider(name) {
					if (name in VMM.ExternalAPI.googlemaps.map_providers) {
						map_attribution = VMM.ExternalAPI.googlemaps.map_attribution[VMM.ExternalAPI.googlemaps.map_providers[name].attribution];
						return VMM.ExternalAPI.googlemaps.map_providers[name];
					} else {
						if (VMM.ExternalAPI.googlemaps.defaultType(name)) {
							trace("GOOGLE MAP DEFAULT TYPE");
							return google.maps.MapTypeId[name.toUpperCase()];
						} else {
							trace("Not a maptype: " + name );
						}
					}
				}
				
				google.maps.VeriteMapType = function(name) {
					if (VMM.ExternalAPI.googlemaps.defaultType(name)) {
						return google.maps.MapTypeId[name.toUpperCase()];
					} else {
						var provider = 			mapProvider(name);
						return google.maps.ImageMapType.call(this, {
							"getTileUrl": function(coord, zoom) {
								var index = 	(zoom + coord.x + coord.y) % VMM.ExternalAPI.googlemaps.map_subdomains.length;
								return [
									provider.url
										.replace("{S}", VMM.ExternalAPI.googlemaps.map_subdomains[index])
										.replace("{Z}", zoom)
										.replace("{X}", coord.x)
										.replace("{Y}", coord.y)
										.replace("{z}", zoom)
										.replace("{x}", coord.x)
										.replace("{y}", coord.y)
								];
							},
							"tileSize": 		new google.maps.Size(256, 256),
							"name":				name,
							"minZoom":			provider.minZoom,
							"maxZoom":			provider.maxZoom
						});
					}
				};
				
				google.maps.VeriteMapType.prototype = new google.maps.ImageMapType("_");
				
				/* Make the Map
				================================================== */
				
				
				if (type.of(VMM.master_config.Timeline.maptype) == "string") {
					if (VMM.ExternalAPI.googlemaps.defaultType(VMM.master_config.Timeline.maptype)) {
						layer				=	google.maps.MapTypeId[VMM.master_config.Timeline.maptype.toUpperCase()];
					} else {
						layer				=	VMM.master_config.Timeline.maptype;
					}
				} else {
					layer					=	"toner";
				}
				
				var location				=	new google.maps.LatLng(41.875696,-87.624207);
				var latlong;
				var zoom					=	11;
				var has_location			=	false;
				var has_zoom				=	false;
				var map_bounds;
				
				if (type.of(VMM.Util.getUrlVars(m.url)["ll"]) == "string") {
					has_location			=	true;
					latlong					=	VMM.Util.getUrlVars(m.url)["ll"].split(",");
					location				=	new google.maps.LatLng(parseFloat(latlong[0]),parseFloat(latlong[1]));
					
				} else if (type.of(VMM.Util.getUrlVars(m.url)["sll"]) == "string") {
					latlong					=	VMM.Util.getUrlVars(m.url)["sll"].split(",");
					location				=	new google.maps.LatLng(parseFloat(latlong[0]),parseFloat(latlong[1]));
				} 
				
				if (type.of(VMM.Util.getUrlVars(m.url)["z"]) == "string") {
					has_zoom				=	true;
					zoom					=	parseFloat(VMM.Util.getUrlVars(m.url)["z"]);
				}
				
				var map_options = {
					zoom:						zoom,
					disableDefaultUI:			true,
					mapTypeControl:				false,
					zoomControl:				true,
					zoomControlOptions: {
						style:					google.maps.ZoomControlStyle.SMALL,
						position:				google.maps.ControlPosition.TOP_RIGHT
					},
					center: 					location,
					mapTypeId:					layer,
					mapTypeControlOptions: {
				        mapTypeIds:				[layer]
				    }
				}
				
				var unique_map_id			=	m.id.toString() + "_gmap";
				
				VMM.attachElement("#" + m.id, "<div class='google-map' id='" + unique_map_id + "' style='width=100%;height=100%;'></div>");
				
				var map						=	new google.maps.Map(document.getElementById(unique_map_id), map_options);
				
				if (VMM.ExternalAPI.googlemaps.defaultType(VMM.master_config.Timeline.maptype)) {
					
				} else {
					map.mapTypes.set(layer, new google.maps.VeriteMapType(layer));
					// ATTRIBUTION
					var map_attribution_html =	"<div class='map-attribution'><div class='attribution-text'>" + map_attribution + "</div></div>";
					VMM.appendElement("#"+unique_map_id, map_attribution_html);
				}
				
				loadKML();
				
				// KML
				function loadKML() {
					var kml_url				=	m.url + "&output=kml";
					kml_url					=	kml_url.replace("&output=embed", "");
					var kml_layer			=	new google.maps.KmlLayer(kml_url, {preserveViewport:true});
					var infowindow			=	new google.maps.InfoWindow();
					kml_layer.setMap(map);

					google.maps.event.addListenerOnce(kml_layer, "defaultviewport_changed", function() {
						map.fitBounds(kml_layer.getDefaultViewport() );
						if (has_location) {
							map.panTo(location);
						} 
						if (has_zoom) {
							map.setZoom(zoom);
						}
					});
					
					google.maps.event.addListener(kml_layer, 'click', function(kmlEvent) {
						var text			=	kmlEvent.featureData.description;
						showInfoWindow(text);
						
						function showInfoWindow(c) {
							infowindow.setContent(c);
							infowindow.open(map);
						}
					});
				}
				
			},
			
			pushQue: function() {
				for(var i = 0; i < VMM.master_config.googlemaps.que.length; i++) {
					VMM.ExternalAPI.googlemaps.create(VMM.master_config.googlemaps.que[i]);
				}
				VMM.master_config.googlemaps.que = [];
			},
			
			onMapAPIReady: function() {
				VMM.master_config.googlemaps.map_active = true;
				VMM.master_config.googlemaps.places_active = true;
				VMM.ExternalAPI.googlemaps.onAPIReady();
			},
			
			onPlacesAPIReady: function() {
				VMM.master_config.googlemaps.places_active = true;
				VMM.ExternalAPI.googlemaps.onAPIReady();
			},
			
			onAPIReady: function() {
				if (!VMM.master_config.googlemaps.active) {
					if (VMM.master_config.googlemaps.map_active && VMM.master_config.googlemaps.places_active) {
						VMM.master_config.googlemaps.active = true;
						VMM.ExternalAPI.googlemaps.pushQue();
					}
				}
			},
			
			defaultType: function(name) {
				if (name.toLowerCase() == "satellite" || name.toLowerCase() == "hybrid" || name.toLowerCase() == "terrain" || name.toLowerCase() == "roadmap") {
					return true;
				} else {
					return false;
				}
			},
			
			map_subdomains: ["", "a.", "b.", "c.", "d."],
			
			map_attribution: {
				"stamen": 			"Map tiles by <a href='http://stamen.com'>Stamen Design</a>, under <a href='http://creativecommons.org/licenses/by/3.0'>CC BY 3.0</a>. Data by <a href='http://openstreetmap.org'>OpenStreetMap</a>, under <a href='http://creativecommons.org/licenses/by-sa/3.0'>CC BY SA</a>.",
				"apple": 			"Map data &copy; 2012  Apple, Imagery &copy; 2012 Apple"
			},
						
			map_providers: {
				"toner": {
					"url": 			"http://{S}tile.stamen.com/toner/{Z}/{X}/{Y}.png",
					"minZoom": 		0,
					"maxZoom": 		20,
					"attribution": 	"stamen"
					
				},
				"toner-lines": {
					"url": 			"http://{S}tile.stamen.com/toner-lines/{Z}/{X}/{Y}.png",
					"minZoom": 		0,
					"maxZoom": 		20,
					"attribution": 	"stamen"
				},
				"toner-labels": {
					"url": 			"http://{S}tile.stamen.com/toner-labels/{Z}/{X}/{Y}.png",
					"minZoom": 		0,
					"maxZoom": 		20,
					"attribution": 	"stamen"
				},
				"sterrain": {
					"url": 			"http://{S}tile.stamen.com/terrain/{Z}/{X}/{Y}.jpg",
					"minZoom": 		4,
					"maxZoom": 		20,
					"attribution": 	"stamen"
				},
				"apple": {
					"url": 			"http://gsp2.apple.com/tile?api=1&style=slideshow&layers=default&lang=en_US&z={z}&x={x}&y={y}&v=9",
					"minZoom": 		4,
					"maxZoom": 		14,
					"attribution": 	"apple"
				},
				"watercolor": {
					"url": 			"http://{S}tile.stamen.com/watercolor/{Z}/{X}/{Y}.jpg",
					"minZoom": 		3,
					"maxZoom": 		16,
					"attribution": 	"stamen"
				}
			},
			
			
			
		},
		
		googledocs: {
			
			get: function(url, id) {
				var doc = {url: url, id: id};
				VMM.master_config.googledocs.que.push(doc);
				VMM.master_config.googledocs.active = true;
			},
			
			create: function(doc) {
				var mediaElem = ""; 
				if (doc.url.match(/docs.google.com/i)) {
					mediaElem	=	"<iframe class='doc' frameborder='0' width='100%' height='100%' src='" + doc.url + "&amp;embedded=true'></iframe>";
				} else {
					mediaElem	=	"<iframe class='doc' frameborder='0' width='100%' height='100%' src='" + "http://docs.google.com/viewer?url=" + doc.url + "&amp;embedded=true'></iframe>";
				}
				VMM.attachElement("#"+doc.id, mediaElem);
			},
			
			pushQue: function() {
				for(var i = 0; i < VMM.master_config.googledocs.que.length; i++) {
					VMM.ExternalAPI.googledocs.create(VMM.master_config.googledocs.que[i]);
				}
				VMM.master_config.googledocs.que = [];
			}
		
		},
		
		flickr: {
			
			get: function(mid, id) {
				var api_key;
				if (VMM.master_config.Timeline.api_keys.flickr != "") {
					api_key = VMM.master_config.Timeline.api_keys.flickr;
				} else {
					api_key = Aes.Ctr.decrypt(VMM.master_config.api_keys_master.flickr, VMM.master_config.vp, 256)
				}
				var the_url = "http://api.flickr.com/services/rest/?method=flickr.photos.getSizes&api_key=" + api_key + "&photo_id=" + mid + "&format=json&jsoncallback=?";
				VMM.getJSON(the_url, VMM.ExternalAPI.flickr.create);
			},
			
			create: function(d) {
				var flickr_id = d.sizes.size[0].url.split("photos\/")[1].split("/")[1];
				var id = "flickr_" + flickr_id;
				var flickr_large_id = id + "_large";
				var flickr_thumb_id = id + "_thumb";
				var flickr_img_size, flickr_img_thumb, flickr_size_found = false;
				var flickr_best_size = "Large";
				
				flickr_best_size = VMM.ExternalAPI.flickr.sizes(VMM.master_config.sizes.api.height);
				
				for(var i = 0; i < d.sizes.size.length; i++) {
					if (d.sizes.size[i].label == flickr_best_size) {
						flickr_size_found = true;
						flickr_img_size = d.sizes.size[i].source;
					}
				}
				if (!flickr_size_found) {
					flickr_img_size = d.sizes.size[d.sizes.size.length - 1].source;
				}
				
				flickr_img_thumb = d.sizes.size[0].source;
				VMM.Lib.attr("#"+flickr_large_id, "src", flickr_img_size);
				VMM.attachElement("#"+flickr_thumb_id, "<img src='" + flickr_img_thumb + "'>");
			},
			
			sizes: function(s) {
				var _size = "";
				if (s <= 75) {
					_size = "Thumbnail";
				} else if (s <= 180) {
					_size = "Small";
				} else if (s <= 240) {
					_size = "Small 320";
				} else if (s <= 375) {
					_size = "Medium";
				} else if (s <= 480) {
					_size = "Medium 640";
				} else if (s <= 600) {
					_size = "Medium 800";
				} else {
					_size = "Large";
				}
				
				return _size;
			}
			
		},
		
		instagram: {
			get: function(mid, thumb) {
				if (thumb) {
					return "http://instagr.am/p/" + mid + "/media/?size=t";
				} else {
					return "http://instagr.am/p/" + mid + "/media/?size=" + VMM.ExternalAPI.instagram.sizes(VMM.master_config.sizes.api.height);
				}
			},
			
			sizes: function(s) {
				var _size = "";
				if (s <= 150) {
					_size = "t";
				} else if (s <= 306) {
					_size = "m";
				} else {
					_size = "l";
				}
				
				return _size;
			}
		},
		
		soundcloud: {
			
			get: function(url, id) {
				var sound = {url: url, id: id};
				VMM.master_config.soundcloud.que.push(sound);
				VMM.master_config.soundcloud.active = true;
			},
			
			create: function(sound) {
				var the_url = "http://soundcloud.com/oembed?url=" + sound.url + "&format=js&callback=?";
				VMM.getJSON(the_url, function(d) {
					VMM.attachElement("#"+sound.id, d.html);
				});
			},
			
			pushQue: function() {
				for(var i = 0; i < VMM.master_config.soundcloud.que.length; i++) {
					VMM.ExternalAPI.soundcloud.create(VMM.master_config.soundcloud.que[i]);
				}
				VMM.master_config.soundcloud.que = [];
			},
			
		},
		
		wikipedia: {
			
			get: function(url, id) {
				var api_obj = {url: url, id: id};
				VMM.master_config.wikipedia.que.push(api_obj);
				VMM.master_config.wikipedia.active = true;
			},
			
			create: function(api_obj) {
				var the_url = "http://" + VMM.master_config.language.api.wikipedia + ".wikipedia.org/w/api.php?action=query&prop=extracts&redirects=&titles=" + api_obj.url + "&exintro=1&format=json&callback=?";
				if ( VMM.Browser.browser == "Explorer" && parseInt(VMM.Browser.version, 10) >= 7 && window.XDomainRequest) {
					var temp_text	=	"<h4><a href='http://" + VMM.master_config.language.api.wikipedia + ".wikipedia.org/wiki/" + api_obj.url + "' target='_blank'>" + api_obj.url + "</a></h4>";
					temp_text		+=	"<span class='wiki-source'>" + VMM.master_config.language.messages.wikipedia + "</span>";
					temp_text		+=	"<p>Wikipedia entry unable to load using Internet Explorer 8 or below.</p>";
					VMM.attachElement("#"+api_obj.id, temp_text );
				}
				
				VMM.getJSON(the_url, function(d) {
					if (d.query) {
						var wiki_extract = VMM.Util.getObjectAttributeByIndex(d.query.pages, 0).extract;
						var wiki_title = VMM.Util.getObjectAttributeByIndex(d.query.pages, 0).title;
						var _wiki = "";
						var wiki_text = "";
						var wiki_text_array = wiki_extract.split("<p>");
						var wiki_number_of_paragraphs = 1;
					
						for(var i = 0; i < wiki_text_array.length; i++) {
							if (i+1 <= wiki_number_of_paragraphs && i+1 < wiki_text_array.length) {
								wiki_text	+= "<p>" + wiki_text_array[i+1];
							}
						}
					
						_wiki		=	"<h4><a href='http://" + VMM.master_config.language.api.wikipedia + ".wikipedia.org/wiki/" + wiki_title + "' target='_blank'>" + wiki_title + "</a></h4>";
						_wiki		+=	"<span class='wiki-source'>" + VMM.master_config.language.messages.wikipedia + "</span>";
						_wiki		+=	VMM.Util.linkify_wikipedia(wiki_text);
					
						if (wiki_extract.match("REDIRECT")) {
						
						} else {
							VMM.attachElement("#"+api_obj.id, _wiki );
						}
					}
					
				});
				
			},
			
			pushQue: function() {
				trace("WIKIPEDIA PUSH QUE");
				for(var i = 0; i < VMM.master_config.wikipedia.que.length; i++) {
					VMM.ExternalAPI.wikipedia.create(VMM.master_config.wikipedia.que[i]);
				}
				VMM.master_config.wikipedia.que = [];
			},
			
		},
		
		youtube: {
			
			get: function(id) {
				var url = "http://gdata.youtube.com/feeds/api/videos/" + id + "?v=2&alt=jsonc&callback=?";
				
				if (VMM.master_config.youtube.active) {
					VMM.master_config.youtube.que.push(id);
				} else {
					VMM.master_config.youtube.que.push(id);
					if (!VMM.master_config.youtube.api_loaded) {
						VMM.LoadLib.js('http://www.youtube.com/player_api', function() {
							trace("YouTube API Library Loaded");
						});
					}
				}
				
				// THUMBNAIL
				VMM.getJSON(url, VMM.ExternalAPI.youtube.createThumb);
			},
			
			create: function(id) {
				
				var p = {
					active: 				false,
					player: 				{},
					name:					'youtube_'+id,
					playing:				false
				};
				
				p.player['youtube_'+id] = new YT.Player('youtube_'+id, {
					height: 				'390',
					width: 					'640',
					playerVars: {
						enablejsapi:		1,
						color: 				'white',
						showinfo:			0,
						theme:				'light',
						rel:				0
					},
					videoId: id,
					events: {
						'onReady': 			VMM.ExternalAPI.youtube.onPlayerReady,
						'onStateChange': 	VMM.ExternalAPI.youtube.onStateChange
					}
				});
				
				VMM.master_config.youtube.array.push(p);
			},
			
			createThumb: function(d) {
				if (typeof d.data != 'undefined') {
					var thumb_id = "youtube_" + d.data.id + "_thumb";
					VMM.attachElement("#" + thumb_id, "<img src='" + d.data.thumbnail.sqDefault + "'>");
					
				}
			},
			
			pushQue: function() {
				for(var i = 0; i < VMM.master_config.youtube.que.length; i++) {
					VMM.ExternalAPI.youtube.create(VMM.master_config.youtube.que[i]);
				}
				VMM.master_config.youtube.que = [];
			},
			
			onAPIReady: function() {
				VMM.master_config.youtube.active = true;
				VMM.ExternalAPI.youtube.pushQue();
			},
			
			stopPlayers: function() {
				for(var i = 0; i < VMM.master_config.youtube.array.length; i++) {
					if (VMM.master_config.youtube.array[i].playing) {
						var the_name = VMM.master_config.youtube.array[i].name;
						VMM.master_config.youtube.array[i].player[the_name].stopVideo();
					}
				}
			},
			
			onStateChange: function(e) {
				for(var i = 0; i < VMM.master_config.youtube.array.length; i++) {
					var the_name = VMM.master_config.youtube.array[i].name;
					if (VMM.master_config.youtube.array[i].player[the_name] == e.target) {
						if (e.data == YT.PlayerState.PLAYING) {
							VMM.master_config.youtube.array[i].playing = true;
						}
					}
				}
			},
			
			onPlayerReady: function(e) {
				
			}
			
			
		},
		
		vimeo: {
			
			get: function(id) {
				VMM.master_config.vimeo.que.push(id);
				VMM.master_config.vimeo.active = true;
			},
			
			create: function(d) {
				trace("VIMEO CREATE");
				// THUMBNAIL
				var url = "http://vimeo.com/api/v2/video/" + d + ".json";
				VMM.getJSON(url, VMM.ExternalAPI.vimeo.createThumb);
			},
			
			createThumb: function(d) {
				trace("VIMEO CREATE THUMB");
				var thumb_id = "vimeo_" + d[0].id + "_thumb";
				VMM.attachElement("#" + thumb_id, "<img src='" + d[0].thumbnail_small + "'>");
			},
			
			pushQue: function() {
				for(var i = 0; i < VMM.master_config.vimeo.que.length; i++) {
					VMM.ExternalAPI.vimeo.create(VMM.master_config.vimeo.que[i]);
				}
				VMM.master_config.vimeo.que = [];
			}
			
		}
	
	}
	
}

/*  YOUTUBE API READY
	Can't find a way to customize this callback and keep it in the VMM namespace
	Youtube wants it to be this function. 
================================================== */
function onYouTubePlayerAPIReady() {
	trace("GLOBAL YOUTUBE API CALLED")
	VMM.ExternalAPI.youtube.onAPIReady();
}