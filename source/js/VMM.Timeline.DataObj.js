/* 	TIMELINE SOURCE DATA PROCESSOR
================================================== */

if(typeof VMM.Timeline != 'undefined' && typeof VMM.Timeline.DataObj == 'undefined') {
	
	VMM.Timeline.DataObj = {
		
		data_obj: {},
		
		model_array: [],
		
		getData: function(raw_data) {
			
			data = VMM.Timeline.DataObj.data_obj;

			if (type.of(raw_data) == "object") {
				trace("DATA SOURCE: JSON OBJECT");
				VMM.Timeline.DataObj.parseJSON(raw_data);
			} else if (type.of(raw_data) == "string") {
				if (raw_data.match("%23")) {
					trace("DATA SOURCE: TWITTER SEARCH");
					VMM.Timeline.DataObj.model_Tweets.getData("%23medill");
					
				} else if (	raw_data.match("spreadsheet")	) {
					VMM.fireEvent(global, "MESSEGE", "Loading Data");
					trace("DATA SOURCE: GOOGLE SPREADSHEET");
					VMM.Timeline.DataObj.model_GoogleSpreadsheet.getData(raw_data);
					
				} else {
					VMM.fireEvent(global, "MESSEGE", "Loading Data");
					trace("DATA SOURCE: JSON");
					VMM.getJSON(raw_data, VMM.Timeline.DataObj.parseJSON);
				}
			} else if (type.of(raw_data) == "html") {
				trace("DATA SOURCE: HTML");
				VMM.Timeline.DataObj.parseHTML(raw_data);
			} else {
				trace("DATA SOURCE: UNKNOWN");
			}
			
		},
		
		parseHTML: function(d) {
			trace("parseHTML");
			trace("WARNING: THIS IS STILL ALPHA AND WILL NOT WORK WITH ID's other than #timeline");
			var _data_obj = VMM.Timeline.DataObj.data_template_obj;
			
			/*	Timeline start slide
			================================================== */
			if (VMM.Element.find("#timeline section", "time")[0]) {
				_data_obj.timeline.startDate = VMM.Element.html(VMM.Element.find("#timeline section", "time")[0]);
				_data_obj.timeline.headline = VMM.Element.html(VMM.Element.find("#timeline section", "h2"));
				_data_obj.timeline.text = VMM.Element.html(VMM.Element.find("#timeline section", "article"));
				
				var found_main_media = false;
				
				if (VMM.Element.find("#timeline section", "figure img").length != 0) {
					found_main_media = true;
					_data_obj.timeline.asset.media = VMM.Element.attr(VMM.Element.find("#timeline section", "figure img"), "src");
				} else if (VMM.Element.find("#timeline section", "figure a").length != 0) {
					found_main_media = true;
					_data_obj.timeline.asset.media = VMM.Element.attr(VMM.Element.find("#timeline section", "figure a"), "href");
				} else {
					//trace("NOT FOUND");
				}

				if (found_main_media) {
					if (VMM.Element.find("#timeline section", "cite").length != 0) {
						_data_obj.timeline.asset.credit = VMM.Element.html(VMM.Element.find("#timeline section", "cite"));
					}
					if (VMM.Element.find(this, "figcaption").length != 0) {
						_data_obj.timeline.asset.caption = VMM.Element.html(VMM.Element.find("#timeline section", "figcaption"));
					}
				}
			}
			
			/*	Timeline Date Slides
			================================================== */
			VMM.Element.each("#timeline li", function(i, elem){
				
				var valid_date = false;
				
				var _date = {
					"type":"default",
					"startDate":"",
		            "headline":"",
		            "text":"",
		            "asset":
		            {
		                "media":"",
		                "credit":"",
		                "caption":""
		            },
		            "tags":"Optional"
				};
				
				if (VMM.Element.find(this, "time") != 0) {
					
					valid_date = true;
					
					_date.startDate = VMM.Element.html(VMM.Element.find(this, "time")[0]);

					if (VMM.Element.find(this, "time")[1]) {
						_date.endDate = VMM.Element.html(VMM.Element.find(this, "time")[0]);
					}

					_date.headline = VMM.Element.html(VMM.Element.find(this, "h3"));

					_date.text = VMM.Element.html(VMM.Element.find(this, "article"));

					var found_media = false;
					if (VMM.Element.find(this, "figure img").length != 0) {
						found_media = true;
						_date.asset.media = VMM.Element.attr(VMM.Element.find(this, "figure img"), "src");
					} else if (VMM.Element.find(this, "figure a").length != 0) {
						found_media = true;
						_date.asset.media = VMM.Element.attr(VMM.Element.find(this, "figure a"), "href");
					} else {
						//trace("NOT FOUND");
					}

					if (found_media) {
						if (VMM.Element.find(this, "cite").length != 0) {
							_date.asset.credit = VMM.Element.html(VMM.Element.find(this, "cite"));
						}
						if (VMM.Element.find(this, "figcaption").length != 0) {
							_date.asset.caption = VMM.Element.html(VMM.Element.find(this, "figcaption"));
						}
					}
					
					trace(_date);
					_data_obj.timeline.date.push(_date);
					
				}
				
			});
			
			VMM.fireEvent(global, "DATAREADY", _data_obj);
			
		},
		
		parseJSON: function(d) {
			if (d.timeline.type == "default") {
				
				trace("DATA SOURCE: JSON STANDARD TIMELINE");
				VMM.fireEvent(global, "DATAREADY", d);
				
			} else if (d.timeline.type == "twitter") {
				
				trace("DATA SOURCE: JSON TWEETS");
				VMM.Timeline.DataObj.model_Tweets.buildData(d);
				
			} else {
				
				trace("DATA SOURCE: UNKNOWN JSON");
				trace(type.of(d.timeline));
				
			};
		},
		
		/*	MODEL OBJECTS 
			New Types of Data can be formatted for the timeline here
		================================================== */
		
		model_Tweets: {
			
			type: "twitter",
			
			buildData: function(raw_data) {
				VMM.bindEvent(global, VMM.Timeline.DataObj.model_Tweets.onTwitterDataReady, "TWEETSLOADED");
				VMM.ExternalAPI.twitter.getTweets(raw_data.timeline.tweets);
			},
			
			getData: function(raw_data) {
				VMM.bindEvent(global, VMM.Timeline.DataObj.model_Tweets.onTwitterDataReady, "TWEETSLOADED");
				VMM.ExternalAPI.twitter.getTweetSearch(raw_data);
			},
			
			onTwitterDataReady: function(e, d) {
				var _data_obj = VMM.Timeline.DataObj.data_template_obj;

				for(var i = 0; i < d.tweetdata.length; i++) {

					var _date = {
						"type":"tweets",
						"startDate":"",
			            "headline":"",
			            "text":"",
			            "asset":
			            {
			                "media":"",
			                "credit":"",
			                "caption":""
			            },
			            "tags":"Optional"
					};
					// pass in the 'created_at' string returned from twitter //
					// stamp arrives formatted as Tue Apr 07 22:52:51 +0000 2009 //
					
					//var twit_date = VMM.ExternalAPI.twitter.parseTwitterDate(d.tweetdata[i].raw.created_at);
					//trace(twit_date);
					
					_date.startDate = d.tweetdata[i].raw.created_at;
					
					if (type.of(d.tweetdata[i].raw.from_user_name)) {
						_date.headline = d.tweetdata[i].raw.from_user_name + " (<a href='https://twitter.com/" + d.tweetdata[i].raw.from_user + "'>" + "@" + d.tweetdata[i].raw.from_user + "</a>)" ;						
					} else {
						_date.headline = d.tweetdata[i].raw.user.name + " (<a href='https://twitter.com/" + d.tweetdata[i].raw.user.screen_name + "'>" + "@" + d.tweetdata[i].raw.user.screen_name + "</a>)" ;
					}
					
					_date.asset.media = d.tweetdata[i].content;
					_data_obj.timeline.date.push(_date);
					
				};
				
				VMM.fireEvent(global, "DATAREADY", _data_obj);
			}
		},
		
		model_GoogleSpreadsheet: {
			//	TEMPLATE CAN BE FOUND HERE
			//	https://docs.google.com/previewtemplate?id=0AppSVxABhnltdEhzQjQ4MlpOaldjTmZLclQxQWFTOUE&mode=public
			type: "google spreadsheet",
			
			getData: function(raw_data) {
				
				var _key = VMM.Util.getUrlVars(raw_data)["key"];
				var _url = "https://spreadsheets.google.com/feeds/list/" + _key + "/od6/public/values?alt=json";
				VMM.getJSON(_url, VMM.Timeline.DataObj.model_GoogleSpreadsheet.buildData);
			},
			
			buildData: function(d) {
				VMM.fireEvent(global, "MESSEGE", "Parsing Data");
				var _data_obj = VMM.Timeline.DataObj.data_template_obj;

				for(var i = 0; i < d.feed.entry.length; i++) {
					var dd = d.feed.entry[i];
					
					if (dd.gsx$titleslide.$t.match("start")) {
						_data_obj.timeline.startDate = 			dd.gsx$startdate.$t;
						_data_obj.timeline.headline = 			dd.gsx$headline.$t;
						_data_obj.timeline.asset.media = 		dd.gsx$media.$t;
						_data_obj.timeline.asset.caption = 		dd.gsx$mediacaption.$t;
						_data_obj.timeline.asset.credit = 		dd.gsx$mediacredit.$t;
						_data_obj.timeline.text = 				dd.gsx$text.$t;
						_data_obj.timeline.type = 				"google spreadsheet";
					} else {
						var _date = {
							"type": 							"google spreadsheet",
							"startDate": 						dd.gsx$startdate.$t,
							"endDate": 							dd.gsx$enddate.$t,
				            "headline": 						dd.gsx$headline.$t,
				            "text": 							dd.gsx$text.$t,
				            "asset": {
								"media": 						dd.gsx$media.$t, 
								"credit": 						dd.gsx$mediacredit.$t, 
								"caption": 						dd.gsx$mediacaption.$t 
							},
				            "tags": 							"Optional"
						};
						_data_obj.timeline.date.push(_date);
					}
				};
				
				VMM.fireEvent(global, "DATAREADY", _data_obj);
				
			}
			
		},
		
		/*	TEMPLATE OBJECTS
		================================================== */
		data_template_obj: {  "timeline": { "headline":"", "description":"", "asset": { "media":"", "credit":"", "caption":"" }, "date": [] } },
		date_obj: {"startDate":"2012,2,2,11,30", "headline":"", "text":"", "asset": {"media":"http://youtu.be/vjVfu8-Wp6s", "credit":"", "caption":"" }, "tags":"Optional"}
	
	};
	
}