import React from "react";
import { useNavigate } from "react-router-dom";

function Button(props){

    const nav = useNavigate();
    

    // receives the path to which the user wants to go --- SHOULD BE PASSED IF href IS NOT PASSED
    const navigate = props.navigate;

    // receives the url to which the user wants to go --- SHOULD BE PASSED IF navigate IS NOT PASSED
    const href = props.href;

    // receives a function that will be executed when the button is clicked --- SHOULD BE PASSED IF navigate IS NOT PASSED
    const action = props.action;

    const label = props.label;
    let color;
    let size;
    const classes = props.classes || "";
    const value = props.value || "";
    switch(props.color){
        
        case 'light':
            color = "btn-light";
            break;
        case 'green':
            color = "btn-success";
            break;
        case 'red':
            color = "btn-danger";
            break;
        case 'black':
        default:
            color = "btn-dark";
            break;
    }
    switch(props.size){
        case 'large':
            size = "btn-lg";
            break;
        case 'medium':
            size = "btn-md";
            break;
        case 'small':
            size = "btn-sm";
            break;
        default:
            size = "btn-md";
            break;
    }
    
    if(navigate !== undefined){
        //button with path navigation
        return (
            <a className={`btn ${color} ${size} ${classes}`} onMouseUp={() => nav(navigate)} href="">{label}</a>  
        )
    }else if(href !== undefined){
        //button with href navigation
        return (
            <a className={`btn ${color} ${size} ${classes}`} href={`${href}`}>{label}</a>  
        )
    }else if(action !== undefined){
        //button with function execution
        return (
            <button value={value} className={`btn ${color} ${size} ${classes}`} onClick={(e) => e.preventDefault()} onMouseUp={(e) => {action(e)}}>{label}</button>     
        )
    }
}

export default Button;