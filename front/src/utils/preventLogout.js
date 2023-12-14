import { isUserSignedIn, whoIsSignedIn } from "../firebase/auth"

async function preventLogout(whereAt, setIsSignedIn){

    return new Promise((resolve, reject) => {
        isUserSignedIn().then(r => {
            if(r){
                whoIsSignedIn().then(res => {
                    setIsSignedIn && setIsSignedIn(true);
                    resolve(handlePath(whereAt, res))    
                })
            }else{
                console.log(r)
                setIsSignedIn && setIsSignedIn(false);
                resolve('/login')
            }
        })
    })
}

function handlePath(whereAt, id){
    let response = "";
    switch(whereAt){
        case 'login':
        case 'dashboard':
            response = `/dashboard/${id}`;
            break;
        case 'todo':
            response = `/dashboard/${id}/todo`;
            break;
        case 'kanban':
            response = `/dashboard/${id}/kanban`;
            break;
        case 'profile':
            response = `/dashboard/${id}/profile`;
            break;
    }
    return response;
}




export {preventLogout}