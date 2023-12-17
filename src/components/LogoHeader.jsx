import React from "react";
import logo from '../assets/zeitask-logo-no-bg.png'

function LogoHeader(){
    return(
        <div className="py-5 text-center position-relative">
            <img src={logo} alt="Zeitask logo" className="m-auto position-relative MW-90"/>
        </div> 
    )
}

export default LogoHeader;