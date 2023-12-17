import { CircularProgress } from "@mui/material";
import React from "react";

function Loader(){
    return <CircularProgress size={100} sx={{color: "black"}} className="m-auto" />
} 
export default Loader;