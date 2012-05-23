# TimelineJS 
## Document history with TimelineJS

There are lots of timeline tools on the web but they are almost all either
hard on the eyes or hard to use. Create timelines that are at the same time
beautiful and intuitive for users

TimelineJS is great for pulling in media from different sources. Just throw in a
link from Twitter, YouTube, Flickr, Vimeo, Google Maps or SoundCloud and
TimelineJS will format it to fit perfectly. More media types will be supported
in the future.

Creating one is as easy as filling in a Google spreadsheet or as detailed as
JSON.

## Add it to your site

Place the embed code where you want the timeline to show in the `<body>` of your site.

```html
	<div id="timeline-embed"></div>
	<script type="text/javascript">
	    var timeline_config = {
			width:			"100%",
			height:			"100%",
			source:			'path_to_json/or_link_to_googlespreadsheet',
			start_at_end: 	false,							//OPTIONAL START AT LATEST DATE
			hash_bookmark:	true,							//OPTIONAL LOCATION BAR HASHES
			font:			'Bevan-PotanoSans',				//OPTIONAL FONT
			lang:			'fr',							//OPTIONAL LANGUAGE
			maptype:		'watercolor',					//OPTIONAL MAP STYLE
			css:			'path_to_css/timeline.css',		//OPTIONAL PATH TO CSS
			js:				'path_to_js/timeline-min.js'	//OPTIONAL PATH TO JS
		}
	</script>
	<script type="text/javascript" src="path_to_js/timeline-embed.js"></script>
```
	
## Options

###Language
`lang`
Localization
*default is en*
Languages available:
* `en` *English*
* `fr` *Français*
* `es` *Español*
* `de` *Deutsch*
* `is` *Icelandic*
* `it` *Italiano*
* `nl` *Nederlands*
* `kr` *월요일*
* `pt-br` *Português Brazil *
* `ja` *日本語*
* `zh-ch` *中文*
* `zh-tw` *Taiwanese Mandarin*
Help us add more. Grab a copy of a language file and replace it with your language [Example language file](https://github.com/VeriteCo/Timeline/blob/master/source/js/locale/en.js) 

###Start at End 
`start_at_end`
set to true to start the timeline on the last date.
*default is false*
	
###Hash Bookmark 
`hash_bookmark`
set to true to allow bookmarking slides using the hash tag
*default is false*

###Map Style Types 
`maptype:`
* [Stamen Maps ](maps.stamen.com)
	* `toner`
	* `toner-lines`
	* `toner-labels`
	* `watercolor`
	* `sterrain`
		
* Google Maps
	* `ROADMAP`
	* `TERRAIN`
	* `HYBRID`
	* `SATELLITE`

###Font Options 
`font:`
* `Arvo-PTSans`
* `Merriweather-NewsCycle`
* `PoiretOne-Molengo`
* `PTSerif-PTSans`
* `DroidSerif-DroidSans`
* `Lekton-Molengo`
* `NixieOne-Ledger`
* `AbrilFatface-Average`
* `PlayfairDisplay-Muli`
* `Rancho-Gudea`
* `Bevan-PotanoSans`
* `BreeSerif-OpenSans`
* `SansitaOne-Kameron`
* `Pacifico-Arimo`
* Or make your own 

## File Formats

### JSON:

JSON is the native data format for TimelineJS. It is easy enough for “normals”
to use but powerful enough for real nerds to get excited about.

The thing about JSON is it is picky. A misplaced comma or quotation mark can
prevent the timeline from loading properly. Instructions on actually using the
JSON file are included in the example data.JSON file.

### Google Docs:

If you don’t want to mess with JSON, fire up Google Docs and build your
timeline in a spreadsheet. It’s as simple as dropping a date, text, and links
into the appropriate columns in TimelineJS’s template.

You can find the template here: [TimelineJS Google Spreadsheet Template](https://docs.google.com/a/digitalartwork.net/previewtemplate?id=0AppSVxABhnltdEhzQjQ4MlpOaldjTmZLclQxQWFTOUE&mode=public)

There are only four things you need to know in order to create a timeline
using Google Docs:

  1. Make the spreadsheet public:   
	Google Docs are automatically set to private but the spreadsheet must be
	public.

  
	Click the blue “Share” button on the top right-hand corner. In the “Share
	settings” window, you’ll see the private setting of the spreadsheet: click
	“Change...”. In the Visibility options window, choose “Public on the Web” and
	save.

  2. Publish to the Web  
	Under the File menu, select “Publish to the Web.”

  
	In the next window, check the box next to “Automatically republish when
	changes are made.” Uncheck all other boxes. Click “start publishing.” This
	will give you the URL to embed in your HTML file.

  3. Copy/paste the Web URL into your TimelineJS HTML file  
	After you publish the spreadsheet, Google Docs will generate a link to the
	file. Copy the link for the Web Page option (as opposed to PDF, HTML, XLS,
	etc.), then paste it into the timeline’s HTML file:

  
	`timeline.init(“URL goes here”)`

  4. Designate the “start” slide  
	This indicates which event is the title slide, the one that begins the
	timeline.

  
	Only one should be labeled "start" (generally, the first one). The title slide
	must have a start date, headline and text to appear properly.
	
### Storify:

Support for Storify is still in it's early stages. It works though. Just paste a link to the storify story as the source.

## Media

Included in the zip file is a kitchen sink example. This timeline shows how to
incorporate the different media types from different services like Twitter,
YouTube, Flickr, SoundCloud and Vimeo.

Twitter: Just copy and paste the address of the tweet from the browser bar
into the media parameter. TimelineJS will auto-magically pull in the tweet and
format it so that it looks beautiful.

For Flickr, SoundCloud, YouTube, and Vimeo just copy the URL and paste it into
the media parameter.

## Best practices

Tips and tricks to best utilize TimelineJS

  1. Keep it light - don’t get bogged down by text or other elements
  2. Pick stories that have a strong chronological narrative. It does not work well for stories that need to jump around in the timeline.
  3. Include events that build up to major occurrences, not just the major events.
