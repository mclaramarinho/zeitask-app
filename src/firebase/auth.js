import { browserLocalPersistence, onAuthStateChanged, setPersistence, signInWithEmailAndPassword, signOut, Auth, createUserWithEmailAndPassword, signInWithCredential, updateCurrentUser, updateProfile} from "firebase/auth";
import { app, auth } from "./setup";
import { getLoginCookies, setLoginCookies } from "../utils/loginCookies";
import { createNewUser } from "./db/user";


async function signUp(email, password, terms, username){

        try{
            const userCred = await createUserWithEmailAndPassword(auth, email, password)
            const user = userCred.user;
            await updateProfile(auth.currentUser, {
                displayName: username
            })
            const result = await createNewUser(email, username, terms)
            return true;
        }catch(err){
            throw err.message;
        }
}



async function signIn (email, password){

    const result = await new Promise((resolve, reject) => {
        
        setPersistence(auth,  browserLocalPersistence)
        .then(async () => {
            
            signInWithEmailAndPassword(auth, email, password)
            .then((userCred) => {
                resolve();
            })
            .catch(err =>{
                resolve("INVALID CREDENTIALS");
            })
        }).catch(err => {
            resolve("AN ERROR OCCURRED")
        })
    })

    const ls = Object.keys(localStorage);
    let persistenceLS = "";
    ls.forEach(item => {
        if(item.includes('DEFAULT')){
            persistenceLS = item;
        }
    })
    let currentData = JSON.parse(localStorage.getItem(persistenceLS));
    currentData.apiKey = null;

    localStorage.setItem(persistenceLS, JSON.stringify(currentData))
    
    return (result!=="INVALID CREDENTIALS" && (result!=="AN ERROR OCCURRED"))
}

async function signUserOut(){
    try{
        signOut(auth).then(r=>{
            return true
        })
        
    }catch(err){
        return false
    }
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



export {signIn, getUserInfo, isUserSignedIn, whoIsSignedIn, signUserOut, signUp};