function checkRegex(type, str){
    if(type === undefined || type === null || type.length === 0){
        throw new Error("You need to pass a type argument.");
    }else{
        let regex = /d/i;
        switch(type){
            case "email":
                regex = /[-A-Za-z0-9!#$%&'*+/=?^_`{|}~]+(?:\.[-A-Za-z0-9!#$%&'*+/=?^_`{|}~]+)*@(?:[A-Za-z0-9](?:[-A-Za-z0-9]*[A-Za-z0-9])?\.)+[A-Za-z0-9](?:[-A-Za-z0-9]*[A-Za-z0-9])?/i;
                break;
            case "username":
                regex = /^[a-zA-Z0-9_-]*$/i;
                break;
            case "password":
                regex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/i;
                break;
            case "pswdLength":
                regex = /^.{8,}$/;
                break;
            case "uppercase":
                regex = /^.*[A-Z].*$/;
                break;
            case "lowercase":
                regex = /^.*[a-z].*$/;
                break;
            case "number":
                regex = /^.*\d.*$/i;
                break;
            case "specialChar":
                regex = /^.*[@$!%*?&].*$/i;
                break;
            default:
                throw new Error("The type you passed is invalid!");
        }
        
        return regex.test(str)
    }

}

export {checkRegex}