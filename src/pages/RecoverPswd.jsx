import React, { useState } from "react";
import LogoHeader from "../components/LogoHeader";
import { Box, TextField } from "@mui/material";
import Loader from "../components/Loader";
import { checkRegex } from "../utils/checkRegex";
import { checkEmailAvailability } from "../firebase/db/user";
import { sendRecoveryLink } from "../firebase/auth";
import Button from "../components/Button";

function RecoverPswd(){
    const [email, setEmail] = useState("");
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [showLoader, setShowLoader] = useState(false);
    const [isEmailValid, setIsEmailValid] = useState(true);
    const [emailExists, setEmailExists] = useState(true);

    function submit(){
        setShowLoader(true);
        setIsSubmitted(false)

        if(checkRegex("email", email)){
            setIsEmailValid(true);
            //check if email exists
            checkEmailAvailability(email).then(async (res) => {
                if(res){
                    setEmailExists(false);
                    setShowLoader(false);
                }else{
                    setEmailExists(true);
                    await sendRecoveryLink(email).then(r => console.log(r)).catch(e => console.log("error"));
                    setShowLoader(false);
                    setIsSubmitted(true)
                }
            })
        }else{
            setIsEmailValid(false);
            setShowLoader(false);
        }
    }
    return (
        <div className="container-fluid">
            <LogoHeader />
            <section className="p-md-5 text-center">
                <h2 className="mb-5">RECOVER YOUR PASSWORD</h2>
                <p>Insert your registered email to receive a recovery link</p>
                <div className="row">
                    <div className="col-12 col-sm-1 col-md-3 col-lg-4 col-xxl-5"></div>

                    <Box component={"form"} autoSave className="col-12 col-sm-10 col-md-6 col-lg-4 col-xxl-2">

                        <TextField id="email-field" variant="standard" fullWidth
                                    value={email}
                                    type="email"  label="Your email" className="mb-4" 
                                    onChange={(e) => setEmail(e.target.value)}/>
                        

                        {!isEmailValid && <p>Ooops... This email is not in the correct format</p>}
                        {!emailExists && <p>Ooops... This email is not registered</p>}
                        {isSubmitted && <p>Check your email for the recovery link</p>}

                        {!showLoader && <Button color="black" size="medium" label={!isSubmitted ? "SEND EMAIL" : "SEND ANOTHER EMAIL"} action={submit}/>}
                        {!showLoader && <a className="row justify-content-center mt-4 text-black no-decoration" href="/login">Back to login</a>}
                        {showLoader && <Loader />}
                    </Box>  

                    <div className="col-12 col-sm-1 col-md-3 col-lg-4 col-xxl-5"></div>
                </div>
            </section>
        </div>
    )
}

export default RecoverPswd;