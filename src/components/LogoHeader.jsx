import React from "react";
import logo from '../assets/zeitask-logo-no-bg.png'
import { useNavigate } from "react-router-dom";

function LogoHeader(){
    const navigate = useNavigate();
    return(
        <div className="py-5 text-center position-relative">
            <img onMouseUp={()=>navigate('/')} src={logo} alt="Zeitask logo" className="m-auto position-relative MW-90"/>
        </div> 
    )
}

export default LogoHeader;