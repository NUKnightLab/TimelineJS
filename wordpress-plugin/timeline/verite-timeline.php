<?php
/*
Plugin Name: Verite Timeline Plugin
Plugin URI: http://timeline.verite.co/
Description: Add Verite Timelines to your WordPress posts using the shortcode [verite-timeline].
Version: 0.1
Author: Zach Wise, Jeremy Rue
Author URI: http://timeline.verite.co/
License: GNU


This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

http://www.gnu.org/licenses/

Map tiles by [Stamen Design](http://stamen.com "Stamen Design"), under [CC BY 3.0](http://creativecommons.org/licenses/by/3.0 "CC BY 3.0"). 
Data by [OpenStreetMap](http://openstreetmap.org "OpenStreetMap"), under [CC BY SA](http://creativecommons.org/licenses/by-sa/3.0 "CC BY SA").
*/

class VeriteTimelinePlugin{

	function VeriteTimelinePlugin(){
		
		//add scripts if shortcode exists in a post
		add_action( 'wp_head', array(__CLASS__, 'detectVeriteShortCodes'), 0);
		
		//adds the shortcode [verite-timeline] to WordPress hook
		add_shortcode('verite-timeline', array(__CLASS__, 'addVeriteShortCode'));
	}
	
	function addVeriteShortCode($atts){
			
		//extract the URL to json from the shortcode attribute
		extract( shortcode_atts( array('url' => null), $atts ));
		
		// HELP ME OUT HERE, I KNOW NOTHING ABOUT PHP-ZW
		//extract the height from the shortcode attribute
		//extract( shortcode_atts( array('height' => null), $atts ));
		
		if($url) $verite_json_uri = $url;
		//if($height) $verite_height = $height;
		//if($width) $verite_width = $width;
		//if($js) $verite_js = $js;
		//if($css) $verite_css = $css;
		
		//write to the DOM

		return "
			<!-- BEGIN Timeline Embed -->
			<div id=\"timeline-embed\"></div>
			<script type=\"text/javascript\">// <![CDATA[
				var timeline_config = {
					width: \"100%\",
					height: \"650px\",
					source: \"". $verite_json_uri ."\"
				}
			// ]]></script>
			<script type=\"text/javascript\" src=\"http://veritetimeline.appspot.com/latest/timeline-embed.js\"></script>
			<!-- END Timeline Embed -->
		";
	}
	
	function detectVeriteShortCodes(){
		global $post;
		
		//if there is a shortcode in the post...
		$verite_shortcode_exists = stripos($post->post_content, '[verite-timeline');
		
		//load in scripts
		if($verite_shortcode_exists || $verite_shortcode_exists === 0){
			
			//take out any existing versions of jquery to use our own
			//wp_dequeue_script( 'jquery' );
			//wp_deregister_script( 'jquery' );
			
			//register our scripts and styles
			//wp_register_script( 'jquery', plugins_url('/jquery-min.js', __FILE__) );
			//wp_register_script( 'verite_script', plugins_url('/timeline-min.js', __FILE__), array('jquery'), '0.5', false );
			//wp_register_style( 'verite_styles', plugins_url('/timeline.css', __FILE__), false, '0.5', 'all');
			
			//load them into the DOM
			//wp_enqueue_script('jquery');
			//wp_enqueue_script('verite_script');
			//wp_enqueue_style('verite_styles');
			
		}
	}	
}

function VeriteTimelinePluginInit(){ 
	global $veriteTimelineInstance; 
	$veriteTimelineInstance = new VeriteTimelinePlugin();
}

add_action('init', 'VeriteTimelinePluginInit');