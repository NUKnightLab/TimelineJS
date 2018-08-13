/* Finnish LANGUAGE
================================================== */
if(typeof VMM != 'undefined') {
	VMM.Language = {
		lang: "fi",
		api: {
			wikipedia: "fi"
		},
		date: {
			month: ["tammikuuta", "helmikuuta", "maaliskuuta", "huhtikuuta", "toukokuuta", "kesäkuuta", "heinäkuuta", "elokuuta", "syyskuuta", "lokakuuta", "marraskuuta", "joulukuuta"],
			month_abbr: ["tammi", "helmi", "maalis", "huhti", "touko", "kesä", "heinä", "elo", "syys", "loka", "marras", "joulu"],
			day: ["sunnuntai","maanantai", "tiistai", "keskiviikko", "torstai", "perjantai", "lauauntai"],
			day_abbr: ["su","ma", "ti", "ke", "to", "pe", "la"]
		}, 
		dateformats: {
			year: "yyyy",
			month_short: "mmm",
			month: "mmmm yyyy",
			full_short: "d. mmm",
			full: "d. mmmm yyyy",
			time_short: "HH:MM:ss",
			time_no_seconds_short: "HH:MM",
			time_no_seconds_small_date: "HH:MM'<br/><small>'d. mmmm yyyy'</small>'",
			full_long: "mmm d yyyy 'klo' HH:MM",
			full_long_small_date: "HH:MM'<br/><small>d. mmm yyyy'</small>'"
		},
		messages: {
			loading_timeline: "Ladataan aikajanaa… ",
			return_to_title: "Takaisin etusivulle",
			expand_timeline: "Laajenna aikajanaa",
			contract_timeline: "Tiivistä aikajanaa",
			wikipedia: "Wikipediasta",
			loading_content: "Ladataan sisältöä",
			loading: "Ladataan",
			swipe_nav: "Swipe to Navigate"		}
	}
}