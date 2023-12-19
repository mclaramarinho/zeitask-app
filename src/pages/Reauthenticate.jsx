import React, { useEffect, useState } from "react";
import LogoHeader from "../components/LogoHeader";
import { Box, CircularProgress } from "@mui/material";
import {TextField} from "@mui/material";
import Button from "../components/Button";
import { changeEmail, getUsername, isUserSignedIn, signIn, whoIsSignedIn } from "../firebase/auth";
import { useNavigate, useParams } from "react-router-dom";
import Loader from "../components/Loader";
import { preventLogout } from "../utils/preventLogout";


function Reauthenticate(){
    const {action} = useParams();

    const [email, setEmail] = useState();
    const [pswd, setPswd] = useState();
    const [isSubmitted, setIsSubmitted] = useState(true);
    const [showLoader, setShowLoader] = useState(false);
    const navigate = useNavigate();


    async function submit(e){
        const result = await signIn(email, pswd).then(v => v);
        //if false show error message
        //if true show spinner
        setIsSubmitted(result);
        setShowLoader(result)
        if(result){
            const username = getUsername();

            if(action === "email"){
                const newEmail = sessionStorage.getItem("newEmail"); 
                await changeEmail(newEmail).then(r => console.log(r)).catch(e => console.log(e))  
                navigate(`/dashboard/${username}/profile`)
            }
        }
    }

    return(
        <div className="container-fluid">
            <LogoHeader />
            <section className="p-md-5 text-center">
                <h2 className="mb-5">REAUTHENTICATE</h2>
                <p>Let's confirm who you are before making any changes</p>
                <div className="row">
                    <div className="col-12 col-sm-1 col-md-3 col-lg-4 col-xxl-5"></div>

                    <Box component={"form"} autoSave className="col-12 col-sm-10 col-md-6 col-lg-4 col-xxl-2">

                        <TextField id="email-field" variant="standard" fullWidth
                                    value={email}
                                    type="email"  label="Email" className="mb-4" 
                                    onChange={(e) => setEmail(e.target.value)}/>
                        <TextField id="pswd-field" variant="standard" fullWidth
                                    value={pswd}
                                    type="password" label="Password" className="mb-4"
                                    onChange={(e) => setPswd(e.target.value)}/>

                        {!isSubmitted && <p>Ooops... It seems like your info invalid.</p>}

                        {!showLoader && <Button color="black" size="medium" label="LOGIN" action={submit}/>}
                        {!showLoader && <a href="/signup" className="row justify-content-center gutter-x-0 color-black mt-3">Create an account!</a> }
                        {showLoader && <Loader />}
                    </Box>  

                    <div className="col-12 col-sm-1 col-md-3 col-lg-4 col-xxl-5"></div>
                </div>
            </section>
        </div>
    )
}

export default Reauthenticate;