/* External API
================================================== */
if(typeof VMM != 'undefined' && typeof VMM.ExternalAPI == 'undefined') {
	
	VMM.ExternalAPI = {
		
		twitter: {
			tweetArray: [],
			// VMM.ExternalAPI.twitter.getHTML(id);
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
			
			// VMM.ExternalAPI.twitter.parseTwitterDate(date);
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
				return VMM.Util.date.prettyDate(date, true);
			},

			// VMM.ExternalAPI.twitter.getTweets(tweets_array);
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
			
			// VMM.ExternalAPI.twitter.getTweetSearch(search string);
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
			// VMM.ExternalAPI.twitter.prettyHTML(id);
			prettyHTML: function(id) {
				var id = id.toString();
				var error_obj = {
					twitterid: id
				};
				var the_url = "http://api.twitter.com/1/statuses/show.json?id=" + id + "&include_entities=true&callback=?";
				trace("id " + id);
				var twitter_timeout = setTimeout(VMM.ExternalAPI.twitter.notFoundError, 4000, id);
				VMM.getJSON(the_url, VMM.ExternalAPI.twitter.formatJSON)
				
					.error(function(jqXHR, textStatus, errorThrown) {
						trace("TWITTER error");
						trace("TWITTER ERROR: " + textStatus + " " + jqXHR.responseText);
						VMM.attachElement("#twitter_"+id, "<p>ERROR LOADING TWEET " + id + "</p>" );
					})
					.success(function() {
						clearTimeout(twitter_timeout);
					});
					
				
			},
			
			notFoundError: function(id) {
				trace("TWITTER JSON ERROR TIMEOUT " + id);
				VMM.attachElement("#twitter_" + id, "<p>TWEET NOT FOUND " + id + "</p>"  );
			},
			
			formatJSON: function(d) {
				trace("TWITTER JSON LOADED F");
				trace(d);
				var id = d.id_str;
				
				var twit = "<blockquote><p>";
				var td = VMM.Util.linkify_with_twitter(d.text, "_blank");
				//td = td.replace(/(@([\w]+))/g,"<a href='http://twitter.com/$2' target='_blank'>$1</a>");
				//td = td.replace(/(#([\w]+))/g,"<a href='http://twitter.com/#search?q=%23$2' target='_blank'>$1</a>");
				twit += td;
				twit += "</p></blockquote>";
				twit += " <a href='https://twitter.com/" + d.user.screen_name + "/status/" + d.id + "' target='_blank' alt='link to original tweet' title='link to original tweet'>" + "<span class='created-at'></span>" + " </a>";
				twit += "<div class='vcard author'>";
				twit += "<a class='screen-name url' href='https://twitter.com/" + d.user.screen_name + "' data-screen-name='" + d.user.screen_name + "' target='_blank'>";
				twit += "<span class='avatar'><img src=' " + d.user.profile_image_url + "'  alt=''></span>";
				twit += "<span class='fn'>" + d.user.name + "</span>";
				twit += "<span class='nickname'>@" + d.user.screen_name + "</span>";
				twit += "</a>";
				twit += "</div>";
				
				VMM.attachElement("#twitter_"+id.toString(), twit );
				
			}
			
		},
		
		//VMM.ExternalAPI.googlemaps.getMap()
		googlemaps: {
			/*
				//http://gsp2.apple.com/tile?api=1&style=slideshow&layers=default&lang=en_US&z={z}&x={x}&y={y}&v=9
				
				http://maps.google.com/maps?q=chicago&hl=en&sll=41.874961,-87.619054&sspn=0.159263,0.351906&t=t&hnear=Chicago,+Cook,+Illinois&z=11&output=kml
				http://maps.google.com/maps/ms?msid=215143221704623082244.0004a53ad1e3365113a32&msa=0
				http://maps.google.com/maps/ms?msid=215143221704623082244.0004a53ad1e3365113a32&msa=0&output=kml
				http://maps.google.com/maps/ms?msid=215143221704623082244.0004a21354b1a2f188082&msa=0&ll=38.719738,-9.142599&spn=0.04172,0.087976&iwloc=0004a214c0e99e2da91e0
				http://maps.google.com/maps?q=Bavaria&hl=en&ll=47.597829,9.398804&spn=1.010316,2.709503&sll=37.0625,-95.677068&sspn=73.579623,173.408203&hnear=Bavaria,+Germany&t=m&z=10&output=embed
				http://maps.google.com/maps?q=Zernikedreef+11,+Leiden,+Nederland&hl=en&sll=37.0625,-95.677068&sspn=45.957536,93.076172&oq=zernike&hnear=Zernikedreef+11,+Leiden,+Zuid-Holland,+The+Netherlands&t=m&z=16
			*/
			getMap: function(url, id) {
				var map_vars = VMM.Util.getUrlVars(url);
				trace(map_vars);
				var map_url = "http://maps.googleapis.com/maps/api/js?key=" + Aes.Ctr.decrypt(VMM.master_config.keys.google, VMM.master_config.vp, 256) + "&libraries=places&sensor=false&callback=VMM.ExternalAPI.googlemaps.onMapAPIReady";
				var map = {url: url, vars: map_vars, id: id}
				
				if (VMM.master_config.googlemaps.active) {
					VMM.master_config.googlemaps.createMap(map);
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
						for(var i = 0; i < VMM.master_config.googlemaps.que.length; i++) {
							VMM.ExternalAPI.googlemaps.createMap(VMM.master_config.googlemaps.que[i]);
						}
					}
				}
			},
			
			map_subdomains: ["", "a.", "b.", "c.", "d."],
			
			map_attribution: {
				"stamen": "Map tiles by <a href='http://stamen.com'>Stamen Design</a>, under <a href='http://creativecommons.org/licenses/by/3.0'>CC BY 3.0</a>. Data by <a href='http://openstreetmap.org'>OpenStreetMap</a>, under <a href='http://creativecommons.org/licenses/by-sa/3.0'>CC BY SA</a>.",
				"apple": "Map data &copy; 2012  Apple, Imagery &copy; 2012 Apple"
			},
						
			map_providers: {
				"toner": {
					"url": "http://{S}tile.stamen.com/toner/{Z}/{X}/{Y}.png",
					"minZoom": 0,
					"maxZoom": 20,
					"attribution": "stamen"
					
				},
				"toner-lines": {
					"url": "http://{S}tile.stamen.com/toner-lines/{Z}/{X}/{Y}.png",
					"minZoom": 0,
					"maxZoom": 20,
					"attribution": "stamen"
				},
				"toner-labels": {
					"url": "http://{S}tile.stamen.com/toner-labels/{Z}/{X}/{Y}.png",
					"minZoom": 0,
					"maxZoom": 20,
					"attribution": "stamen"
				},
				"sterrain": {
					"url": "http://{S}tile.stamen.com/terrain/{Z}/{X}/{Y}.jpg",
					"minZoom": 4,
					"maxZoom": 20,
					"attribution": "stamen"
				},
				"apple": {
					"url": "http://gsp2.apple.com/tile?api=1&style=slideshow&layers=default&lang=en_US&z={z}&x={x}&y={y}&v=9",
					"minZoom": 4,
					"maxZoom": 20,
					"attribution": "apple"
				},
				"watercolor": {
					"url": "http://{S}tile.stamen.com/watercolor/{Z}/{X}/{Y}.jpg",
					"minZoom": 3,
					"maxZoom": 16,
					"attribution": "stamen"
				}
			},
			
			createMap: function(m) {
				trace(VMM.ExternalAPI.googlemaps.stamen_map_attribution);
				/* 	MAP PROVIDERS
					Including Stamen Maps
					http://maps.stamen.com/
					Except otherwise noted, each of these map tile sets are © Stamen Design, under a Creative Commons Attribution (CC BY 3.0) license.
				================================================== */
				
				var map_attribution = "";
				
				function mapProvider(name) {
					if (name in VMM.ExternalAPI.googlemaps.map_providers) {
						map_attribution = VMM.ExternalAPI.googlemaps.map_attribution[VMM.ExternalAPI.googlemaps.map_providers[name].attribution];
						return VMM.ExternalAPI.googlemaps.map_providers[name];
					} else {
						throw 'No such provider: "' + name + '"';
					}
				}
				
				google.maps.VeriteMapType = function(name) {
					var provider = mapProvider(name);
					return google.maps.ImageMapType.call(this, {
						"getTileUrl": function(coord, zoom) {
							var index = (zoom + coord.x + coord.y) % VMM.ExternalAPI.googlemaps.map_subdomains.length;
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
						"tileSize": new google.maps.Size(256, 256),
						"name":     name,
						"minZoom":  provider.minZoom,
						"maxZoom":  provider.maxZoom
					});
				};
				
				google.maps.VeriteMapType.prototype = new google.maps.ImageMapType("_");
				
				/* Make the Map
				================================================== */
				var layer;
				
				
				if (type.of(VMM.master_config.Timeline.maptype) == "string") {
					layer = VMM.master_config.Timeline.maptype;
				} else {
					layer = "toner";
				}
				
				var location = new google.maps.LatLng(41.875696,-87.624207);
				var latlong;
				var zoom = 11;
				var has_location = false;
				var has_zoom = false;
				var map_bounds;
				
				if (type.of(VMM.Util.getUrlVars(m.url)["ll"]) == "string") {
					has_location = true;
					latlong = VMM.Util.getUrlVars(m.url)["ll"].split(",");
					location = new google.maps.LatLng(parseFloat(latlong[0]),parseFloat(latlong[1]));
					
				} else if (type.of(VMM.Util.getUrlVars(m.url)["sll"]) == "string") {
					latlong = VMM.Util.getUrlVars(m.url)["sll"].split(",");
					location = new google.maps.LatLng(parseFloat(latlong[0]),parseFloat(latlong[1]));
				} 
				
				if (type.of(VMM.Util.getUrlVars(m.url)["z"]) == "string") {
					has_zoom = true;
					zoom = parseFloat(VMM.Util.getUrlVars(m.url)["z"]);
				}
				
				var map_options = {
					zoom:zoom,
					disableDefaultUI: true,
					mapTypeControl: false,
					zoomControl: true,
					zoomControlOptions: {
						style: google.maps.ZoomControlStyle.SMALL,
						position: google.maps.ControlPosition.TOP_RIGHT
					},
					center: location,
					mapTypeId: layer,
					mapTypeControlOptions: {
				        mapTypeIds: [layer]
				    }
				}
				
				var unique_map_id = m.id.toString() + "_gmap";
				VMM.attachElement("#" + m.id, "<div class='google-map' id='" + unique_map_id + "' style='width=100%;height=100%;'></div>");
				
				var map = new google.maps.Map(document.getElementById(unique_map_id), map_options);
				map.mapTypes.set(layer, new google.maps.VeriteMapType(layer));
				
				/* ATTRIBUTION
				================================================== */
				var map_attribution_html = "<div class='map-attribution'><div class='attribution-text'>" + map_attribution + "</div></div>";
				VMM.appendElement("#"+unique_map_id, map_attribution_html);
				
				loadKML();
				
				/* KML
				================================================== */
				function loadKML() {
					var kml_url = m.url + "&output=kml";
					kml_url = kml_url.replace("&output=embed", "");
					
					var kml_layer = new google.maps.KmlLayer(kml_url, {preserveViewport:true});
					kml_layer.setMap(map);
					
					var infowindow = new google.maps.InfoWindow();

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
						var text = kmlEvent.featureData.description;
						trace(kmlEvent.featureData.infoWindowHtml)
						showInfoWindow(text);
						function showInfoWindow(c) {
							//trace("showInfoWindow")
							infowindow.setContent(c);
							infowindow.open(map);
						}
					});
				}
				
			},
			
		},
		
		//VMM.ExternalAPI.flickr.getPhoto(mediaID, htmlID);
		flickr: {
			
			getPhoto: function(mid, id) {
				// http://api.flickr.com/services/rest/?method=flickr.photos.getSizes&api_key=6d6f59d8d30d79f4f402a7644d5073e3&photo_id=6115056146&format=json&nojsoncallback=1
				var the_url = "http://api.flickr.com/services/rest/?method=flickr.photos.getSizes&api_key=" + Aes.Ctr.decrypt(VMM.master_config.keys.flickr, VMM.master_config.vp, 256) + "&photo_id=" + mid + "&format=json&jsoncallback=?";
				VMM.getJSON(the_url, VMM.ExternalAPI.flickr.setPhoto);
			},
			
			setPhoto: function(d) {
				var flickr_id = d.sizes.size[0].url.split("photos\/")[1].split("/")[1];
				var id = "flickr_" + flickr_id;
				var flickr_large_id = id + "_large";
				var flickr_thumb_id = id + "_thumb";
				// FIND LARGE SIZE
				var flickr_img_large;
				var flickr_large_found = false;
				for(var i = 0; i < d.sizes.size.length; i++) {
					if (d.sizes.size[i].label == "Large") {
						flickr_large_found = true;
						flickr_img_large = d.sizes.size[i].source;
					}
				}
				if (!flickr_large_found) {
					flickr_img_large = d.sizes.size[d.sizes.size.length - 1].source;
				}
				
				var flickr_img_thumb = d.sizes.size[0].source;
				VMM.Element.attr("#"+flickr_large_id, "src", flickr_img_large);
				VMM.Element.attr("#"+flickr_thumb_id, "src", flickr_img_thumb);
			}
			
			
		},
		
		soundcloud: {
			// VMM.ExternalAPI.soundcloud.getSound(url, id)
			/* 
				REFORMAT TO USE API FOR CUSTOM PLAYERS
			*/
			getSound: function(url, id) {
				// http://soundcloud.com/oembed?iframe=true&url=http://soundcloud.com/erasedtapes/olafur-arnalds-poland
				var the_url = "http://soundcloud.com/oembed?url=" + url + "&format=js&callback=?";
				VMM.getJSON(the_url, function(d) {
					VMM.attachElement("#"+id, d.html );
				});
			},
			
		},
		
		// VMM.ExternalAPI.youtube.init(id);
		youtube: {
			init: function(id) {
				
				if (VMM.master_config.youtube.active) {
					VMM.master_config.youtube.createPlayer(id);
				} else {
					
					VMM.master_config.youtube.que.push(id);
					
					if (VMM.master_config.youtube.api_loaded) {
						
					} else {
						
						VMM.LoadLib.js('http://www.youtube.com/player_api', function() {
							trace("YouTube API Library Loaded");
						});
					}
					
				}
			},
			
			onAPIReady: function() {
				trace("YOUTUBE API READY")
				VMM.master_config.youtube.active = true;
				
				for(var i = 0; i < VMM.master_config.youtube.que.length; i++) {
					VMM.ExternalAPI.youtube.createPlayer(VMM.master_config.youtube.que[i]);
				}
			},
			// VMM.ExternalAPI.youtube.createPlayer(id);
			createPlayer: function(id) {
				var p = {
					active:false,
					player: {},
					name:'youtube_'+id,
					playing:false
				};
				
				p.player['youtube_'+id] = new YT.Player('youtube_'+id, {
					height: '390',
					width: '640',
					playerVars: {
						enablejsapi:1,
						color: 'white',
						showinfo:0,
						theme: 'light',
						rel:0,
						origin:'http://timeline.verite.co'
					},
					videoId: id,
					events: {
						'onReady': VMM.ExternalAPI.youtube.onPlayerReady,
						'onStateChange': VMM.ExternalAPI.youtube.onStateChange
					}
				});
				
				VMM.master_config.youtube.array.push(p);
			},
			
			//VMM.ExternalAPI.youtube.stopPlayers();
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