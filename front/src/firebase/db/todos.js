import { ref, set, update, get, remove } from "firebase/database";
import { db } from "../setup";
import { whoIsSignedIn } from "../auth";
import dayjs from "dayjs";

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

//change user todo status
async function changeToDoStatus(title, newStatus){
    const username = await whoIsSignedIn();

    const actualRef = ref(db, `users/${username}/todo-cards`);
    const snapshot = await get(actualRef);
    let cardToUpdate = ""
    
    snapshot.forEach(item => {
        if(item.val().title === title){
            cardToUpdate = item.key
        };
    })
    const updates = {}
    updates[ `users/${username}/todo-cards/${cardToUpdate}/status`] = newStatus;
    if(newStatus){
        updates[ `users/${username}/todo-cards/${cardToUpdate}/completed`] = dayjs().format('DD/MM/YYYY').toString();
    }else{
        updates[ `users/${username}/todo-cards/${cardToUpdate}/completed`] = "";
    }
    return update(ref(db), updates)

}

async function updateToDoItem(toDoItem){
    const username = await whoIsSignedIn();
    let cardToUpdate = (await getUserToDos(username)).map((item, index) => {
        if(item.title === toDoItem.title){
            return index
        }
    }).filter(item => item!==undefined)[0];
    cardToUpdate = "card"+(cardToUpdate+1);

    const updates = {};
    updates[`users/${username}/todo-cards/${cardToUpdate}/title`] = toDoItem.newTitle;
    updates[`users/${username}/todo-cards/${cardToUpdate}/description`] = toDoItem.description;
    updates[`users/${username}/todo-cards/${cardToUpdate}/status`] = toDoItem.status;
    if(toDoItem.status){
        updates[`users/${username}/todo-cards/${cardToUpdate}/completed`] = dayjs().format('DD/MM/YYYY').toString();
    }else{
        updates[ `users/${username}/todo-cards/${cardToUpdate}/completed`] = "";
    }
    return update(ref(db), updates)
}

async function deleteToDoItem(title){
    const username = await whoIsSignedIn();
    let cardToDelete = (await getUserToDos(username)).map((item, index) => {
        if(item.title === title){
            return index
        }
    }).filter(item => item !== undefined)[0];

    // const actualRef = ref(db, `/users/${username}/todo-cards/` )
    cardToDelete = "card"+(cardToDelete+1)
    return remove(ref(db,  `/users/${username}/todo-cards/${cardToDelete}`))
}

async function createToDoItem(item){
    const username = await whoIsSignedIn();
    const actualRef = ref(db, `users/${username}/todo-cards`);
    let todos = [];

    let random = 0;
    let randomID = "";

    const snapshot = await get(actualRef);
    
    while(true){
        random = Math.ceil(Math.random() * 100000)+1
        randomID = username+random;
        let alreadyExists = false;
        snapshot.forEach(item => {
            if(item.key === randomID){
                alreadyExists = true;
                return;
            }
        })
        if(!alreadyExists){
            break;
        }
    }
    
    set(ref(db, `users/${username}/todo-cards/${randomID}`), {
        completed: item.status ? dayjs().format("DD/MM/YYYY").toString() : "",
        created: dayjs().format("DD/MM/YYYY").toString(),
        title: item.title,
        description: item.description,
        status: item.status
    })
}

export {addUserToDo,getUserToDos, changeToDoStatus, updateToDoItem, deleteToDoItem, createToDoItem}
