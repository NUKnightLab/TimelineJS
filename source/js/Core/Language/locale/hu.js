/* Hungarian LANGUAGE 
================================================== */
if(typeof VMM != 'undefined') {
	VMM.Language = {
		lang: "hu",
		api: {
			wikipedia: "hu"
		},
		date: {
			month: ["január", "február", "március", "április", "május", "június", "július", "augusztus", "szeptember", "október", "november", "december"],
			month_abbr: ["jan.", "febr.", "márc.", "ápr.", "máj.", "jún.", "júl.", "aug.", "szept.", "okt.", "nov.", "dec."],
			day: ["vasárnap","hétfő", "kedd", "szerda", "csütörtök", "péntek", "szombat"],
			day_abbr: ["vas.","hétfő", "kedd", "szer.", "csüt.", "pén.", "szom."]
		}, 
		dateformats: {
			year: "yyyy",
			month_short: "mmm",
			month: "yyyy. mmmm",
			full_short: "mmm d.",
			full: "yyyy. mmmm d.",
			time_short: "HH:MM:ss",
			time_no_seconds_short: "HH:MM",
			time_no_seconds_small_date: "HH:MM '<br/><small>'yyyy. mmmm d.'</small>'",
			full_long: "yyyy. mmm d.',' HH:MM",
			full_long_small_date: "HH:MM '<br/><small>yyyy. mmm d.'</small>'"
		},
		messages: {
			loading_timeline: "Az idővonal betöltése... ",
			return_to_title: "Vissza a címhez",
			expand_timeline: "Nagyítás",
			contract_timeline: "Kicsinyítés",
			wikipedia: "A Wikipédiából, a szabad enciklopédiából",
			loading_content: "Tartalom betöltése",
			loading: "Betöltés",
			swipe_nav: "Swipe to Navigate"		}
	}
}