import React, { useState } from "react";
import KanbanItem from "./KanbanItem";
import { child } from "firebase/database";

function KanbanList(props){
    const [children, setChildren] = useState(props.itemsList || []);

    // to do - doing - done
    const type = props.type;

    let labelColor;
    let label;
    let containerBG;
    let id;
    let listID;
    switch(type){
        case "to-do":
            labelColor = "light-red-bg";
            containerBG = "peachy-bg";
            label = "TO DO";
            id = "to-do-container";
            listID = "to-do-list";
            break;
        case "doing":
            labelColor = "yellow-bg";
            containerBG = "light-yellow-bg";
            label = "DOING";
            id = "doing-container";
            listID = "doing-list";
            break;
        case "done":
            labelColor = "green-bg";
            containerBG = "light-green-bg";
            label = "DONE";
            id = "done-container";
            listID = "done-list";
            break;
    }

    

    function ondropevent(e){
        const data = e.dataTransfer.getData("text/plain")

        const childrenNodes = document.getElementById(id).childNodes[1].childNodes;
        for (let i = 0; i < childrenNodes.length; i++) {
            console.log(childrenNodes[i])
            setChildren(prev => {
                return [prev, childrenNodes[i]]
            })            
        }
        const targetID = e.target.id;

        switch(targetID){
            case "done-container":
                document.getElementById("done-list").appendChild(document.getElementById(data));
                break;
            case "doing-container":
                document.getElementById("doing-list").appendChild(document.getElementById(data));
                break;
            case "to-do-container":
                document.getElementById("to-do-list").appendChild(document.getElementById(data));
                break;
        }
    }

    return(
        <div id={id} className={`col-10 col-md-3 mx-auto my-md-0 my-5 p-0 ${containerBG} color-white kanban-container`} onDragOver={(e)=> e.preventDefault()} onDrop={(e) => ondropevent(e)}>
            <h4 className={`${labelColor}`}>{label}</h4>

            <div id={listID} className="row gutter-x-0 row-gap-5 color-black">
                {children.map((item, index) => {
                    return <KanbanItem itemID={"task"+(Math.ceil(Math.random()*1000)+index)} text={item.value} />
                })}
            </div>
        </div>
    )

}

export default KanbanList;