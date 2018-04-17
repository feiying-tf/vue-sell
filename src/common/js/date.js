export function formatDate (date, fmt) {
    // console.log("进入date了");
    // 替换年
    if (/(y+)/.test(fmt)) {
        // RegExp.$1就是匹配到的字符串，substr(4-RegExp.$1.length)是指从第几个开始截取，也就是说如果是yy，
        // 那么截取到的就是17, 如果是yyyy，那么截取到的就是2017
        fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length));
    }
    let MM = date.getMonth() + 1 + '';
    let dd = date.getDate() + '';
    let hh = date.getHours() + '';
    let mm = date.getMinutes() + '';
    let ss = date.getSeconds() + '';
    let o = {
        'M+': MM.padStart(2, '0'),
        'd+': dd.padStart(2, '0'),
        'h+': hh.padStart(2, '0'),
        'm+': mm.padStart(2, '0'),
        's+': ss.padStart(2, '0')
    };
    for (let k in o) {
        if (new RegExp(`(${k})`).test(fmt)) {
            let str = o[k];
            fmt = fmt.replace(RegExp.$1, str);
            // console.log(o[k]);
        }
    }
    return fmt;
    // console.log(fmt);
}
