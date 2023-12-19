import { ref, set, onValue, query, update, get } from "firebase/database";
import { auth, db } from "../setup";
import { whoIsSignedIn } from "../auth";
import dayjs from "dayjs";


async function checkEmailAvailability(email){
    const actualRef = ref(db, 'users');
    try{
        const snapshot = await get(actualRef);
        let res = true;
        snapshot.forEach(item => {
            if(item.val()['email'] === email){
                res = false;
            }
        })
        return res;
    }catch(error){
        throw error;
    }
}

async function checkUsernameAvailability(username){
    const actualRef = ref(db, 'users');
    try{
        const snapshot = await get(actualRef);
        let res = true;
        snapshot.forEach(item => {
            if(item.val()['username'] === username){
                res = false;
                return;
            }
        })
        return res;
    }catch(error){
        throw error;
    }
}

async function createNewUser(email, username, terms){
    const actualRef = ref(db, `users/${username}`);
    set(actualRef, {
        email: email,
        username: username,
        termsAccepted: terms
    })

}

async function getUserDBInfo(user){
    const username = user.displayName;
    const actualRef = ref(db, `users/${username}`);
    try{
        const snapshot = await get(actualRef);
        return snapshot.val();
    }catch(error){
        throw error;
    }
}

async function updateUserDatabase(whatToUpdate, newValue){
    let actualRef;
    const username = await whoIsSignedIn("username");
    return new Promise(async (res, rej) => {
        if(whatToUpdate === 'email'){
            actualRef = ref(db, 'users/'+username+'/email');
            try{
                await set(actualRef, newValue);
                res(true);
            }catch(error){
                res(false);
            }
        }else if(whatToUpdate === 'username'){
            actualRef = ref(db, 'users');
            try{
                const snapshot = await get(actualRef);
                snapshot.forEach(item => {
                    if(item.key === username){
                        item.key = newValue;
                        item.val()['username'] = newValue;
                    }
                })
                res(true);
            }catch(error){
                res(false);
            }
        }
    })
   
}

export {checkEmailAvailability, checkUsernameAvailability, createNewUser, updateUserDatabase, getUserDBInfo}
