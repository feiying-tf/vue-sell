export function saveToLocal (id, key, val) {
    let seller = window.localStorage.__seller__;
    // 如果没有创建seller
    if (!seller) {
        seller = {};
        seller[id] = {};
    } else {
        // 否则将seller字符串转换成js对象，添加属性的时候必须用对象
        seller = JSON.parse(seller);
        // 如果seller.id不存在，让它等于一个对象
        if (!seller[id]) {
            seller[id] = {};
        }
    }
    // 进行赋值
    seller[id][key] = val;
    // 将js对象转成字符串,存储的时候必须用字符串
    window.localStorage.__seller__ = JSON.stringify(seller);
}
export function loadFromLocal (id, key, def) {
    let seller = window.localStorage.__seller__;
    // 如果没有seller，就说明没有存储过seller
    if (!seller) {
        // 返回默认值
        return def;
    }
    // 如果存储过，取出seller，并转换成js对象，取出对应的id
    seller = JSON.parse(seller)[id];
    // 如果没有这个id，返回默认值
    if (!seller) {
        return def;
    }
    // 最终返回对应的val值
    let ret = seller[key];
    return ret || def;
}
