import React, { useState } from "react";
import LogoHeader from "../components/LogoHeader";
import { Box, Checkbox, FormControl, FormControlLabel, TextField } from "@mui/material";
import { checkRegex } from "../utils/checkRegex";
import PasswordRules from "../components/PasswordRules";
import Button from "../components/Button";
import { checkEmailAvailability } from "../firebase/auth";

function SignUpPage(){
    const [email, setEmail] = useState("");
    const [isEmailValid, setIsEmailValid] = useState();

    const [username, setUserName] = useState("");
    const [isUsernameValid, setIsUsernameValid] = useState();


    const [password, setPassword] = useState("");
    const [isPswdValid, setIsPswdValid] = useState();
    const [showPswdRules, setShowPswdRules] = useState();

    const [confirmPswd, setConfirmPswd] = useState("");
    const [pswdMatch, setPswdMatch] = useState();

    
    function handleEmail(e){
        setEmail(e.target.value)
        setIsEmailValid(checkRegex("email", e.target.value));
    }

    function handleUsername(e){
        setUserName(e.target.value)
        setIsUsernameValid(checkRegex("username", e.target.value));
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
        //check regex
        //check availability of username and email in database
        // console.log(checkEmailAvailability(email))
    }

    function checkEmailDB(){
        //checks if the email already exists in the database
    }

    function checkUsernameDB(){
        //checks if the username already exists in the database
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
                                            helperText={isEmailValid !== undefined && !isEmailValid && "The email informed is not in the correct format."}
                                            color={isEmailValid ? "success" : "warning"}
                                            value={email}
                                            type="email"  label="Email"
                                            onChange={(e) => handleEmail(e)}/>
                            </div>
                            <div className="row mt-md-5">
                                <TextField id="username" variant="standard" fullWidth
                                            error = {isUsernameValid !== undefined && !isUsernameValid}
                                            helperText = {isUsernameValid !== undefined && !isUsernameValid && "The username can only contain letters (A to Z), numbers (0 to 9), underline (_) and dash (-)."}
                                            color={isUsernameValid ? "success" : "warning"}
                                            value={username}
                                            type="email"  label="Username"
                                            onChange={(e) => handleUsername(e)} />
                            </div>
                        </div>

                        <div className="col-12 col-sm-11 col-md-4 col-lg-3 mx-auto">
                            <div className="row">
                                    <TextField id="email-field" variant="standard" fullWidth
                                            error = {isPswdValid !== undefined && !isPswdValid}
                                            color={isPswdValid ? "success" : "warning"}
                                            
                                            value={password}
                                            type="password"  label="Password"
                                            onChange={(e) => handlePswd(e)} onFocus={() => setShowPswdRules(true)} onBlur={() => setShowPswdRules(false)}/>
                                    
                                    {showPswdRules && <PasswordRules pswd={password} />}
                            </div>
                            <div className="row mt-md-5">
                                <TextField id="email-field" variant="standard" fullWidth
                                        error = {pswdMatch !== undefined && !pswdMatch}
                                        color={pswdMatch ? "success" : "warning"}
                                        helperText = {pswdMatch !== undefined && !pswdMatch && "Your passwords do not match!"}
                                        value={confirmPswd}
                                        type="password"  label="Confirm Password" 
                                        onChange={(e) => handleConfirmPswd(e)} />
                            </div>
                        </div>
                        <div className="col-12 col-sm-11 col-md-1 col-lg-1 col-xl-2 mx-auto"></div>
                        <div className="row gutter-x-0">
                            <FormControlLabel 
                                required control={<Checkbox color="success"/>} 
                                label={"By continuing the registration, you hereby agree to this software's Terms and Conditions and its Privacy Policy."}
                                className="mx-auto p-0 m-0 text-start justify-content-center f-12 mt-5"
                                disableTypography
                            />
                        </div>
                        <div className="row gutter-x-0">
                            <Button label={"DONE!"} color={"green"} size="large" classes={"col-12 col-sm-6 col-md-3 mx-auto mt-5 bolder"} action = {handleSubmit} />
                        </div>
                    </div>
                    
                    
                </Box>
            </section>
        </div>
    )
}

export default SignUpPage;