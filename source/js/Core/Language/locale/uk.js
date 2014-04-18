/* Ukrainian LANGUAGE 
================================================== */
if(typeof VMM != 'undefined') {
	VMM.Language = {
		lang: "uk",
		api: {
			wikipedia: "uk"
		},
		date: {
			month: ["Січень", "Лютий", "Березень", "Квітень", "Травень", "Червень", "Липень", "Січень", "Вересень", "Жовтень", "Листопад", "Грудень"],
			month_abbr: ["Січ.", "Лют.", "Бер.", "Кві.", "Тра.", "Чер.", "Лип.", "Січ.", "Вер.", "Жов.", "Лис.", "Гру."],
			day: ["Неділя", "Понеділок", "Вівторок", "Середа", "Четверг", "П'ятниця", "Субота"],
			day_abbr: ["Нд.", "Пн.", "Вт.", "Ст.", "Чт.", "Пт.", "Сб."]
		}, 
		dateformats: {
			year: "yyyy",
			month_short: "mmm",
			month: "mmmm yyyy",
			full_short: "d mmm",
			full: "d mmmm yyyy",
			time_short: "h:MM:ss TT",
			time_no_seconds_short: "h:MM TT",
			time_no_seconds_small_date: "h:MM TT'<br/><small>'d mmmm yyyy'</small>'",
			full_long: "d mmm yyyy 'at' h:MM TT",
			full_long_small_date: "h:MM TT'<br/><small>'d mmm yyyy'</small>'"
		},
		messages: {
			loading_timeline: "Завантаження... ",
			return_to_title: "Повернутись на заголовку",
			expand_timeline: "Збільшити",
			contract_timeline: "Зменшити",
			wikipedia: "Із Wikipedia",
			loading_content: "Завантаження вмісту",
			loading: "Завантаження"
		}
	}
}