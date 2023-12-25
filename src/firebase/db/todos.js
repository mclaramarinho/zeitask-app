import { ref, set, update, get, remove } from "firebase/database";
import { db } from "../setup";
import { whoIsSignedIn } from "../auth";
import dayjs from "dayjs";


//TO DO: try-catch blocks for all functions

/**
 * @todo - return false if there is an error
 * @params - none
 * @returns {Promise<Array>} - returns an array of objects with the user's todo tags
 * @returns {Promise<false>} - returns false if there is an error
 */
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

/**
 * @description - creates a new to do tag for the user
 * @param {Object} tag: {tagName: string, tagColor: string}
 * @returns - true if the tag was created successfully
 */
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

/**
 * @description - deletes a to do tag for the user
 * @param {string} tagName 
 * @returns - true if the tag was deleted successfully OR false if there was an error
 */
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
/**
 * @description - retrieves the user's todo cards
 * @params - none
 * @returns {Promise<Array>} - returns an array of objects with the user's todo cards
 * @returns {Promise<false>} - returns false if there is an error
 */
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
        return false;
    }
}  


/**
 * @todo - surround with try-catch block
 * @todo - get the current signed in user - stop passing it as a parameter
 * @todo - return false if there is an error
 * 
 * @description - retrieves the key of the todo card
 * @param {string} title 
 * @param {string} username 
 * @returns {Promise<string>} - returns the key of the todo card
 */
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

/**
 * @todo - surround with try-catch block
 * @todo - return false if there is an error
 * 
 * @description - changes the status of the todo card
 * @param {string} title 
 * @param {boolean} newStatus 
 * @returns {Promise<void>} - returns void
 */
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
 * @todo - surround with try-catch block
 * @todo - return false if there is an error
 * 
 * @description - updates the todo card
 * @param toDoItem: {title: string, newTitle: string, description: string, status: boolean, tag: string}
 * @returns {Promise<void>} - returns void
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

/**
 * @todo - surround with try-catch block
 * @todo - return false if there is an error
 * 
 * @description - deletes user's todo card
 * @param {string} title - title of the to do card to be deleted 
 * @returns {Promise<void>} - returns void
 */
async function deleteToDoItem(title){
    const username = await whoIsSignedIn();
    let cardToDelete = await getToDoCardKey(title, username);

    return remove(ref(db,  `/users/${username}/todo-cards/${cardToDelete}`))
}


/**
 * @todo - surround with try-catch block
 * @todo - return false if there is an error
 * @todo - return true if the item was created successfully
 * 
 * @description - creates a new todo card for the user
 * @param {Object} item: {title: string, description: string, status: boolean, tag: string} 
 * @returns {Promise<void>} - returns void
 */
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
