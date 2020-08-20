function classChange(dom, class1, class2) {


    if (dom.hasClass(class1)) {
        dom.removeClass(class1);
        dom.addClass(class2);
    } else {
        dom.removeClass(class2);
        dom.addClass(class1);
    }

}


function setClass(dom, class1, class2) {
    if (dom.hasClass(class1)) {
        return;
    } else {
        if (dom.hasClass(class2)) {
            dom.removeClass(class2);
        }
        dom.addClass(class1);
    }
}

/**
 * 字符串格式化辅助
 */
String.prototype.format = function (args) {
    let result = this;
    if (arguments.length > 0) {
        if (arguments.length === 1 && typeof (args) == "object") {
            for (let key in args) {
                if (args.key !== undefined) {
                    let reg = new RegExp("({" + key + "})", "g");
                    result = result.replace(reg, args.key);
                }
            }
        } else {
            for (let i = 0; i < arguments.length; i++) {
                if (arguments[i] !== undefined) {
                    let reg = new RegExp("({[" + i + "]})", "g");
                    result = result.replace(reg, arguments[i]);
                }
            }
        }
    }
    return result;
};
