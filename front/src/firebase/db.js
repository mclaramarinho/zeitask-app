import { ref, set, onValue, query, update, get } from "firebase/database";
import { auth, db } from "./setup";

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
async function getUserToDos(username){
    // const ssKey = sessionStorage.key(0);
    // const username = JSON.parse(sessionStorage.getItem(ssKey)).displayName;
    const actualRef = ref(db, `users/${username}/todo-cards`);
    try{
        const snapshot = await get(actualRef);
        const res = [];
        snapshot.forEach(item => {
            res.push(item.val())
        })
        return res;
    }catch (error){
        throw error;
    }
        
    
}  

async function changeToDoStatus(title, newStatus){
    const ssKey = sessionStorage.key(0);
    const username = JSON.parse(sessionStorage.getItem(ssKey)).displayName;
    let cardToUpdate = (await getUserToDos(username)).map((item, index) => {if (item.title === title ) { return index}}).filter(item => item!==undefined)[0];

    cardToUpdate = "card"+(cardToUpdate + 1);
    console.log(cardToUpdate)
    const updates = {}
    updates[ `users/${username}/todo-cards/${cardToUpdate}/status`] = newStatus;
    return update(ref(db), updates)

}

async function checkEmailAvailability(email){
    const actualRef = ref(db, 'users');
    try{
        const snapshot = await get(actualRef);
        let res = true;
        snapshot.forEach(item => {
            if(item.val().email === email){
                res = false;
                return;    
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
            if(item.key === username){
                res = false;
                return;
            }
        })
        return res;
    }catch(error){
        throw error;
    }
}

export {addUserToDo,getUserToDos, changeToDoStatus, checkEmailAvailability, checkUsernameAvailability}
