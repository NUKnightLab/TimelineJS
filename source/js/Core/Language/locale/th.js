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
            full_short: "d mmm",
            full: "d mmmm yyyy",
            time_short: "h:MM:ss TT",
            time_no_seconds_short: "h:MM TT",
            time_no_seconds_small_date: "h:MM TT'<br/><small>'d mmmm yyyy'</small>'",
            full_long: "d mmmm yyyy 'เวลา' h:MM TT",
            full_long_small_date: "h:MM TT'<br/><small>d mmm yyyy'</small>'"
        },
        messages: {
            loading_timeline: "กำลังสร้างไทม์ไลน์... ",
            return_to_title: "กลับสู้หน้าหลัก",
            expand_timeline: "ขยายไทม์ไลน์",
            contract_timeline: "ย่อไทม์ไลน์",
            wikipedia: "จากวิกิพีเดีย สารานุกรมเสรี",
            loading_content: "กำลังโหลดข้อมูล",
            loading: "กำลังโหลด"
        }
    }
}