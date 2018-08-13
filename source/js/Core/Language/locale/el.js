/* Greek LANGUAGE 
================================================== */
if(typeof VMM != 'undefined') {
	VMM.Language = {
		lang: "en",
		api: {
			wikipedia: "en"
		},
		date: {
			month: ["Ιανουάριος", "Φεβρουάριος", "Μάρτιος", "Απρίλιος", "Μάιος", "Ιούνιος", "Ιούλιος", "Αύγουστος", "Σεπτέμβριος", "Οκτώβριος", "Νοέμβριος", "Δεκέμβριος"],
			month_abbr: ["Ιαν.", "Φεβ.", "Μαρ.", "Απρ.", "Μαη", "Ιουν.", "Ιουλ.", "Αύγ.", "Σεπτ.", "Οκτ.", "Νοεμ.", "Δεκ."],
			day: ["Κυριακή","Δευτέρα", "Τρίτη", "Τετάρτη", "Πέμπτη", "Παρασκευή", "Σάββατο"],
			day_abbr: ["Κυρ.","Δευ.", "Τρίτη.", "Τετ.", "Πεμπ.", "Παρ.", "Σαβ."]
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
			loading_timeline: "Φόρτωση Timeline... ",
			return_to_title: "Επιστροφή στον Τίτλο",
			expand_timeline: "Μεγέθυνση",
			contract_timeline: "Contract Timeline",
			wikipedia: "From Wikipedia, the free encyclopedia",
			loading_content: "Φόρτωση Περιεχομένου",
			loading: "Γίνεται Φόρτωση",
			swipe_nav: "Swipe to Navigate"		}
	}
}