// @codekit-append "VMM.Timeline.js";
/* LANGUAGE 
================================================== */
if(typeof VMM != 'undefined' && typeof VMM.Language == 'undefined') {
	VMM.Language = {
		date: {
			month: ["janvier", "février", "mars", "avril", "mai", "juin", "juillet", "août", "septembre", "octobre", "novembre", "décembre"],
			month_abbr: ["janv.", "févr.", "mars", "avril", "mai", "juin", "juil.", "août", "sept.", "oct.", "nov.", "dec."],
			day: ["dimanche","lundi", "mardi", "mercredi", "jeudi", "vendredi", "samedi"],
			day_abbr: ["dim.","lu.", "ma.", "me.", "jeu.", "vend.", "sam."],
		}, 
		dateformats: {
			year: "yyyy",
			month_short: "mmm",
			month: "mmmm yyyy",
			full_short: "d mmm",
			full: "d mmmm yyyy",
			time_no_seconds_short: "HH:MM",
			time_no_seconds_small_date: "HH:MM'<br/><small>'d mmmm yyyy'</small>'",
			full_long: "dddd',' d mmm yyyy 'um' HH:MM",
			full_long_small_date: "HH:MM'<br/><small>'dddd',' d mmm yyyy'</small>'",
		},
		messages: {
			loading_timeline: "Loading Timeline... ",
			return_to_title: "Return to Title",
			expand_timeline: "Expand Timeline",
			contract_timeline: "Contract Timeline"
		}
	}
}
