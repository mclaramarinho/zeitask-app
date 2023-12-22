import { ref, set, update, get, remove } from "firebase/database";
import { db } from "../setup";
import { whoIsSignedIn } from "../auth";
import dayjs from "dayjs";


async function getUserToDoTags(){
    const username = await whoIsSignedIn("username");

    let actualRef = ref(db, `users/${username}/todo-tags`);
    let snapshot = await get(actualRef);
    let tags = [];
    //add new field to all users
    snapshot.forEach(item => {
        tags.push({
            tagName: item.val().name,
            tagColor: item.val().color
        })
    })
    return tags;
}

async function createUserToDoTag(tag){
    try{
        const username = await whoIsSignedIn("username");
        let actualRef = ref(db, `users/${username}/todo-tags/${tag.tagName}`);
        set(actualRef, {
            name: tag.tagName,
            color: tag.tagColor
        })
        return true;
    }catch(error){
        return false;
    }
}

async function deleteUserToDoTag(tagName){
    try{
        const username = await whoIsSignedIn("username");
        let actualRef = ref(db, `users/${username}/todo-tags/${tagName}`);
        remove(actualRef)
        return true;
    }catch(error){
        return false;
    }
}

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



/**
 * @param toDoItem: {title: string, newTitle: string, description: string, status: boolean, tag: string}
 * @returns void
 */
async function updateToDoItem(toDoItem){
    const username = await whoIsSignedIn();
    let cardToUpdate = await getToDoCardKey(toDoItem.title, username)

    const updates = {};
    updates[`users/${username}/todo-cards/${cardToUpdate}/title`] = toDoItem.newTitle;
    updates[`users/${username}/todo-cards/${cardToUpdate}/description`] = toDoItem.description;
    updates[`users/${username}/todo-cards/${cardToUpdate}/status`] = toDoItem.status;
    set(ref(db, `users/${username}/todo-cards/${cardToUpdate}/tag`), {});
    set(ref(db, `users/${username}/todo-cards/${cardToUpdate}/tag/${toDoItem.tag}`), true);
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
    const itemTag = item.tag;
    set(ref(db, `users/${username}/todo-cards/${randomID}`), {
        completed: item.status ? dayjs().format("YYYY-DD-MM").toString() : "",
        created: dayjs().format("YYYY-DD-MM").toString(),
        title: item.title,
        description: item.description,
        status: item.status,
        tag: {[itemTag]: true}
    })
}

export {getUserToDos, changeToDoStatus, updateToDoItem, deleteToDoItem, createToDoItem, getUserToDoTags, createUserToDoTag, deleteUserToDoTag}
