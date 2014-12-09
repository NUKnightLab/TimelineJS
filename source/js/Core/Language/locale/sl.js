/* Slovenian LANGUAGE SLOVENIAN
================================================== */
if (typeof VMM != 'undefined') {
	VMM.Language = {
		lang: "sl",
		api: {
			wikipedia: "sl"
		},
		date: {
			month: ["januar", "februar", "marec", "april", "maj", "junij", "julij", "avgust", "september", "oktober", "november", "december"],
			month_abbr: ["jan.", "feb.", "marec", "april", "maj", "junij", "july", "avg.", "sept.", "okt.", "nov.", "dec."],
			day: ["nedelja", "ponedeljek", "torek", "sreda", "čertek", "petek", "sobota"],
			day_abbr: ["ned.", "pon.", "tor.", "sre.", "čet.", "pet.", "sob."]
		},
		dateformats: {
			year: "yyyy",
			month_short: "mmm",
			month: "mmmm yyyy",
			full_short: "d mmm",
			full: "d mmmm yyyy",
			time_short: "h:MM:ss TT",
			time_no_seconds_short: "h:MM",
			time_no_seconds_small_date: "h:MM' 'd mmmm' 'yyyy",
			full_long: "d mmm yyyy 'ob' hh:MM",
			full_long_small_date: "hh:MM' d mmm yyyy"
		},
		messages: {
			loading_timeline: "Nalagam časovni trak... ",
			return_to_title: "Nazaj na naslov",
			expand_timeline: "Razširi časovni trak",
			contract_timeline: "Pokrči časovni trak",
			wikipedia: "Vir Wikipedija",
			loading_content: "Nalaganje vsebine",
			loading: "Nalaganje",
			swipe_nav: "Swipe to Navigate"		}
	}
}
