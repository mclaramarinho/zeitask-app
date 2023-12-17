import React, { useState } from "react";
import NavBar from "../components/NavBar";
import KanbanList from "../components/kanban/KanbanList";

function KanbanPage(){
    
    const [todo, setTodo] = useState(["to do 1", "to do 2", "to do 3"]);
    const [doing, setDoing] = useState(["to do 4", "to do 5", "to do 6"]);
    const [done, setDone] = useState(["to do 7", "to do 8", "to do 9"]);

    const allKanbanContainers = Array.from(document.getElementsByClassName('kanban-container'));

    // allKanbanContainers.forEach(element => {
    //     element.addEventListener("drop", (e) =>{
    //         const parentID = e.target.id;
    //         let targetChildren = document.getElementById(parentID).childNodes[1].childNodes;
    //         targetChildren = document.getElementById(parentID).childNodes[1].childNodes;
            
    //         targetChildren.forEach(item => {
    //             console.log(item.textContent)
    //         })
    //             // if(parentID === "to-do-container"){

    //             // }
    //     })
    // });
   

    return(
        <div className="container-fluid p-0">
            <NavBar />
            <div className="position-fixed top-50 start-50 translate-middle w-100 h-75">
                <div className="row w-100 h-75 position-relative translate-middle start-50 top-50 mx-auto text-center">
                    <KanbanList type="to-do" itemsList={todo} />
                    <KanbanList type="doing" itemsList={doing} />
                    <KanbanList type="done" itemsList={done} />
                </div>
            </div>
        </div>
    )
}

export default KanbanPage;