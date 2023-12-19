import React, { useEffect, useState } from "react";
import { redirect, useNavigate, useParams } from "react-router-dom";
import NavBar from "../components/NavBar";
import { IconButton, TextField, inputAdornmentClasses } from "@mui/material";
import { changeEmail, changePassword, getEmail, getUsername, isEmailConfirmed, sendVerification } from "../firebase/auth";
import {Edit, Save} from "@mui/icons-material"
import { checkEmailAvailability } from "../firebase/db/user";
import { checkRegex } from "../utils/checkRegex";
import { preventLogout } from "../utils/preventLogout";

function ProfilePage(){
    const {id} = useParams();
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [isEmailAvailable, setIsEmailAvailable] = useState(true);
    const [isEmailCorrect, setIsEmailCorrect] = useState(true);

    const [username, setUsername] = useState("");
    const [isUsernameAvailable, setIsUsernameAvailable] = useState(true);

    const [isVerified, setIsVerified] = useState(false);

    const [password, setPassword] = useState("");

    const [isEditingEmail, setIsEditingEmail] = useState(false);
    const [isEditingUsername, setIsEditingUsername] = useState(false);
    const [isEditingPassword, setIsEditingPassword] = useState(false);

    const [sentEmail, setSentEmail] = useState(false);
    useEffect(() => {
        preventLogout('profile').then(r => navigate(r))
        getUsername().then(r => setUsername(r))
        getEmail().then(r => setEmail(r))
        isEmailConfirmed().then(r => setIsVerified(r))
    },[])

    function handleEmailVerification(){
        sendVerification().then(r => setSentEmail(r))
    }

    async function handleEditEmail(){

        if(!isEditingEmail){
            setIsEditingEmail(true)
            console.log("editing")
        }else{
            const currentEmail = await getEmail();
            if(email !== currentEmail){
                if(checkRegex("email", email)){
                    checkEmailAvailability(email).then(r => {
                        setIsEmailAvailable(r);
                        if(r){
                            setIsEditingEmail(false)
                            sessionStorage.setItem("newEmail", email);
                            navigate("/reauthenticate/email");
                        }
                    })
                }else{
                    setIsEmailCorrect(false);
                }
            }else{
                setIsEmailAvailable(true)
                setIsEditingEmail(false)
                setIsEmailAvailable(true)
                setIsEmailCorrect(true)
            }
            
        }
    }
    useEffect(() => {
    }, [isEmailAvailable])
    return (
        <div className="container-fluid p-0">
            <NavBar />
            <div className="container position-fixed top-50 translate-middle start-50 h-50 w-75 outline-black shadow">
                <h4 className="row justify-content-center bolder p-5">Profile Settings</h4>
                <div className="row h-75 my-auto">
                    <div className="col-12 col-md-6 mx-auto m-md-0">
                        <div className="container">
                            <TextField helperText={!isEmailAvailable ? "This email is not available!" : !isEmailCorrect && "This is not an email!"} label={"EMAIL"} value={email} disabled={!isEditingEmail} onChange={(e) => setEmail(e.target.value)} className="mb-2 col-11" />
                            <IconButton className="col-1" onMouseUp={() => {handleEditEmail()}}>{!isEditingEmail ? <Edit /> : <Save />} </IconButton>
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