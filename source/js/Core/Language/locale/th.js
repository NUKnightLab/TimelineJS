/* Thai LANGUAGE 
================================================== */
if(typeof VMM != 'undefined') {
    VMM.Language = {
        lang: "th",
        api: {
            wikipedia: "th"
        },
        date: {
            month: ["มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน", "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม"],
            month_abbr: ["ม.ค.", "ก.พ", "มี.ค.", "เม.ย.", "พ.ค.", "มิ.ย.", "ก.ค.", "ส.ค.", "ก.ย.", "ต.ค.", "พ.ย.", "ธ.ค."],
            day: ["อาทิตย์","จันทร์", "อังคาร", "พุธ", "พฤหัสบดี", "ศุกร์", "เสาร์"],
            day_abbr: ["อา.","จ.", "อ.", "พ.", "พฤ.", "ศ.", "ส."]
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
            loading_timeline: "Loading Timeline... ",
            return_to_title: "Return to Title",
            expand_timeline: "Expand Timeline",
            contract_timeline: "Contract Timeline",
            wikipedia: "From Wikipedia, the free encyclopedia",
            loading_content: "Loading Content",
            loading: "Loading"
        }
    }
}