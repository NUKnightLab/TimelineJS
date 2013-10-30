/* Romansh / Rumantsch LANGUAGE
================================================== */
if(typeof VMM != 'undefined') {
    VMM.Language = {
        lang: "rm",
        api: {
            wikipedia: "rm"
        },
        date: {
            month: ["Schaner", "Favrer", "Mars", "Avrigl", "Matg", "Zercladur", "Fanadur", "Avust", "Settember", "October", "November", "December"],
            month_abbr: ["Schan.", "Favr.", "Mars", "Avr.", "Matg", "Zercl.", "Fan.", "Avust", "Sett.", "Oct.", "Nov.", "Dec."],
            day: ["Dumengia","Glindesdi", "Mardi", "Mesemna", "Gievgia", "Venderdi", "Sonda"],
            day_abbr: ["Du","Gli", "Ma", "Me", "Gie", "Ve", "So"]
        },
        dateformats: {
            year: "yyyy",
            month_short: "mmm",
            month: "mmmm yyyy",
            full_short: "d 'da' mmm",
            full: "d 'da' mmmm yyyy",
            time_short: "HH:M:s",
            time_no_seconds_short: "HH:M",
            time_no_seconds_small_date: "HH:M'<br/><small>'d 'da' mmmm yyyy'</small>'",
            full_long: "d 'da' mmm yyyy', las' HH:M",
            full_long_small_date: "HH:M'<br/><small>d 'da' mmm yyyy'</small>'"
        },
        messages: {
            loading_timeline: "Chargiar la cronologia... ",
            return_to_title: "Turnar al titel",
            expand_timeline: "Expander la cronologia",
            contract_timeline: "Contract Timeline",
            wikipedia: "Da Vichipedia, l'enciclopedia libra",
            loading_content: "Chargiar il cuntegn",
            loading: "Chargiar"
        }
    }
}