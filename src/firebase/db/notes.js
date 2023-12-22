import { get, ref, remove, set, update } from "firebase/database";
import { whoIsSignedIn } from "../auth";
import { db } from "../setup";

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
        }else{
            // createUserNotesPath();
        }
    }catch (error){
        throw error;
    }
}

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

    }catch (error){
        throw error;
    }
}

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
        console.log(err)
        return false;
    }
}

async function deleteNote(key){
    try{
        const username = await whoIsSignedIn("username");
        const actualRef = ref(db, `users/${username}/notes/${key}`);
        remove(actualRef);
        return true;
    }catch(err){
        console.log(err)
        return false;
    }
}

export { getUserNotes, editNote, createNewNote, deleteNote }