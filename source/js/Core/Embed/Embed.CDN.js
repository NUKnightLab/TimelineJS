/* Embed.CDN
	Extend the basic 'embed' functionality with Google Analytics tracking and url parsing to support URLs created with the Timeline generator form.
*/  

/* 	CodeKit Import
	http://incident57.com/codekit/
================================================== */
// @codekit-append "Embed.js";

/* REPLACE THIS WITH YOUR GOOGLE ANALYTICS ACCOUNT
================================================== */
var embed_analytics = "UA-537357-20";

/* REPLACE THIS WITH YOUR BASE PATH FOR TIMELINE
================================================== */
//var embed_path = "http://embed.verite.co/timeline/";

/* LOAD TIMER
================================================== */
var load_time_start = new Date().getTime(), the_load_time = 0;

/* GOOGLE ANALYTICS
================================================== */
var _gaq = _gaq || [];


(function() {
	var ga = document.createElement('script'), s = document.getElementsByTagName('script')[0];
	ga.type = 'text/javascript';
	ga.async = true;
	ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
	s.parentNode.insertBefore(ga, s);
	
	_gaq.push(['_setAccount', embed_analytics]);
	_gaq.push(['_trackPageview']);
	
})();

/* TIMELINE CDN SPECIFIC
================================================== */ 
var getUrlVars = function() {
	var varobj = {}, url_vars = [], uv ;
		
	//url_vars = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
	url_vars = window.location.href.slice(window.location.href.indexOf('?') + 1);
	
	if (url_vars.match('#')) {
		url_vars = url_vars.split('#')[0];
	}
	url_vars = url_vars.split('&');
		
	for(var i = 0; i < url_vars.length; i++) {
		uv = url_vars[i].split('=');
		varobj[uv[0]] = uv[1];
	}
		
	return varobj;
};

var onHeadline = function(e, headline) {
	var the_page_title = "/" + headline,
		the_page_url	=	location.href;
	
	document.title = headline;
	the_load_time = Math.floor((new Date().getTime() - load_time_start)/100)/10;
	_gaq.push(['_trackEvent', 'Timeline', headline, the_page_url, the_load_time]);
	
};

var url_config = getUrlVars();


