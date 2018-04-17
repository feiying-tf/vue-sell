/**
 * 解析url参数
 * @example?id=12345&a=b
 * @return Object {id: 12345, a:b}
 */
export function urlParse () {
    // 获取到当前url?开始的查询部分
    let url = window.location.search;
    let obj = {};
    let reg = /[?&][^?&]+=[^?&]+/g;
    let arr = url.match(reg);
    if (arr) {
        arr.forEach((item) => {
            let tempArr = item.substring(1).split('=');
            let key = tempArr[0];
            let val = tempArr[1];
            obj[key] = val;
        });
    }
    return obj;
}
