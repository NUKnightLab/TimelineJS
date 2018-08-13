/* Catalan LANGUAGE 
================================================== */
if(typeof VMM != 'undefined') {
	VMM.Language = {
		lang: "ca",
		api: {
			wikipedia: "ca"
		},
		date: {
			month: ['Gener','Febrer','Març','Abril','Maig','Juny','Juliol','Agost','Setembre','Octubre','Novembre','Desembre'],
			month_abbr: ['Gen','Feb','Mar','Abr','Mai','Jun','Jul','Ago','Set','Oct','Nov','Des'],
			day: ['Diumenge','Dilluns','Dimarts','Dimecres','Dijous','Divendres','Dissabte'],
			day_abbr: ['Dg.','Dl.','Dt.','Dc.','Dj.','Dv.','Ds.']
		}, 
		dateformats: {
			year: "yyyy",
			month_short: "mmm",
			month: "mmmm yyyy",
			full_short: "d mmm",
			full: "d mmmm yyyy",
			time_short: "HH:MM:ss",
			time_no_seconds_short: "HH:MM",
			time_no_seconds_small_date: "'<small>'d mmmm yyyy'</small>' HH:MM",
			full_long: "dddd',' d mmm yyyy HH:MM",
			full_long_small_date: "HH:MM'<br/><small>d mmm yyyy'</small>'"
		},
		messages: {
			loading_timeline: "Carregant cronologia...",
			return_to_title: "Tornar al títol",
			expand_timeline: "Ampliar la cronologia",
			contract_timeline: "Reduir la cronologia",
			wikipedia: "Des de Wikipedia, l'enciclopèdia lliure",
			loading_content: "Carregant contingut",
			loading: "Carregant",
			swipe_nav: "Swipe to Navigate"		}
	}
}