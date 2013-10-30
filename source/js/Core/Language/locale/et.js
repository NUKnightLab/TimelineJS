/* Estonian LANGUAGE 
================================================== */
if(typeof VMM != 'undefined') {
	VMM.Language = {
		lang: "et",
		api: {
			wikipedia: "et"
		},
		date: {
			month: ["jaanuar", "veebruar", "märts", "aprill", "mai", "juuni", "juuli", "august", "september", "oktoober", "november", "detsember"],
			month_abbr: ["jaan.", "veebr.", "märts", "apr.", "mai", "juuni", "juuli", "aug.", "sept.", "okt.", "nov.", "dets."],
			day: ["pühapäev","esmaspäev", "teisipäev", "kolmapäev", "neljapäev", "reede", "laupäev"],
			day_abbr: ["P","E", "T", "K", "N", "R", "L"]
		}, 
		dateformats: {
			year: "yyyy",
			month_short: "mmm",
			month: "mmmm yyyy",
			full_short: "mmm d",
			full: "mmmm d',' yyyy",
			time_short: "h:MM:ss TT",
			time_no_seconds_short: "h:MM TT",
			time_no_seconds_small_date: "h:MM TT'<br/><small>'mmmm d',' yyyy'</small>'",
			full_long: "mmm d',' yyyy 'at' h:MM TT",
			full_long_small_date: "h:MM TT'<br/><small>mmm d',' yyyy'</small>'"
		},
		messages: {
			loading_timeline: "Laadib ajajoont… ",
			return_to_title: "Tagasi algusse",
			expand_timeline: "Vaata lähemalt",
			contract_timeline: "Vaata kaugemalt",
			wikipedia: "Wikipedia, vaba entsüklopeedia",
			loading_content: "Laadib sisu",
			loading: "Laadib"
		}
	}
}
