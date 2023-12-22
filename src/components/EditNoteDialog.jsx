import React, { useEffect, useState } from "react";
import { Dialog, IconButton, Switch, TextField, Typography, useMediaQuery } from "@mui/material";
import { DeleteOutline, Edit, Save } from "@mui/icons-material"
import { useTheme } from '@mui/material/styles';
import dayjs from "dayjs";
import { editNote } from "../firebase/db/notes";
function EditNoteDialog(props) {
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));
    
    
    // const handleEditMode = props.handleEditMode;
    const [editMode, setEditMode] = useState(false);
    let itemDetails = props.itemDetails;
    
    let [newItemDetails, setNewItemDetails] = useState(props.itemDetails);
    
    const [displayErrorMessage, setDisplayErrorMessage] = useState(false);

    const openEditDialog = props.openEditDialog;
    const setOpenEditDialog = props.setOpenEditDialog;
    const updateNotes = props.updateNotes;

    
    useEffect(() => {
    }, [])

    function handleCloseDialog(){
        setOpenEditDialog(false);
        //
    }    
    
    function handleEditMode(){
        if(!editMode){
            //start editing
            setEditMode(true);
        }else{
            //stop editing
            setEditMode(false);
            handleSubmit()
        }
    }

    function handleSubmit(){
        const updatedItem = {
            title: newItemDetails.title || newItemDetails.content.slice(0, 20),
            content: newItemDetails.content,
            date: dayjs().format("MM-DD-YYYY")
        }
        editNote(newItemDetails.key, updatedItem).then(() => {
            updateNotes();
            setDisplayErrorMessage(false);
        }).catch((err) => {
            setDisplayErrorMessage(true);
        })
    }


  return (
    <Dialog fullScreen={fullScreen} open={openEditDialog} fullWidth onClose={() => handleCloseDialog()}>
       
        <div className='container p-4'>
                <div className='row align-items-center gutter-x-0'>
                    <TextField
                        InputProps={{
                            readOnly: !editMode,
                            disableUnderline: !editMode,
                            style: { fontWeight: 600, fontSize: 22 },
                        }}
                        value={newItemDetails.title}
                        onChange={(e) => setNewItemDetails(prev => {return {...prev, title: e.target.value}})}
                        className="col-10"
                        variant="standard"
                        classes={"title-input"}
                        disabled={!editMode}
                    />
                     <IconButton className="col-1 m-auto" onMouseUp={() => handleEditMode()}>
                        {editMode ? <Save /> : <Edit />}
                    </IconButton>
                </div>
                
            
                <div className='row mt-5 gutter-x-0'>
                    <label htmlFor="desc-field">Content</label>
                    <textarea name='desc-field' value={newItemDetails.content} rows={10}
                            className='p-3 mt-1' placeholder='Your note content...' 
                            onChange={(e) => setNewItemDetails(prev => {return {...prev, content: e.target.value}})}
                            disabled={!editMode}
                    />
                </div>
                {displayErrorMessage && <p className="text-danger">Error updating note. Please try again.</p>}
        </div>
    </Dialog>
  );
}

export default EditNoteDialog;
