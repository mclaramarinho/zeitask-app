import { browserLocalPersistence, onAuthStateChanged, setPersistence, signInWithEmailAndPassword, signOut, Auth, createUserWithEmailAndPassword, signInWithCredential, updateCurrentUser, updateProfile, updatePassword, sendEmailVerification, updateEmail, verifyBeforeUpdateEmail, signInWithCustomToken, sendPasswordResetEmail} from "firebase/auth";
import { app, auth, db } from "./setup";
import { createNewUser, getUserDBInfo, updateUserDatabase } from "./db/user";


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
            .then(async (userCred) => {
                const dbData = await getUserDBInfo(userCred.user);
                const dbEmail = dbData.email;
                const dbUsername = dbData.username;

                if(userCred.user.email !== dbEmail){
                    await updateUserDatabase('email', userCred.user.email)
                }
                if(userCred.user.displayName !== dbUsername){
                    await updateUserDatabase('username', userCred.user.displayName)
                }
                resolve();
            })
            .catch(err =>{
                resolve("INVALID CREDENTIALS");
            })
        }).catch(err => {
            resolve("AN ERROR OCCURRED")
        })
    })

    if(result !== "INVALID CREDENTIALS" && result !== "AN ERROR OCCURRED"){
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


    }
    
    return (result!=="INVALID CREDENTIALS" && (result!=="AN ERROR OCCURRED"))
}

async function signUserOut(){
    return new Promise((resolve, reject) => {
        try{
            signOut(auth).then(r=>{
                resolve(true)
            })
            
        }catch(err){
            reject(false);
        }
    })
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
    return new Promise((res, rej) =>{{
        updatePassword(user, newPassword).then(() => {
            res (true);
        })
        .catch((err) => {
            res (false)
        })}
    })
}

async function sendRecoveryLink(email){
    return new Promise((res, rej) => {
        sendPasswordResetEmail(auth, email).then(() => {
            res(true)
        }).catch(err => {
            rej(false)
        })
    })
}


async function sendVerification(){
    const user = await whoIsSignedIn("user");
    return sendEmailVerification(user).then(() => true).catch(err => false)
}

 async function changeEmail(newEmail){
    return new Promise((resolve, reject) => {
        onAuthStateChanged(auth, async (user) => {
            if(user){
                try{
                    await verifyBeforeUpdateEmail(user, newEmail)
                    resolve(true);
                }catch(error){
                    console.log(error)
                    reject(false);
                }
            }else{
                reject(false);
            }
        
        })
    })
}


export {signIn, getUsername, isUserSignedIn, whoIsSignedIn, signUserOut, signUp, getEmail, isEmailConfirmed, changePassword, sendVerification, changeEmail, sendRecoveryLink};