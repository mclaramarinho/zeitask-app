import React, { useEffect, useState } from "react";
import NavBar from "../components/NavBar";
import { Search } from "@mui/icons-material";
import { Divider, Fab, Icon, IconButton, InputBase, Paper } from "@mui/material";
import { Edit, Delete, NoteAddOutlined } from "@mui/icons-material";
import { deleteNote, getUserNotes } from "../firebase/db/notes";
import EditNoteDialog from "../components/EditNoteDialog.jsx";
import CreateNoteDialog from "../components/CreateNoteDialog.jsx";

function NotesPage() {
    const [notes, setNotes] = useState([]);
    const [filterValue, setFilterValue] = useState("");
    const [openDetails, setOpenDetails] = useState(false);
    const [openCreateDialog, setOpenCreateDialog] = useState(false);
    const [noteDetails, setNoteDetails] = useState({key: "", title: "", content: "", date: "" });
    const [noteToEdit, setNoteToEdit] = useState({key: "", title: "", content: "", date: "" });

    useEffect(() => {
        updateNotes();
    }, [])
    useEffect(() => {
        
    }, [notes])

    function handleFilter(e){
        setFilterValue(e.target.value);
    }

    function handleDelete(key){
        //delete note from db
        //delete note from state
    }
    function handleOpenDetails(item){
        // console.log(item)
        setNoteDetails({key: item[0], title: item[1].title, content: item[1].content, date: item[1].date});
        //open note details dialog
        setOpenDetails(true);
    }

    async function updateNotes(){
        await getUserNotes().then((notes) => setNotes(Object.entries(notes))).catch((err) => setNotes([]));
    }

    return(
        <div className="container-fluid p-0 h-100">
            <NavBar />
            <div className="container position-fixed top-50 start-50 translate-middle h-75 shadow border-2 overflow-clip p-4" >
                    
                    <div className="row">
                        <div className="row">
                            <div className="col-md-3"></div>
                            <div className="col-12 m-auto col-md-6">
                                <Paper className="d-flex justify-items-center">
                                    <InputBase className="px-2" value={filterValue} onChange={(e) => handleFilter(e)} fullWidth placeholder="Search notes by keywords..." />
                                    <IconButton><Search /></IconButton>
                                    <Divider orientation="vertical" />
                                </Paper>
                            </div>
                            <div className="col-md-3"></div>
                        </div>
                        

                        <div className="row py-4">
                            {
                                notes.map(item => {
                                    const noteValues = item[1];
                                    let contentToDisplay = () => <p onMouseUp={() => handleOpenDetails(item)} className="card-text col">{noteValues.content}</p>;
                                    if(noteValues.content.length > 30){
                                        contentToDisplay =()=> <p onMouseUp={() => handleOpenDetails(item)} className="card-text">{noteValues.content.slice(0,30)} <span className="pointer-cursor" style={{fontSize: 12}}>[...]</span></p>;
                                    }
                                    return(
                                        <div className="col-12 col-md-6 col-lg-4 my-2" key={item[0]}>
                                            <div className="card pointer-cursor">
                                                <div className="card-body row gutter-x-0">
                                                    <div className="card-title row gutter-x-0 align-items-center">
                                                        <h5 className="col">{noteValues.title.slice(0, 20)}</h5>
                                                        <IconButton onMouseUp={() => {deleteNote(item[0]); updateNotes()}} className="col-1"><Delete /></IconButton>
                                                    </div>
                                                    {contentToDisplay()}
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })
                            }
                        </div>
                    </div>
                    <Fab onMouseUp={() => setOpenCreateDialog(true)} sx={{backgroundColor: "black", color: "white", position:"fixed", bottom: "4vh", right: "4vw"}}>
                        <NoteAddOutlined />
                    </Fab>


                    {/* note details dialog */}
                    {openDetails && <EditNoteDialog openEditDialog={openDetails} setOpenEditDialog={setOpenDetails} itemDetails={noteDetails} updateNotes={updateNotes} />}
                    {/* create note dialog */}
                    {openCreateDialog && <CreateNoteDialog openCreateDialog={openCreateDialog} setOpenCreateDialog={setOpenCreateDialog} itemDetails={{key: "", title: "", content: "", date: "" }} updateNotes={updateNotes} />}
            </div>
        </div>
    );
}

export default NotesPage;