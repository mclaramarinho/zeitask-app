import { browserLocalPersistence, onAuthStateChanged, setPersistence, signInWithEmailAndPassword, signOut, Auth, createUserWithEmailAndPassword, signInWithCredential, updateCurrentUser, updateProfile, updatePassword, sendEmailVerification} from "firebase/auth";
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

async function whoIsSignedIn(what){
    
    return new Promise((resolve, reject) => {
        onAuthStateChanged(auth, (user) => {
            if(user){
                if(what === "username"){
                    resolve(user.displayName)
                }else if(what === "email"){
                    resolve(user.email)
                }else if(what === "verified"){
                    resolve(user.emailVerified)
                }else if(what === "user"){
                    resolve(user)
                }                
                else{
                    resolve(user.displayName)
                }
                
            }else{
                resolve("NO USER SIGNED IN")
            }
        });
    })
}


async function getUsername(){

    return new Promise((resolve, reject) => {
        whoIsSignedIn("username").then(r => {resolve(r)})
    })
}

function getEmail(){
    return new Promise((res, rej) => {
        whoIsSignedIn("email").then(r => res(r))
    })
}

function isEmailConfirmed(){
    return new Promise((res, rej) =>{
        whoIsSignedIn("verified").then(r => res(r))
    })
}

//unfinished
async function changePassword(newPassword){
    const user = await whoIsSignedIn("user");
    return updatePassword(user, newPassword).then(() => {
        return true;
    })
    .catch((err) => {
        return false
    })
    // updateCurrentUser(auth, user)
}

async function sendVerification(){
    const user = await whoIsSignedIn("user");
    return sendEmailVerification(user).then(() => true).catch(err => false)
}

async function changeEmail(newEmail){
    
}


export {signIn, getUsername, isUserSignedIn, whoIsSignedIn, signUserOut, signUp, getEmail, isEmailConfirmed, changePassword, sendVerification};