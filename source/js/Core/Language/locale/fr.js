/* French LANGUAGE
================================================== */
if(typeof VMM != 'undefined') {
    VMM.Language = {
        lang: "fr",
        api: {
            wikipedia: "fr"
        },
        date: {
            month: [
                "janvier",
                "février",
                "mars",
                "avril",
                "mai",
                "juin",
                "juillet",
                "août",
                "septembre",
                "octobre",
                "novembre",
                "décembre"
            ],
            month_abbr: [
                "janv.",
                "févr.",
                "mars",
                "avril",
                "mai",
                "juin",
                "juil.",
                "août",
                "sept.",
                "oct.",
                "nov.",
                "dec."
            ],
            day: [
                "Dimanche",
                "Lundi",
                "Mardi",
                "Mercredi",
                "Jeudi",
                "Vendredi",
                "Samedi"
            ],
            day_abbr: [
                "Dim.",
                "Lu.",
                "Ma.",
                "Me.",
                "Jeu.",
                "Vend.",
                "Sam."
            ],
        },
        era_labels: { // specify prefix or suffix to apply to formatted date. Blanks mean no change.
            positive_year: {
                prefix: "",
                suffix: ""
            },
            negative_year: { // if either of these is specified, the year will be converted to positive before they are applied
                prefix: "",
                suffix: "Avant JC"
            }
        },
        period_labels: {  // use of t/tt/T/TT is a legacy of original Timeline date format
            t: ["a", "p"],
            tt: ["am", "pm"],
            T: ["A", "P"],
            TT: ["AM", "PM"]
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
            full_long: "dddd',' d mmm yyyy 'à' HH:MM",
            full_long_small_date: "HH:MM'<br/><small>'dddd',' d mmm yyyy'</small>'"
        },
        messages: {
            loading_timeline: "Chargement de la frise en cours... ",
            return_to_title: "Retour à la page d'accueil",
            expand_timeline: "Elargir la frise",
            contract_timeline: "Réduire la frise",
            wikipedia: "Extrait de Wikipedia, l'encyclopédie libre",
            loading_content: "Chargement",
            loading: "Chargement",
            swipe_nav: "Swipe to Navigate",
            error: "Erreur",
            swipe_to_navigate: "Faites glisser pour naviguer<br><span class='tl-button'>OK</span>",
            unknown_read_err: "Une erreur indéterminée est survenue lors de l'accès aux données de votre feuille de calcul.",
            invalid_url_err: "Impossible d'accéder aux données de la Timeline. Assurez-vous que votre url est celle d'un Google Spreadsheet ou d'un fichier Timeline json.",
            network_err: "Impossible d'accéder à Google Spreadsheet. Assurez-vous que votre Google Spreadsheet est bien publié pour le web.",
            empty_feed_err: "Aucune donnée trouvée",
            missing_start_date_err: "Date de début manquante",
            invalid_data_format_err: "Erreur : La ligne d'entête a été modifiée.",
            date_compare_err: "Impossible de comparer les TL.Dates à différentes échelles",
            invalid_scale_err: "Echelle invalide",
            invalid_date_err: "Date invalide : les jours, mois et années doivent être des nombres.",
            invalid_hour_err: "Erreur : Heure invalide",
            invalid_minute_err: "Erreur : Minutes invalides",
            invalid_second_err: "Erreur : Secondes invalides",
            invalid_fractional_err: "Erreur : Fractions de secondes invalides",
            invalid_second_fractional_err: "Erreur : Secondes et fractions de secondes invalides",
            invalid_year_err: "Année invalide",
            flickr_notfound_err: "Photo non trouvée ou privée",
            flickr_invalidurl_err: "URL Flickr invalide",
            imgur_invalidurl_err: "URL Imgur invalide",
            twitter_invalidurl_err: "URL Twitter invalide",
            twitter_load_err: "Impossible de charger le tweet",
            twitterembed_invalidurl_err: "URL d'embed Twitter invalide",
            wikipedia_load_err: "Impossible de charger les données de Wikipedia",
            youtube_invalidurl_err: "URL YouTube invalide",
            spotify_invalid_url: "URL Spotify invalide",
            template_value_err: "Aucune donnée pour cette variable",
            invalid_rgb_err: "Argument RGB invalide"
        }
    }
}
