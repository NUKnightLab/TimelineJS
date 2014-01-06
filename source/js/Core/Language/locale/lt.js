/* Lithuanian LANGUAGE 
================================================== */
if(typeof VMM != 'undefined') {
        VMM.Language = {
                lang: "lt",
                api: {
                        wikipedia: "lt"
                },
                date: {
                        month: ["Sausio", "Vasario", "Kovo", "Balandžio", "Gegužės", "Birželio", "Liepos", "Rugpjūčio", "Rugsėjo", "Spalio", "Lapkričio", "Gruodžio"],
                        month_abbr: ["Saus.", "Vas.", "Kov.", "Bal.", "Geg.", "Birž.", "Liep.", "Rugpj.", "Rug.", "Spal.", "Lapkr.", "Gruod."],
                        day: ["Sekmadienis", "Pirmadienis", "Antradienis", "Trečiadienis", "Ketvirtadienis", "Penktadienis", "Šeštadienis"],
                        day_abbr: ["Sek.","Pirm.", "Antr.", "Treč.", "Ketv.", "Penkt.", "Šešt."]
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
                        loading_timeline: "Kraunama laiko juosta... ",
                        return_to_title: "Grįžti į titulinį",
                        expand_timeline: "Išplėsti laiko juostą",
                        contract_timeline: "Sutraukti laiko juostą",
                        wikipedia: "Iš Vikipedijos, laisvosios enciklopedijos",
                        loading_content: "Kraunamas turinys... ",
                        loading: "Kraunama"
                }
        }
}