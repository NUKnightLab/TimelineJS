<html>

<head>
	<link href="./timeline.css" rel="stylesheet">
	<script type="text/javascript" src="./jquery-min.js"></script>
	<script type="text/javascript" src="./timeline.js"></script>
	
	<meta property="og:title" content="Timeline" />
	<meta property="og:description" content="Using JSONP to dynamically build timelines from topic archives. In this case, for football." />
	<meta property="og:image" content="http://i.imgur.com/cokYj.png" />
	
</head>

<body>
	<div id="timeline"></div>
</body>

<script>

map = {"query":""};
try {
	window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
			map[key] = value;
	});
} catch (e) {
	console.log("error grabbing something from the url Get string...");
}

var jsonSkeleton = {
    "timeline":
    {
        "headline":map.headline,
        "type":"default",
		"startDate":"2012",
		"text":map.text,
        "date": []
    }
}

function jsonpcallback(data) {
	console.log(data);
	
	data.forEach(function(story) {
		var storyJSON = {};
		
		if (typeof story.thumbnail != 'undefined') {
			storyJSON.asset = {};
			storyJSON.asset.media = story.thumbnail;
			storyJSON.asset.credit = "Oregon Daily Emerald"
			storyJSON.asset.caption = "";
		}

		var dateArray = story.date.split(" ")[0];
		dateArray = dateArray.split("-");
		storyJSON.startDate = dateArray[0]+","+dateArray[1]+","+dateArray[2];
		storyJSON.endDate = storyJSON.startDate;

		storyJSON.headline = story.title;

		storyJSON.text = "<p><a href=\""+story.permalink+"\">"+story.excerpt+"</a></p>";

		jsonSkeleton.timeline.date.push(storyJSON);

		console.log(dateArray);
		console.log(story);
		console.log(storyJSON);
		console.log("-------");
	});
	
	console.log(jsonSkeleton);
	
	var timeline = new VMM.Timeline();
	timeline.init(jsonSkeleton);
	
}

$(document).ready(function() {

	$.ajax({
		url: "http://dailyemerald.com/"+map.query+"json/?callback=jsonpcallback",
		dataType: "script",
		callback: "jsonpcallback"
	});

});
</script>

</html>