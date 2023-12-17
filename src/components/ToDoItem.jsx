import React from "react";
import { Checkbox, IconButton } from "@mui/material";
import { NavigateNextOutlined} from "@mui/icons-material"

function ToDoItem(props){
    const item = props.item;
    const handleOpenDetails = props.handleOpenDetails;
    const handleSelection = props.handleSelection;


    return (
        <tr>
            <td className="col-1 text-center">
                <Checkbox className="m-0" onChange={(e) => handleSelection(e, item.title)} />
            </td>
            <td>
                <h5 className={`${props.completed && "completed-task"}`}>{item.title}</h5>
            </td>
            <td className="col-1 text-center">
                <IconButton onMouseUp={() => handleOpenDetails(item)}><NavigateNextOutlined /></IconButton>
            </td>
        </tr>
    )
}

export default ToDoItem;