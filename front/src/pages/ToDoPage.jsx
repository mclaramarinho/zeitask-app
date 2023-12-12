import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import NavBar from "../components/NavBar";
import { Checkbox, Divider, Fab, FormControlLabel, Icon, IconButton, InputBase, Paper, SpeedDial, SpeedDialAction, SpeedDialIcon } from "@mui/material";
import {Add, Check, CheckBox, Delete, DeleteOutline, Edit, NavigateNextOutlined, NextPlan, Search} from "@mui/icons-material"
import { getUserToDos } from "../firebase/db";

function ToDoPage(){
    const {id} = useParams();
    const [toDoList, setToDoList] = useState([]);
    const [result, setResult] = useState(toDoList);
    const [selected, setSelected] = useState([]);
    const [searchInput, setSearchInput] = useState([]);
    
    useEffect(() => {
        getUserToDos(id)
        .then(v => {
            setToDoList(v)
            setResult(v)
        })
        .catch(err => {
            setToDoList([])
        })
    }, [])
    
    function handleSelection(e, title){
        if(e.target.checked){
            setSelected(prev =>{
                return[...prev, title]
            })
        }
    }

    function handleSearch(e){
        setSearchInput(e.target.value)
        filterItems(e.target.value)
    }

    function filterItems(query){
        if(query.length === 0){
            setResult(toDoList)
        }else{
            setResult(toDoList.filter(item => {
                if(item.title.includes(query) || item.description.includes(query)){
                    return item
                }
            }))
        }
    }

    return(
        <div className="container-fluid p-0">
            <NavBar/>
            <div className="container position-fixed top-50 start-50 translate-middle h-75">
                <div className="row h-100">

                    <div className="col-12 col-md-6">
                        {/* search card */}
                        <div className="row">
                            <Paper className="d-flex justify-items-center">
                                <InputBase value={searchInput} fullWidth placeholder="Search items by keywords..." onChange={(e) => handleSearch(e)}/>
                                <IconButton><Search /></IconButton>
                                <Divider orientation="vertical" />
                            </Paper>
                        </div>
                        {/* View list of items - option to select and mark as done - option to see details */}
                        <div className="row gutter-x-0 mt-5">
                            <table>
                                {/* Show uncompleted items */}
                                {result.map((item, index) => {
                                    if(!item.status){
                                        return (
                                            <tr>
                                                <td className="col-1 text-center">
                                                    <Checkbox className="m-0" value={index} onChange={(e) => handleSelection(e, item.title)} />
                                                </td>
                                                <td>
                                                    <h5>{item.title}</h5>
                                                </td>
                                                <td className="col-1 text-center">
                                                    <IconButton><NavigateNextOutlined /></IconButton>
                                                </td>
                                            </tr>
                                        )
                                    }
                                })}
                                {/* Show completed Items */}
                                {result.map((item, index) => {
                                    if(item.status){
                                        return (
                                            <tr>
                                                <td className="col-1 text-center">
                                                    <Checkbox className="m-0" value={index} onChange={(e) => handleSelection(e, item.title)} />
                                                </td>
                                                <td>
                                                    <h5 className={"completed-task"}>{item.title}</h5>
                                                </td>
                                                <td className="col-1 text-center">
                                                    <IconButton><NavigateNextOutlined /></IconButton>
                                                </td>
                                            </tr>
                                        )
                                    }
                                })}
                            </table>
                        </div>
                    </div>

                    {/* Details */}
                    <div className="col-12 col-md-6 hide-mobile">
                        <div className="row">
                            <h3 className="col-10 my-auto">Task</h3>
                            <IconButton className="col-1 me-0"><Edit /></IconButton>
                            <IconButton className="col-1 me-0"><DeleteOutline /></IconButton>
                            
                        </div>
                    </div>
                </div>
                
               
                
                
                
                {/* list of to do items */}

                
            </div>
            <Fab sx={{backgroundColor: "black", color: "white", position:"fixed", bottom: "4vh", right: "4vw"}}><Add /></Fab>
        </div>
    )
}

export default ToDoPage;