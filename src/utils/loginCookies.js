import Cookies from "js-cookie";

function setLoginCookies(userInfo){
    Cookies.set('userLoginInfo', JSON.stringify(userInfo), {expires: 15, secure: true})
}
function getLoginCookies(){
    try{
        return JSON.parse(Cookies.get('userLoginInfo'))
    }catch(err){
        return err
    }
}
export { setLoginCookies, getLoginCookies }