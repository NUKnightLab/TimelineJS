/* Esperanto LANGUAGE 
================================================== */
if(typeof VMM != 'undefined') {
	VMM.Language = {
		lang: "eo",
		api: {
			wikipedia: "eo"
		},
		date: {
			month: ["januaro", "februaro", "marto", "aprilo", "majo", "junio", "julio", "aŭgusto", "septembro", "oktobro", "novembro", "decembro"],

			month_abbr: ["jan.", "feb.", "mar.", "apr.", "maj.", "jun.", "jul.", "aŭg.", "sep.", "okt.", "nov.", "dec."],

			day: ["dimanĉo","lundo", "mardo", "merkredo", "ĵaŭdo", "vendredo", "sabato"],

			day_abbr: ["dim.","lun.", "mar.", "mer.", "ĵaŭ.", "ven.", "sab."]
		}, 
		dateformats: {
			year: "yyyy",
		    month_short: "mmm",
		    month: "mmmm yyyy",
		    full_short: "d mmm",
		    full: "d mmmm yyyy",
			time_short: "HH:MM:ss",
		    time_no_seconds_short: "HH:MM",
		    time_no_seconds_small_date: "HH:MM'<br/><small>'d mmmm yyyy'</small>'",
		    full_long: "dddd',' d mmm yyyy 'ĉe' HH:MM",
		    full_long_small_date: "HH:MM'<br/><small>'dddd',' d mmm yyyy'</small>'"
		},
		messages: {
			loading_timeline: "Ŝarĝante Kronologio... ",
			return_to_title: "Reveno al Titolo",
			expand_timeline: "Pliampleksigu Kronologio",
			contract_timeline: "Malpliampleksigu Kronologio",
			wikipedia: "El Vikipedio, la libera enciklopedio",
			loading_content: "Ŝarĝante enhavo",
			loading: "Ŝarĝante",
			swipe_nav: "Swipe to Navigate"		}
	}
}