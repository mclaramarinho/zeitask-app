import React, { useEffect, useState } from "react";
import { Form, useParams } from "react-router-dom";
import NavBar from "../components/NavBar";
import { AppBar, Checkbox, Dialog, Divider, Fab, FormControlLabel, Icon, IconButton, InputBase, Paper, Popper, Radio, Select, Switch, TextField, TextareaAutosize, Toolbar, Typography } from "@mui/material";
import {Add, AddOutlined, AddSharp, AddTaskOutlined, CloseFullscreen, CloseOutlined, DeleteOutline, Edit, Label, LabelImportant, LabelImportantOutlined, NavigateNextOutlined, Save, Search, Tag, TagOutlined, TagRounded} from "@mui/icons-material"
import LabelImportantSharp from '@mui/icons-material/LabelImportantSharp';
import { changeToDoStatus, createToDoItem, deleteToDoItem, deleteUserToDoTag, getUserToDoTags, getUserToDos, updateToDoItem } from "../firebase/db/todos";
import Button from "../components/Button"    
import { preventLogout } from "../utils/preventLogout";
import EditToDoItem from "../components/EditToDoItem";
import ToDoItem from "../components/ToDoItem";
import CreateToDoItem from "../components/CreateToDoItem";
import CreateToDoTag from "../components/CreateToDoTag";
function ToDoPage(){
    const {id} = useParams();
    const [toDoList, setToDoList] = useState([]);
    const [result, setResult] = useState(toDoList);
    const [selected, setSelected] = useState([]);
    const [searchInput, setSearchInput] = useState([]);
    const [editMode, setEditMode] = useState(false);
    const [openDetails, setOpenDetails] = useState(false);
    const [itemDetails, setItemDetails] = useState({title: "", newTitle:"", description:"", status: false, tag:""})
    const [openCreateDialog, setOpenCreateDialog] = useState(false);
    const [tags, setTags] = useState([]);
    const [selectedTag, setSelectedTag] = useState(''); 
    const [isCreatingTag, setIsCreatingTag] = useState(false);
    const [isManagingTag, setIsManagingTags] = useState(false);

    useEffect(() => {
        preventLogout('todo')
        updateToDoList()
        getUserToDoTags().then(r => setTags(r))
    }, [])

    useEffect(() => {
        setResult(toDoList)
        setSelectedTag("")
        setSelected([])
    }, [toDoList])

    useEffect(() => {
    }, [result])

    useEffect(() => {
        !openCreateDialog && updateToDoList()
        
    }, [openCreateDialog])
    useEffect(() => {
        !isCreatingTag && getUserToDoTags().then(r => setTags(r))
    }, [isCreatingTag])
    
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

    function filterItemsByTag(e){
        if(selectedTag.length === 0 || selectedTag !== e.target.value){
            setSelectedTag(e.target.value);
            setResult(toDoList.filter(item => Object.keys(item.tag)[0] === e.target.value));
        }else{
            setSelectedTag('');
            setResult(toDoList);
        }
    }

    async function handleEditMode(){
        if(editMode){
            //update item in the database
            await updateToDoItem(itemDetails)
            await updateToDoList();
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
            status: item.status,
            tag: Object.keys(item).includes("tag") && Object.keys(item.tag)[0]
        })
    }
    async function handleCloseDetails(){
        setOpenDetails(false);
        setItemDetails({});
        setEditMode(false)
        await updateToDoList()
    }
    async function updateToDoList(){
        await getUserToDos(id)
        .then(v => {
            setToDoList(v)
            setResult(v)
        })
        .catch(err => {
            setToDoList([])
            setResult([])
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

    function updateTag(e){
        setItemDetails(prev => {return{...prev,tag: e.target.value}})
    }
    return(
        <div className="container-fluid p-0">
            <NavBar/>
            <div className="container position-fixed top-50 start-50 translate-middle h-75 shadow border-2 overflow-clip p-4" >
                <div className="row overflow-y-scroll direction-column-mobile">


                    <div className="col-12 mx-auto ms-md-0 me-md-0 col-md-3 col-lg-2 overflow-y-scroll hide-mobile">
                        <div className="row align-items-center">
                            <div className="col-10 col-md-8 text-md-start text-center bolder">
                                <LabelImportantSharp color="success" /> tags
                            </div>
                            <div className="col-2 col-md-3 m-auto my-2 p-0 text-center">
                                <button className="btn btn-sm btn-outline-dark p-0" onMouseUp={() => setIsCreatingTag(true)}><AddOutlined /></button>
                            </div>
                        </div>
                        
                        
                        <div className="row position-relative gutter-x-0">
                            {tags.map(tag => {
                                
                                let backgroundColor = tag.tagColor.split();
                                if(tag.tagName === selectedTag){
                                    backgroundColor[0] += "FF";
                                }else{
                                    backgroundColor[0] += "1A";
                                }
                                return(
                                    <div className="row align-items-center">
                                        <div onMouseUp={() => deleteUserToDoTag(tag.tagName).then(r => getUserToDoTags().then(a => setTags(a)))} className="col-1 gutter-x-0 pointer-cursor"><DeleteOutline /></div>
                                        <div className="col-4 m-auto col-md-10 my-2">
                                            <button value={tag.tagName}
                                                    className="btn btn-sm btn-outline bolder w-100"
                                                    onMouseUp={e => filterItemsByTag(e)}
                                                    style={{borderColor: tag.tagColor, backgroundColor: backgroundColor, wordBreak:"break-word"}}
                                                    >
                                                        {tag.tagName}
                                            </button>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                        
                    </div>

                    <div className="col-10 mx-auto ms-md-0 col-md-3 col-lg-5 mt-md-0 mt-4">
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
                    <div className="col-12 hide-medium" style={{height: "25%"}}></div>
                    {/* Details - medium to large devices */}
                    {openDetails &&(
                        <div className="col-12 col-md-6 col-lg-5 hide-mobile">
                            <EditToDoItem handleDeleteItem={handleDeleteItem} handleEditMode={handleEditMode} editMode={editMode}
                                            itemDetails={itemDetails} updateDescription={updateDescription} updateTitle={updateTitle}
                                            updateStatus={updateStatus} updateTag={updateTag} />
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
                        <EditToDoItem mobile handleDeleteItem={handleDeleteItem} handleEditMode={handleEditMode}
                                    editMode={editMode} itemDetails={itemDetails} updateDescription={updateDescription}
                                    updateTitle={updateTitle} updateStatus={updateStatus}
                                    updateTag={updateTag}  />
                    </Dialog>
                </div>
                
               
                
                <CreateToDoItem openCreateDialog={openCreateDialog} setOpenCreateDialog={setOpenCreateDialog} />
                

                <Fab onMouseUp={( ) => setOpenCreateDialog(true)} sx={{backgroundColor: "black", color: "white", position:"fixed", bottom: "4vh", right: "4vw"}}><AddTaskOutlined /></Fab>

            </div>
            <CreateToDoTag openCreateDialog={isCreatingTag} setOpenCreateDialog={setIsCreatingTag} />
        </div>
    )
}

export default ToDoPage;