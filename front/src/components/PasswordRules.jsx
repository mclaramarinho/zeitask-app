import React from "react";
import { checkRegex } from "../utils/checkRegex";

function PasswordRules(props){
    const password = props.pswd;
    return (
        <div className="container text-start f-13" id="password-rules-div">
            <p className="row">Your password must contain (at least)</p>
            <ul>
                <li className={checkRegex("pswdLength", password) ? "v-mark" : "x-mark"}>8 Characters</li>
                <li className={checkRegex("uppercase", password) ? "v-mark" : "x-mark"}>1 Uppercase Letter</li>
                <li className={checkRegex("lowercase", password) ? "v-mark" : "x-mark"}>1 Lowercase Letter</li>
                <li className={checkRegex("number", password) ? "v-mark" : "x-mark"}>1 Number</li>
                <li className={checkRegex("specialChar", password) ? "v-mark" : "x-mark"}>1 Special Character (!, @, #, $, %, ^, &, *, -, +, _)</li>
            </ul>
        </div>
    )
}

export default PasswordRules;