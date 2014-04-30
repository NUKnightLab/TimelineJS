/* Romanian LANGUAGE 
================================================== */
if(typeof VMM != 'undefined') {
	VMM.Language = {
		lang: "ro",
		api: {
			wikipedia: "ro"
		},
		date: {
			month: ["ianuarie", "februarie", "martie", "aprilie", "mai", "iunie", "iulie", "august", "septembrie", "octombrie", "noiembrie", "decembrie"],
			month_abbr: ["ian.", "feb.", "mar.", "apr.", "mai", "iunie", "iulie", "aug.", "sept.", "oct.", "noi.", "dec."],
			day: ["duminică","luni", "marți", "miercuri", "joi", "vineri", "sâmbătă"],
			day_abbr: ["dum.","luni", "marți", "mie.", "joi", "vin.", "sâm."]
		}, 
		dateformats: {
			year: "yyyy",
		    month_short: "mmm",
		    month: "mmmm yyyy",
		    full_short: "d mmm",
		    full: "d mmmm yyyy",
			time_short: "HH:MM:SS",
		    time_no_seconds_short: "HH:MM",
		    time_no_seconds_small_date: "HH:MM'<br/><small>'d mmmm yyyy'</small>'",
		    full_long: "dddd',' d mmm yyyy 'ora' HH:MM",
		    full_long_small_date: "HH:MM'<br/><small>'dddd',' d mmm yyyy'</small>'"
		},
		messages: {
			loading_timeline: "Cronologia se încarcă... ",
			return_to_title: "Înapoi la prima pagină",
			expand_timeline: "Mărește cronologia",
			contract_timeline: "Micșorează cronologia",
			wikipedia: "De la Wikipedia, enciclopedia liberă",
			loading_content: "Se încarcă",
			loading: "Se încarcă"
		}
	}
}
