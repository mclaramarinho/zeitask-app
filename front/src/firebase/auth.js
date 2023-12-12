import { browserSessionPersistence, getAdditionalUserInfo, getAuth, setPersistence, signInWithCustomToken, signInWithEmailAndPassword} from "firebase/auth";
import { app, auth } from "./setup";
import { getLoginCookies, setLoginCookies } from "../utils/loginCookies";

async function signIn (email, password){

    const result = await new Promise((resolve, reject) => {
        setPersistence(auth, browserSessionPersistence)
        .then(async () => {
            
            signInWithEmailAndPassword(auth, email, password)
            .then((userCred) => {
                const user = userCred.user;
                resolve(user);
            })
            .catch(err =>{
                resolve("INVALID CREDENTIALS");
            })
        }).catch(err => {
            resolve("AN ERROR OCCURRED")
        })
    })
    // const idToken = result.getIdTokenResult();
    // result !== "INVALID CREDENTIALS" && setLoginCookies({idToken: idToken, uid: result.uid})
    
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