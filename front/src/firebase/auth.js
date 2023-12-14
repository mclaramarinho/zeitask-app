import { browserSessionPersistence, getAdditionalUserInfo, getAuth, onAuthStateChanged, setPersistence, signInWithCustomToken, signInWithEmailAndPassword, updateCurrentUser} from "firebase/auth";
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
    
    return (result!=="INVALID CREDENTIALS" && (result!=="AN ERROR OCCURRED"))
}

// checks if theres an user signed in 
async function isUserSignedIn(){
    return new Promise((resolve, reject) => {
        onAuthStateChanged(auth, (user) => {
            if (user) {
                resolve(true)
            } else {
                resolve(false)
            }
        });
    })
}

async function whoIsSignedIn(){
    return new Promise((resolve, reject) => {
        onAuthStateChanged(auth, (user) => {
            if(user){
                resolve(user.displayName)
            }else{
                resolve("NO USER SIGNED IN")
            }
        });
    })
}


function getUserInfo(uid){
    const user = auth.currentUser;
    if(user !== null){
        const displayName = user.displayName;
        return displayName;
    }else{
        return false;
    }
}



export {signIn, getUserInfo, isUserSignedIn, whoIsSignedIn};