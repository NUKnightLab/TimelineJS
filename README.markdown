# Timeline 
## Document history with Timeline

There are lots of timeline tools on the web but they are almost all either
hard on the eyes or hard to use. Create timelines that are at the same time
beautiful and intuitive for users

Timeline is great for pulling in media from different sources. Just throw in a
link from Twitter, YouTube, Flickr, Vimeo, Google Maps or SoundCloud and
Timeline will format it to fit perfectly. More media types will be supported
in the future.

Creating one is as easy as filling in a Google spreadsheet or as detailed as
JSON.

## Add it to your site

### Step 1

Include these lines in the `<head>` of your site.

	`<!-- CSS -->
	<link href="timeline.css" rel="stylesheet">

	<!-- JavaScript -->
	<script type="text/javascript" src="jquery-min.js"></script>
	<script type="text/javascript" src="timeline-min.js"></script>`

### Step 2

Add a `<div>` with an id called “timeline” in the `<body>` of your site.

`<div id="timeline"></div>`

### Step 3

Initialize the data source in either the `<head>` or the `<body>`
`	<script>
		$(document).ready(function() {
			timeline = new VMM.Timeline();
			timeline.init("your_data.json");
		});
	</script>`

## File Formats

### JSON:

JSON is the native data format for Timeline. It is easy enough for “normals”
to use but powerful enough for real nerds to get excited about.

The thing about JSON is it is picky. A misplaced comma or quotation mark can
prevent the timeline from loading properly. Instructions on actually using the
JSON file are included in the example data.JSON file.

### Google Docs:

If you don’t want to mess with JSON, fire up Google Docs and build your
timeline in a spreadsheet. It’s as simple as dropping a date, text, and links
into the appropriate columns in Timeline’s template.

You can find the template here: [https://docs.google.com/a/digitalartwork.net/previewtemplate?id=0AppSVxABhnltdEhzQjQ4MlpOaldjTmZLclQxQWFTOUE&mode=public](https://docs.google.com/a/digitalartwork.net/previewtemplate?id=0AppSVxABhnltdEhzQjQ4MlpOaldjTmZLclQxQWFTOUE&mode=public)

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

  3. Copy/paste the Web URL into your Timeline HTML file  
After you publish the spreadsheet, Google Docs will generate a link to the
file. Copy the link for the Web Page option (as opposed to PDF, HTML, XLS,
etc.), then paste it into the timeline’s HTML file:

  
`timeline.init(“URL goes here”)`

  4. Designate the “start” slide  
This indicates which event is the title slide, the one that begins the
timeline.

  
Only one should be labeled "start" (generally, the first one). The title slide
must have a start date, headline and text to appear properly.

## Media

Included in the zip file is a kitchen sink example. This timeline shows how to
incorporate the different media types from different services like Twitter,
YouTube, Flickr, SoundCloud and Vimeo.

Twitter: Just copy and paste the address of the tweet from the browser bar
into the media parameter. Timeline will auto-magically pull in the tweet and
format it so that it looks beautiful.

For Flickr, SoundCloud, YouTube, and Vimeo just copy the URL and paste it into
the media parameter.

## Best practices

Tips and tricks to best utilize Timeline

  1. Keep it light - don’t get bogged down by text or other elements
  2. Pick stories that have a strong chronological narrative. It does not work well for stories that need to jump around in the timeline.
  3. Include events that build up to major occurrences, not just the major events.
