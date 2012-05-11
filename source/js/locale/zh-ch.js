// @codekit-prepend "VMM.Timeline.js";
/* LANGUAGE 
================================================== */
if(typeof VMM != 'undefined') {
	VMM.debug = false;
	VMM.Language = {
		date: {
			month: ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"],
			month_abbr: ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"],
			day: ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"],
			day_abbr: ["周日", "周一", "周二", "周三", "周四", "周五", "周六"],
		}, 
		dateformats: {
			year: "yyyy",
			month_short: "mmm",
			month: "mmmm yyyy",
			full_short: "d mmm",
			full: "d mmmm yyyy",
			time_no_seconds_short: "HH:MM",
			time_no_seconds_small_date: "HH:MM'<br/><small>'d mmmm yyyy'</small>'",
			full_long: "dddd',' d mmm yyyy 'um' HH:MM",
			full_long_small_date: "HH:MM'<br/><small>'dddd',' d mmm yyyy'</small>'",
		},
		messages: {
			loading_timeline: "加载时间线... ",
			return_to_title: "回到开头",
			expand_timeline: "伸展时间",
			contract_timeline: "缩短时间"
		}
	}
}
