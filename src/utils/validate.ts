/* 合法uri*/
export function validateURL(textval: string) {
    const urlregex = /^(https?|ftp):\/\/([a-zA-Z0-9.-]+(:[a-zA-Z0-9.&%$-]+)*@)*((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3}|([a-zA-Z0-9-]+\.)*[a-zA-Z0-9-]+\.(com|edu|gov|int|mil|net|org|biz|arpa|info|name|pro|aero|coop|museum|[a-zA-Z]{2}))(:[0-9]+)*(\/($|[a-zA-Z0-9.,?'\\+&%$#=~_-]+))*$/;
    return urlregex.test(textval);
}

/* 小写字母*/
export function validateLowerCase(str: string) {
    const reg = /^[a-z]+$/;
    return reg.test(str);
}

/* 大写字母*/
export function validateUpperCase(str: string) {
    const reg = /^[A-Z]+$/;
    return reg.test(str);
}

/* 大小写字母*/
export function validatAlphabets(str: string) {
    const reg = /^[A-Za-z]+$/;
    return reg.test(str);
}

/* 手机号码*/
export function validatPhone(str: string) {
    const reg = /^1[3-9]\d{9}$/;
    return reg.test(str);
}

/* 密码*/
export function validatPassword(str: string) {
    const reg = /^(?!\d+$)(?![a-zA-Z]+$).{8,20}$/;
    return reg.test(str);
}

/* 身份证号*/
export function validaIDCard(str: string) {
    const reg = /(^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$)|(^[1-9]\d{5}\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{2}$)/;

    return reg.test(str);
}

/* 金额*/
export function validaMoney(str: string) {
    const reg = /^[0-9]+(.[0-9]{1,2})?$/;
    return reg.test(str);
}

/* 正整数*/
export function validaInt(str: string) {
    const reg = /^[1-9]\d*$/;
    return reg.test(str);
}

/* 输入字符控制*/
export function validaString(str: string) {
    const reg = /^\S{1,10}$/;
    return reg.test(str.trim());
}

/* 是否邮箱*/
export function isEmail(str: string) {
    const reg = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
    return reg.test(str.trim());
}

/* 输入图形验证码控制*/
export function validaCode(str: string) {
    const reg = /^[A-Za-z0-9]{4}$/;
    return reg.test(str.trim());
}

/* 是否为空 */
export function validaNull(str: string) {
    const reg = /^\s*$/;
    return reg.test(str.trim());
}

/* 是否为空 */
export function validaLength(str: string, min: number, max: number) {
    const reg = new RegExp(`^.{${min},${max}}$`);
    return reg.test(str.trim());
}

/* 输入短信验证码控制*/
export function validaMsg(str: string) {
    const reg = /^[A-Za-z0-9]{6}$/;
    return reg.test(str.trim());
}