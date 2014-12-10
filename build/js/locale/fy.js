/* Frisian LANGUAGE 
================================================== */
if(typeof VMM != 'undefined') {
	VMM.Language = {
		lang: "fy",
		api: {
			wikipedia: "fy"
		},
		date: {
			month: ["Jannewaris", "Febrewaris", "Maart", "April", "Maaie", "Juny", "July", "Augustus", "Septimber", "Oktober", "Novimber", "Desimber"],
			month_abbr: ["Jan.", "Feb.", "Mar", "Apr", "Maaie", "July", "July", "Aug.", "Sept.", "Okt.", "Nov.", "Des."],
			day: ["Snein","Moandei", "Tiisdei", "Woansdei", "Tongersdei", "Freed", "Sneon"],
			day_abbr: ["Snein","Moandei", "Tiisdei", "Woansdei", "Tongersdei", "Freed", "Sneon"]
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
			full_long: "dddd',' d mmm yyyy 'om' HH:MM",
			full_long_small_date: "HH:MM'<br/><small>'dddd',' d mmm yyyy'</small>'"
		},
		messages: {
			loading_timeline: "Tiidline ynlade ... ",
			return_to_title: "Wer werom nei it begjin",
			expand_timeline: "Tiidline útzoomen",
			contract_timeline: "Tiidline ynzoomen",
			wikipedia: "Fan Wikipedia, de frije ensyklopedy",
			loading_content: "Ynhâld ynlade",
			loading: "Ynlade"
		}
	}
}