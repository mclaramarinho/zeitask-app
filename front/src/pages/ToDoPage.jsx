import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import NavBar from "../components/NavBar";
import { AppBar, Checkbox, Dialog, Divider, Fab, FormControlLabel, Icon, IconButton, InputBase, Paper, Switch, TextField, TextareaAutosize, Toolbar, Typography } from "@mui/material";
import {Add, CloseFullscreen, CloseOutlined, DeleteOutline, Edit, LabelImportant, NavigateNextOutlined, Save, Search} from "@mui/icons-material"
import { changeToDoStatus, createToDoItem, deleteToDoItem, getUserToDos, updateToDoItem } from "../firebase/db/todos";
import Button from "../components/Button"    
import { preventLogout } from "../utils/preventLogout";
import EditToDoItem from "../components/EditToDoItem";
import ToDoItem from "../components/ToDoItem";
import CreateToDoItem from "../components/CreateToDoItem";
function ToDoPage(){
    const {id} = useParams();
    const [toDoList, setToDoList] = useState([]);
    const [result, setResult] = useState(toDoList);
    const [selected, setSelected] = useState([]);
    const [searchInput, setSearchInput] = useState([]);
    const [editMode, setEditMode] = useState(false);
    const [openDetails, setOpenDetails] = useState(false);
    const [itemDetails, setItemDetails] = useState({title: "", newTitle:"", description:"", status: false})
    const [openCreateDialog, setOpenCreateDialog] = useState(false);

    useEffect(() => {
        preventLogout('todo')
        updateToDoList()
    }, [])

    useEffect(() => {
        setResult(toDoList)
    }, [toDoList])
    useEffect(() => {
        !openCreateDialog && updateToDoList()
        
    }, [openCreateDialog])
    
    function handleSelection(e, title){
        if(e.target.checked){
            setSelected(prev =>{
                return[...prev, title]
            })
        }else{
            setSelected(selected.filter(item => item !== title))
        }
    }

    function handleSelected(){
        selected.map(title => {
            const status = toDoList.filter(item => item.title === title)[0].status
            changeToDoStatus(title, !status).then(r=>{
                getUserToDos(id)
                .then(r=>setToDoList(r))
                .catch(err => setToDoList([]))
            })
        })

        setSelected([])
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

    function handleEditMode(){
        if(editMode){
            console.log("ended editing")
            //update item in the database
            updateToDoItem(itemDetails)
        }
        
        setEditMode(!editMode);
        
    }

    function handleDeleteItem(){
        deleteToDoItem(itemDetails.title)
        updateToDoList()
    }

    function handleOpenDetails(item){
        updateToDoList()
        setOpenDetails(true);
        setItemDetails({
            title: item.title,
            newTitle: item.title,
            description: item.description,
            status: item.status
        })
    }
    function handleCloseDetails(){
        setOpenDetails(false);
        setItemDetails({});
        setEditMode(false)
        updateToDoList()
    }
    function updateToDoList(){
        getUserToDos(id)
        .then(v => {
            setToDoList(v)
            setResult(v)
        })
        .catch(err => {
            setToDoList([])
        })
    }
    function updateTitle(e){
        setItemDetails(prev => {return {...prev,newTitle: e.target.value,}})
    }

    function updateDescription(e){
        setItemDetails(prev => {return{...prev,description: e.target.value,}})
    }

    function updateStatus(e){
        setItemDetails(prev => {return{...prev,status: e.target.checked}})
    }

    function handleNewCardCreation(){

    }

    return(
        <div className="container-fluid p-0">
            <NavBar/>
            <div className="container position-fixed top-50 start-50 translate-middle h-75">
                <div className="row h-100">

                    <div className="col-10 mx-auto col-md-6">
                        {/* search card */}
                        <div className="row">
                            <Paper className="d-flex justify-items-center">
                                <InputBase value={searchInput} fullWidth placeholder="Search items by keywords..." onChange={(e) => handleSearch(e)}/>
                                <IconButton><Search /></IconButton>
                                <Divider orientation="vertical" />
                            </Paper>
                        </div>
                        {/* Button that will appear only when theres a card selected */}
                        
                        {selected.length > 0 && <div className="row mt-4">
                            <Button action={handleSelected} label="Change status of selected items" size="small" color="light" classes="w-50 m-auto" />
                        </div>}

                        {/* View list of items - option to select and mark as done - option to see details */}
                        <div className="row gutter-x-0 mt-5">
                            <table>
                                {/* Show uncompleted items */}
                                {result.map((item) => {
                                    if(!item.status){
                                        return (
                                            <ToDoItem item={item} handleSelection={handleSelection} handleOpenDetails={handleOpenDetails} />
                                        )
                                    }
                                })}
                                {/* Show completed Items */}
                                {result.map((item) => {
                                    if(item.status){
                                        return (
                                            <ToDoItem completed item={item} handleSelection={handleSelection} handleOpenDetails={handleOpenDetails} />
                                        )
                                    }
                                })}
                            </table>
                        </div>
                    </div>

                    {/* Details - medium to large devices */}
                    {openDetails &&(
                        <div className="col-12 col-md-6 hide-mobile">
                            <EditToDoItem handleDeleteItem={handleDeleteItem} handleEditMode={handleEditMode} editMode={editMode} itemDetails={itemDetails} updateDescription={updateDescription} updateTitle={updateTitle} updateStatus={updateStatus} />
                        </div>
                    )}

                    {/* Details - small to medium devices */}
                    <Dialog fullScreen open={openDetails} onClose={() =>handleCloseDetails()} className="hide-medium">
                        <AppBar position="relative" sx={{backgroundColor: "black"}}>
                            <Toolbar>
                                <IconButton onMouseUp={() => handleCloseDetails()}>
                                    <CloseOutlined sx={{color: "white"}} />
                                </IconButton>
                            </Toolbar>
                        </AppBar>
                        <EditToDoItem mobile handleDeleteItem={handleDeleteItem} handleEditMode={handleEditMode} editMode={editMode} itemDetails={itemDetails} updateDescription={updateDescription} updateTitle={updateTitle} updateStatus={updateStatus} />
                    </Dialog>
                </div>
                
               
                
                <CreateToDoItem openCreateDialog={openCreateDialog} setOpenCreateDialog={setOpenCreateDialog} />
                
                {/* list of to do items */}

                
            </div>
            <Fab onMouseUp={( ) => setOpenCreateDialog(true)} sx={{backgroundColor: "black", color: "white", position:"fixed", bottom: "4vh", right: "4vw"}}><Add /></Fab>
        </div>
    )
}

export default ToDoPage;