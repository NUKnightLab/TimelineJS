/* Czech LANGUAGE 
================================================== */
if(typeof VMM != 'undefined') {
	VMM.Language = {
		lang: "cz",
		api: {
			wikipedia: "cs"
		},
		date: {
			month: ["ledna", "února", "března", "dubna", "května", "června", "července", "srpna", "září", "října", "listopadu", "prosince"],
			month_abbr: ["Led", "Úno", "Bře", "Dub", "Kvě", "Čen", "Čec", "Srp", "Zář", "Říj", "Lis", "Pro"],
			day: ["neděle","pondělí", "úterý", "středa", "čtvrtek", "pátek", "sobota"],
			day_abbr: ["Ne","Po", "Út", "St", "Čt", "Pá", "So"]
		}, 
		dateformats: {
			year: "yyyy",
			month_short: "mmm",
			month: "mmmm yyyy",
			full_short: "d. mmm ",
			full: "d. mmmm yyyy",
			time_short: "HH:MM:ss",
			time_no_seconds_short: "HH:MM",
			time_no_seconds_small_date: "HH:MM'<br/><small>'d. mmmm yyyy'</small>'",
			full_long: "dddd d. mmm yyyy 'v' HH:MM",
			full_long_small_date: "HH:MM'<br/><small>dddd d. mmm yyyy'</small>'"
		},
		messages: {
			loading_timeline: "Načítám časovou osu... ",
			return_to_title: "Zpět na začátek",
			expand_timeline: "Rozbalit časovou osu",
			contract_timeline: "Sbalit časovou osu",
			wikipedia: "Zdroj: otevřená encyklopedie Wikipedia",
			loading_content: "Nahrávám obsah",
			loading: "Nahrávám",
			swipe_nav: "Swipe to Navigate"		}
	}
}
