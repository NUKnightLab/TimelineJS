// @codekit-prepend "VMM.Timeline.js";
/* LANGUAGE 
================================================== */
if(typeof VMM != 'undefined') {
	VMM.debug = false;
	VMM.Language = {
		date: {
			month: ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"],
			month_abbr: ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"],
			day: ["日曜日", "月曜日", "火曜日", "水曜日", "木曜日", "金曜日", "土曜日"],
			day_abbr: ["日", "月", "火", "水", "木", "金", "土"]
		}, 
		dateformats: {
			year: "yyyy年",
			month_short: "mmm",
			month: "yyyy年 m月d日 (ddd)",
			full_short: "yyyy年m月d日",
			full: "yyyy年 m月d日 (ddd)",
			time_no_seconds_short: "HH:MM",
			time_no_seconds_small_date: "HH:MM'<br/><small>'yyyy年m月d日'</small>'",
			full_long: "yyyy年m月d日 H時M分s秒",
			full_long_small_date: "HH:MM:ss'<br/><small>'yyyy年m月d日'</small>'"
		},
		messages: {
			loading_timeline: "Loading Timeline... ",
			return_to_title: "Return to Title",
			expand_timeline: "Expand Timeline",
			contract_timeline: "Contract Timeline"
		}
	}
}
