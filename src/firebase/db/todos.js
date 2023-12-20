import { ref, set, update, get, remove } from "firebase/database";
import { db } from "../setup";
import { whoIsSignedIn } from "../auth";
import dayjs from "dayjs";


// retrieve user todo cards' content
async function getUserToDos(){
    const username = await whoIsSignedIn("username")
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

async function getToDoCardKey(title, username){
    const actualRef = ref(db, `users/${username}/todo-cards`);
    const snapshot = await get(actualRef);
    let cardToUpdate = ""
    snapshot.forEach(item => {
        if(item.val().title === title){
            cardToUpdate = item.key
        };
    })

    return cardToUpdate;
}

//change user todo status
async function changeToDoStatus(title, newStatus){
    const username = await whoIsSignedIn();
    let cardToUpdate = await getToDoCardKey(title, username)
    
    
    const updates = {}
    updates[ `users/${username}/todo-cards/${cardToUpdate}/status`] = newStatus;
    if(newStatus){
        updates[ `users/${username}/todo-cards/${cardToUpdate}/completed`] = dayjs().format('YYYY-DD-MM').toString();
    }else{
        updates[ `users/${username}/todo-cards/${cardToUpdate}/completed`] = "";
    }
    return update(ref(db), updates)
}

async function updateToDoItem(toDoItem){
    const username = await whoIsSignedIn();
    let cardToUpdate = await getToDoCardKey(toDoItem.title, username)

    const updates = {};
    updates[`users/${username}/todo-cards/${cardToUpdate}/title`] = toDoItem.newTitle;
    updates[`users/${username}/todo-cards/${cardToUpdate}/description`] = toDoItem.description;
    updates[`users/${username}/todo-cards/${cardToUpdate}/status`] = toDoItem.status;
    if(toDoItem.status){
        updates[`users/${username}/todo-cards/${cardToUpdate}/completed`] = dayjs().format('YYYY-DD-MM').toString();
    }else{
        updates[ `users/${username}/todo-cards/${cardToUpdate}/completed`] = "";
    }
    return update(ref(db), updates)
}

async function deleteToDoItem(title){
    const username = await whoIsSignedIn();
    let cardToDelete = await getToDoCardKey(title, username);

    return remove(ref(db,  `/users/${username}/todo-cards/${cardToDelete}`))
}

async function createToDoItem(item){
    const username = await whoIsSignedIn();
    const actualRef = ref(db, `users/${username}/todo-cards`);

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
        completed: item.status ? dayjs().format("YYYY-DD-MM").toString() : "",
        created: dayjs().format("YYYY-DD-MM").toString(),
        title: item.title,
        description: item.description,
        status: item.status
    })
}

export {getUserToDos, changeToDoStatus, updateToDoItem, deleteToDoItem, createToDoItem}
