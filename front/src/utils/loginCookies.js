import Cookies from "js-cookie";

function setLoginCookies(userInfo){
    Cookies.set('userLoginInfo', JSON.stringify(userInfo), {expires: 15, secure: true})
}
function getLoginCookies(){
    return JSON.parse(Cookies.get('userLoginInfo'))
}
export { setLoginCookies, getLoginCookies }