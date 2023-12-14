import React, { useEffect, useState } from "react";
import LogoHeader from "../components/LogoHeader";
import { Box, CircularProgress } from "@mui/material";
import {TextField} from "@mui/material";
import Button from "../components/Button";
import { getUserInfo, isUserSignedIn, signIn, whoIsSignedIn } from "../firebase/auth";
import { useNavigate } from "react-router-dom";
import Loader from "../components/Loader";
import { preventLogout } from "../utils/preventLogout";


function LoginPage(){
    const [email, setEmail] = useState();
    const [pswd, setPswd] = useState();
    const [isSubmitted, setIsSubmitted] = useState(true);
    const [showLoader, setShowLoader] = useState(false);
    const [isSignedIn, setIsSignedIn] = useState(false)
    const navigate = useNavigate();

    useEffect(() =>{
        preventLogout('login', setIsSignedIn).then(r => navigate(r))
    }, [])

    async function submit(e){
        const result = await signIn(email, pswd).then(v => v);
        //if false show error message
        //if true show spinner
        setIsSubmitted(result);
        setShowLoader(result)
        if(result){
            const username = getUserInfo();
            navigate(`/dashboard/${username}`)
        }
    }

    return(
        <div className="container-fluid">
            <LogoHeader />
            <section className="p-md-5 text-center">
                <h2 className="mb-5">LOGIN</h2>
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
                        {showLoader && <Loader />}
                    </Box>  

                    <div className="col-12 col-sm-1 col-md-3 col-lg-4 col-xxl-5"></div>
                </div>
            </section>
        </div>
    )
}

export default LoginPage;