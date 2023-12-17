import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import NavBar from "../components/NavBar";
import { IconButton, TextField, inputAdornmentClasses } from "@mui/material";
import { changePassword, getEmail, getUsername, isEmailConfirmed, sendVerification } from "../firebase/auth";
import { SaveButton } from "react-admin";
import {Edit, Save} from "@mui/icons-material"
function ProfilePage(){
    const {id} = useParams();
    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [isVerified, setIsVerified] = useState(false);

    const [isEditingEmail, setIsEditingEmail] = useState(false);
    const [isEditingUsername, setIsEditingUsername] = useState(false);
    const [isEditingPassword, setIsEditingPassword] = useState(false);

    const [sentEmail, setSentEmail] = useState(false);
    useEffect(() => {
        getUsername().then(r => setUsername(r))
        getEmail().then(r => setEmail(r))
        isEmailConfirmed().then(r => setIsVerified(r))
    },[])

    function handleEmailVerification(){
        sendVerification().then(r => setSentEmail(r))
    }

    function handleEditEmail(){
        if(!isEditingEmail){
            console.log("editing")
        }
        // else{
        // //     if
        // // }
    }
    return (
        <div className="container-fluid p-0">
            <NavBar />
            <div className="container position-fixed top-50 translate-middle start-50 h-50 w-75 outline-black shadow">
                <h4 className="row justify-content-center bolder p-5">Profile Settings</h4>
                <div className="row h-75 my-auto">
                    <div className="col-12 col-md-6 mx-auto m-md-0">
                        <div className="container">
                            <TextField label={"EMAIL"} value={email} disabled={!isEditingEmail} onChange={(e) => setEmail(e.target.value)} className="mb-2 col-11" />
                            <IconButton className="col-1" onMouseUp={() => {setIsEditingEmail(!isEditingEmail); handleEditEmail()}}>{!isEditingEmail ? <Edit /> : <Save />} </IconButton>
                            {isVerified && <p>Your email is verified!</p>}
                            {!isVerified && sentEmail && <p>Verification email sent!</p>}
                            {!isVerified && !sentEmail && <p className="pointer-cursor" onMouseUp={() => handleEmailVerification()}>Verify your email now!</p>}  
                        </div>

                        <div className="container mt-5">
                            <TextField label={"USERNAME"} value={username} disabled className="col-11"/>
                            <IconButton className="col-1"><Edit /> </IconButton>
                        </div>
                    </div>
                    <div className="col-12 col-md-6 mx-auto">
                        <div className="container">
                            <TextField label={"PASSWORD"} type="password" value={email} disabled className="mb-2 col-11" />
                            <IconButton className="col-1"><Edit /> </IconButton>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ProfilePage;