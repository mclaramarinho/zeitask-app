import React from "react";
import NavBar from "../components/NavBar";

function KanbanPage(){
    return(
        <div className="container-fluid p-0">
            <NavBar />
            <div className="position-fixed top-50 start-50 translate-middle w-100 h-75">
            </div>
        </div>
    )
}

export default KanbanPage;