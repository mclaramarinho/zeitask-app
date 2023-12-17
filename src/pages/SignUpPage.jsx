import React, { useEffect, useState } from "react";
import LogoHeader from "../components/LogoHeader";
import { Box, Checkbox, FormControl, FormControlLabel, TextField } from "@mui/material";
import { checkRegex } from "../utils/checkRegex";
import PasswordRules from "../components/PasswordRules";
import Button from "../components/Button";
import { checkEmailAvailability, checkUsernameAvailability } from "../firebase/db/user";
import { signUp, signIn } from "../firebase/auth";
import { useNavigate } from "react-router-dom";
import { preventLogout } from "../utils/preventLogout";

function SignUpPage(){
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [isEmailValid, setIsEmailValid] = useState(true);
    const [isEmailAvailable, setIsEmailAvailable] = useState(true);


    const [username, setUserName] = useState("");
    const [isUsernameValid, setIsUsernameValid] = useState(true);
    const [isUsernameAvailable, setIsUsernameAvailable] = useState(true);

    
    const [password, setPassword] = useState("");
    const [isPswdValid, setIsPswdValid] = useState(true);
    const [showPswdRules, setShowPswdRules] = useState();

    const [confirmPswd, setConfirmPswd] = useState("");
    const [pswdMatch, setPswdMatch] = useState(true);
    
    const [isTermAccepted, setIsTermAccepted] = useState()

    const [isRequiredEmpty, setIsRequiredEmpty] = useState()
    const [errorSigningUp, setErrorSigningUp] = useState()

    function handleEmail(e){
        setEmail(e.target.value)
        setIsEmailValid(checkRegex("email", e.target.value));
        !isEmailAvailable && !checkRegex("email", e.target.value) && setIsEmailAvailable(true)
    }

    function handleUsername(e){
        setUserName(e.target.value)
        setIsUsernameValid(checkRegex("username", e.target.value));
        !isUsernameAvailable && !checkRegex("username", e.target.value) && setIsUsernameAvailable(true)
    }

    function handlePswd(e){
        setPassword(e.target.value)
        setIsPswdValid(checkRegex("password", e.target.value));
    }
    function handleConfirmPswd(e){
        setConfirmPswd(e.target.value)
        if(e.target.value === password){
            setPswdMatch(true);
        }else{
            setPswdMatch(false);
        }
    }

    function handleSubmit(){
        if(email === undefined && username === undefined && password === undefined && isTermAccepted ===undefined){
            setIsRequiredEmpty(true)
            return;
        }
        if(email.length === 0 || username.length === 0 || password.length === 0 || !isTermAccepted){
            setIsRequiredEmpty(true)
            return;
        }

        if(checkRegex("email", email)){
            setIsEmailValid(true)
            checkEmailAvailability(email).then(r => {
                setIsEmailAvailable(r)
            })
        }else{
            setIsEmailValid(false)
        }

        if(checkRegex("username", username)){
            setIsUsernameValid(true)
            checkUsernameAvailability(username).then(r => {
                setIsUsernameAvailable(r)
            })
        }else{
            setIsUsernameValid(false);
        }

        signUp(email, password, isTermAccepted, username)
        .then(r=>{
            signIn(email, password).then((r) => {
                r && preventLogout('signup').then(p => navigate(p))
            })
            setErrorSigningUp(false)
        })
        .catch(e =>{
            setIsRequiredEmpty(false)
            setErrorSigningUp(true)
        })
        
    }

    

    return(
        <div className="container-fluid">
            <LogoHeader />
            <section className="p-md-5 text-center">
                <h2 className="mb-5">REGISTER ACCOUNT</h2>

                <Box component={"form"} className="container">
                    <div className="row column-gap-lg-5">

                        <div className="col-12 col-sm-11 col-md-1 col-lg-1 col-xl-2 mx-auto"></div>

                        <div className="col-12 col-sm-11 col-md-4 col-lg-3 mx-auto">
                            <div className="row">
                                <TextField id="email" variant="standard" fullWidth
                                            error = {isEmailValid !== undefined && !isEmailValid}
                                            
                                            color={isEmailValid ? "success" : "warning"}
                                            value={email}
                                            type="email"  label="Email"
                                            onChange={(e) => handleEmail(e)}/>
                                {isEmailAvailable && isEmailValid && <p></p>}
                                {!isEmailValid && <p className="error-msg m-0">The email informed is not in the correct format.</p>}
                                {!isEmailAvailable && <p className="error-msg m-0">This email is already exists!</p>}
                            </div>
                            <div className="row mt-md-5">
                                <TextField id="username" variant="standard" fullWidth
                                            error = {isUsernameValid !== undefined && !isUsernameValid}
                                            color={isUsernameValid ? "success" : "warning"}
                                            value={username}
                                            type="email"  label="Username"
                                            onChange={(e) => handleUsername(e)} />
                                {isUsernameAvailable && isUsernameValid && <p></p>}
                                {!isUsernameAvailable && <p className="error-msg p-0 m-0">This username already exists!</p>}
                                {!isUsernameValid && <p className="error-msg m-0">The username can only contain letters (A to Z), numbers (0 to 9), underline (_) and dash (-).</p>}
                            </div>
                            
                        </div>

                        <div className="col-12 col-sm-11 col-md-4 col-lg-3 mx-auto">
                            <div className="row">
                                    <TextField  variant="standard" fullWidth
                                            error = {isPswdValid !== undefined && !isPswdValid}
                                            color={isPswdValid ? "success" : "warning"}
                                            
                                            value={password}
                                            type="password"  label="Password"
                                            onChange={(e) => handlePswd(e)} onFocus={() => setShowPswdRules(true)} onBlur={() => setShowPswdRules(false)}/>
                                    
                                    {showPswdRules && <PasswordRules pswd={password} />}
                                    <p></p>
                            </div>
                            <div className="row mt-md-5">
                                <TextField  variant="standard" fullWidth
                                        error = {pswdMatch !== undefined && !pswdMatch}
                                        color={pswdMatch ? "success" : "warning"}
                                        helperText = {pswdMatch !== undefined && !pswdMatch && "Your passwords do not match!"}
                                        value={confirmPswd}
                                        type="password"  label="Confirm Password" 
                                        onChange={(e) => handleConfirmPswd(e)} />
                                        <p></p>
                            </div>
                        </div>
                        <div className="col-12 col-sm-11 col-md-1 col-lg-1 col-xl-2 mx-auto"></div>
                        <div className="row gutter-x-0">
                            <FormControlLabel 
                                required control={<Checkbox color="success"/>} 
                                label={"By continuing the registration, you hereby agree to this software's Terms and Conditions and its Privacy Policy."}
                                className="mx-auto p-0 m-0 text-start justify-content-center f-12 mt-5"
                                disableTypography
                                onChange={(e) => setIsTermAccepted(e.target.checked)}
                            />
                        </div>
                        <div className="row gutter-x-0">
                            
                            <Button label={"DONE!"} color={"green"} size="large" classes={"col-12 col-sm-6 col-md-3 mx-auto mt-5 bolder"} action = {handleSubmit} />
                            {isRequiredEmpty && <p className="fields-required-msg">All fields are required!</p>}
                            {errorSigningUp && <p className="fields-required-msg">This account already exists! <a href="/login">Sign in!</a></p>}
                        </div>
                    </div>
                    
                    
                </Box>
            </section>
        </div>
    )
}

export default SignUpPage;