import React from "react";

function KanbanItem(props){
    const id = props.itemID;
    const text = props.text;
    function ondragevent(e){
        e.dataTransfer.setData("text/plain", e.target.id)
    }

    return <p id={id} className="row gutter-x-0 w-75 m-auto white-bg p-2" draggable onDragStart={(e) => ondragevent(e)}>{text}</p>
}

export default KanbanItem;