import React from "react";
import { useParams } from "react-router-dom";
import NavBar from "../components/NavBar";
import Button from "../components/Button";

function Dashboard(){
    const {id} = useParams();

    function dummy(){
        console.log("a")
    }



    return (
        <div className="container-fluid p-0">
            <NavBar/>
            <div className="container">

                <div className="row">
                    <div className="col-12 col-md-6">
                        <div className="row">
                            <div className="col-12 col-sm-10 col-md-6 text-center">
                                <Button color="black" label="START" size="medium" action={dummy} classes="row w-75 justify-content-center m-auto mt-2" />
                                <Button color="black" label="ALL TO DOS" size="medium" action={dummy} classes="row w-75 justify-content-center m-auto mt-2" />
                            </div>
                        </div>
                    </div>
                    <div className="col col-md-6">
                        
                        <div className="row">
                            <div className="col col-sm-10 col-md-6">
                            </div>
                        </div>

                    </div>

                </div>
               
            </div>
        </div>
    )
}

export default Dashboard;