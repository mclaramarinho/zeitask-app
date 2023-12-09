import { browserSessionPersistence, getAdditionalUserInfo, getAuth, signInWithCustomToken, signInWithEmailAndPassword} from "firebase/auth";
import { app, auth } from "./setup";
import { getLoginCookies, setLoginCookies } from "../utils/loginCookies";

async function signIn (email, password){
    const result = await new Promise((resolve, reject) => {
        resolve(signInWithEmailAndPassword(auth, email,password)
            .then((userCredential) => {

                //returns user uid - but can return anything needed
                const user = userCredential.user;
                
                return(user);
            })
            .catch((error) => {
                return "INVALID CREDENTIALS";
            }))
    })
    result !== "INVALID CREDENTIALS" && setLoginCookies({idToken: result.getIdTokenResult(), uid: result.uid})
    
    //returns true if authenticated and false if not authenticated
    return (result!=="INVALID CREDENTIALS")
}


function getUserInfo(credentials){
    const user = auth.currentUser;
    if(user !== null){
        const displayName = user.displayName;
        return displayName;
    }else{
        return false;
    }
}



export {signIn, getUserInfo};