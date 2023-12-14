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

export {checkEmailAvailability, checkUsernameAvailability}
