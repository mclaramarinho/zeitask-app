import { ref, set, onValue, query } from "firebase/database";
import { db } from "./setup";

function addUserToDo(username, title, description){
    try{
        set(ref(db, `users/${username}/todo-cards/card1`), {
            title: title,
            description: description
        });
        return true;
    }catch(err){
        return false;
    }
}


// retrieve user todo cards' content
function getUserToDos(username){
    return new Promise((resolve, reject) => {
        const actualRef = ref(db, `users/${username}/todo-cards`);
        let res = [];
        try{
            onValue(actualRef, (snapshot) => {
                const data = snapshot.val();
                res.push(data);
            })
            resolve(res[0])
        }catch(err){
            resolve(err)
        }
    })
    
}

export {addUserToDo,getUserToDos}
