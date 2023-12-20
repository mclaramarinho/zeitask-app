import React from "react";
import { Checkbox, IconButton } from "@mui/material";
import { NavigateNextOutlined} from "@mui/icons-material"

function ToDoItem(props){
    const item = props.item;
    const handleOpenDetails = props.handleOpenDetails;
    const handleSelection = props.handleSelection;
    
    

    return (
        <tr className="">
            <td className={`${handleOpenDetails ? "col-1" : "col-2"} text-center`}>
                <Checkbox defaultChecked={false} className="m-0" onChange={(e) => handleSelection(e, item.title)} />
            </td>
            <td className="col">
                {handleOpenDetails && <h5 className={`${props.completed && "completed-task"} my-auto`}>{item.title}</h5>}
                {!handleOpenDetails && <p className={`${props.completed && "completed-task"} my-auto`}>{item.title}</p>}
            </td>
            {handleOpenDetails && <td className="col-1 text-center">
                <IconButton onMouseUp={() => handleOpenDetails && handleOpenDetails(item)}><NavigateNextOutlined /></IconButton>
            </td>}
        </tr>
    )
}

export default ToDoItem;
