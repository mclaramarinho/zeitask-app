import { get, ref, remove, set, update } from "firebase/database";
import { whoIsSignedIn } from "../auth";
import { db } from "../setup";

/**
 * @params - none
 * @description - retrieves all the notes of the current signed in user from the database
 * @returns {Promise<Object>} - returns an object with all the notes of the user OR false if there is an error
 */
async function getUserNotes(){
    const username = await whoIsSignedIn("username")
    const actualRef = ref(db, `users/${username}/notes`);
    try{
        const snapshot = await get(actualRef);
        
        if(snapshot.exists()){
            const res = {};
            snapshot.forEach(item => {
                res[item.key] = item.val();
            })
            return res;
        }
    }catch (error){
        return false;
    }
}


/**
 * @params - none
 * @description - creates a path for the user's notes in the database
 * @returns - true if the path was created successfully OR false if there was an error
 */
async function createUserNotesPath(){
    try{
        const username = await whoIsSignedIn("username")
        const actualRef = ref(db, `users/${username}`);
        const snapshot = await get(actualRef);
        const res = {};
        snapshot.forEach(item => {
            res[item.key] = item.val();
        })
        res["notes"] = {"note0000001": {title: "example note", content: "this is an example note", date: "12-22-2023"}};
        set(actualRef, res).then(() => {console.log("success")}).catch((error) => {console.log(error)})
        return true;

    }catch (error){
        return false;
    }
}


/**
 * @description - edits a note in the database
 * @param {string} key 
 * @param {Object} values 
 * @returns - true if the note was edited successfully OR false if there was an error
 */
async function editNote(key, values){
    try{
        const username = await whoIsSignedIn("username")
        const actualRef = ref(db, `users/${username}/notes/${key}`);
        update(actualRef, values)
        return true;
    }catch (error){
        return false;
    }
}


/**
 * @description - creates a new note in the database
 * @param {Object} note:{title, content, date} 
 * @returns - true if the note was created successfully OR false if there was an error
 */
async function createNewNote(note){
    try{
        const username = await whoIsSignedIn("username");
        const actualRef = ref(db, `users/${username}/notes`);
        let randInt = Math.ceil(Math.random() * 10000000);
        let keyName = `${username}_note_${randInt}`;
        while(true){
            const snapshot = await get(actualRef);
            if(!snapshot.hasChild(keyName)){
                break;
            }
            randInt = Math.ceil(Math.random() * 10000000);
            keyName = `${username}_note_${randInt}`;
        }
        const newRef = ref(db, `users/${username}/notes/${keyName}`);
        set(newRef, note);
        return true;
    }catch(err){
        return false;
    }
}

/**
 * @async - true
 * @description - deletes a note in the database
 * @param {string} key 
 * @returns  - true if the note was deleted successfully OR false if there was an error
 */
async function deleteNote(key){
    try{
        const username = await whoIsSignedIn("username");
        const actualRef = ref(db, `users/${username}/notes/${key}`);
        remove(actualRef);
        return true;
    }catch(err){
        return false;
    }
}

export { getUserNotes, editNote, createNewNote, deleteNote }