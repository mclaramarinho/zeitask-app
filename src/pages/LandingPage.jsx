import React from "react";
import Button from "../components/Button";
import LogoHeader from "../components/LogoHeader";


function LandingPage(){
    return (
        <div className="container-fluid">
            <LogoHeader />

            <section className="p-md-5 text-center">
                
                <div className="container-md">
                    <h1 className="row justify-content-center">Simplify Task Management!</h1>
                    <div className="row">
                        <h4 className="col col-md-6 col-lg-5 m-auto mt-4 normal">
                            Fed up with complex task management tools? Say hello to Zeitask, 
                            a straightforward web app that simplifies your daily workflow without the unnecessary frills.
                        </h4>
                    </div>
                </div>
                
                <div className="mt-5">
                    <Button color="black" size="large" label="LOGIN" navigate={"/login"} />

                    <h5 className="mt-5">Still don't have an account?</h5>
                    <Button color="green" size="medium" label="REGISTER NOW" navigate={"/signup"}/>
                    <h6 className="light mt-2">It's 100% free!</h6>
                </div>
            </section>
            
        </div>    
        )
}

export default LandingPage;