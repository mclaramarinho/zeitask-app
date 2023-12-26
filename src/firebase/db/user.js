import { ref, set, onValue, query, update, get } from "firebase/database";
import { auth, db } from "../setup";
import { whoIsSignedIn } from "../auth";
import dayjs from "dayjs";

/**
 * @description - Checks if an email is available
 * @async true
 * @param {string} email - the email to check
 * @returns {boolean} - true if the email is available, false if not
 * @throws {Error} - throws an error if something goes wrong
 */
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

/**
 * @description - Checks if a username is available
 * 
 * @async true
 * @param {string} username - the username to check
 * @returns {boolean} - true if the username is available, false if not
 * @throws {Error} - throws an error if something goes wrong
 */
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

/**
 * @todo - surround with try catch block
 * 
 * @async true
 * @description - Creates a new user in the database
 * @param {string} email - the email of the user
 * @param {string} username - the username of the user
 * @param {boolean} terms - whether or not the user accepted the terms
 * @returns {void} - returns nothing
 */ 
async function createNewUser(email, username, terms){
    const actualRef = ref(db, `users/${username}`);
    set(actualRef, {
        email: email,
        username: username,
        termsAccepted: terms,
        "todo-tags": {
            "default": {
                name: "default",
                color: "#b7dae2"
            },
            "personal": {
                name: "personal",
                color: "#006bff"
            },
            "work": {
                name: "work",
                color: "#00cc35"
            }
        },
        "todo-cards": {
            "_example_card": {
                title: "Example Card",
                description: "This is an example card. You can delete it by clicking the trash icon on the top right corner.",
                status: "false",
                created: dayjs().format("MM-DD-YYYY"),
                completed: "",
                tag: {default: true}
            }
        },
        "notes": {
            "note0000001": {
                title: "example note",
                content: "this is an example note",
                date: "12-22-2023"
            }
        }
    })

}

/**
 * @todo - surround with try catch block
 * @todo - get username from whoIsSignedIn() not from a parameter
 * 
 * @async true
 * @description - Gets the user's information from the database
 * @param {string} user 
 * @returns {object} - returns an object with the user's information
 * @throws {Error} - throws an error if something goes wrong
 */
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


/**
 * @async true
 * @description - Updates the user's information in the database
 * @param {string} whatToUpdate - what to update in the database
 * @param {string} newValue - the new value to set
 * @returns 
 */
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
