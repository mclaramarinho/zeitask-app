import { useTheme } from '@mui/material/styles';
import { AppBar, Dialog, DialogTitle, IconButton, Snackbar, Switch, TextField, Typography, useMediaQuery } from "@mui/material";
import React, { useEffect, useState } from "react";
import Button from './Button';
import { createToDoItem, getUserToDoTags } from '../firebase/db/todos';
import { Close } from '@mui/icons-material';
import dayjs from 'dayjs';
import { createNewNote } from '../firebase/db/notes';


function CreateNoteDialog (props){
    const openCreateDialog = props.openCreateDialog;
    const setOpenCreateDialog = props.setOpenCreateDialog;
    const updateNotes = props.updateNotes;

    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));
    const [itemDetails, setItemDetails] = useState({
        title: "", content:"", date:""
    });

    const [displayErrorMsg, setDisplayErrorMsg] = useState(false);
    const [isContentEmpty, setIsContentEmpty] = useState(false);    
    
    const [wasCreated, setWasCreated] = useState(false);

    useEffect(() => {
    }, [])
    
    useEffect(() => {
        
    }, [itemDetails])
    
    async function handleSubmit(){
        
        if(itemDetails.content.length === 0){
            setIsContentEmpty(true);
            return;
        }else{
            setIsContentEmpty(false)
        }

        let newObject = {title: "", content: itemDetails.content, date: dayjs().format("MM-DD-YYYY")};
        if(itemDetails.title.length === 0){
            newObject.title = itemDetails.content.slice(0, 20);
        }else{
            newObject.title = itemDetails.title;
        }
        return createNewNote(newObject).then((r) => {updateNotes(); setWasCreated(r); setDisplayErrorMsg(!r)});
    }
    

    function handleCloseDialog(){
        setOpenCreateDialog(false);
        setWasCreated(false);
        setItemDetails({title: "", content:"", date: ""});
        updateNotes();
    }
   return (
    <Dialog fullScreen={fullScreen} open={openCreateDialog} fullWidth onClose={() => handleCloseDialog()}>
        {wasCreated && 
            <div className='row w-100'>
                <DialogTitle color={"darkgreen"} className='text-center col-11'>New note created!
                
                </DialogTitle>
                <IconButton onMouseUp={() => handleCloseDialog()} className='p-0 col-1'>
                        <Close />
                    </IconButton>
            </div>
        }
        {!wasCreated &&
            <div className=''>
                <div className='container px-4 py-4'>
                    <div className='row align-items-center p-1'>
                        <DialogTitle className='col-11 p-0' fontWeight={600}>CREATE NEW NOTE</DialogTitle>
                        <IconButton onMouseUp={() => handleCloseDialog()} className='col-1 h-100 p-0'>
                            <Close />
                        </IconButton>
                    </div>
                    
                </div>
                
                <div className='container p-4'>
                    <div className='row gutter-x-0'>
                        <label htmlFor="title-field">Title</label>
                        <TextField name='title-field' value={itemDetails.title}
                                    onChange={(e) => setItemDetails(prev => {return {...prev, title: e.target.value}})}
                        />
                    </div>
                    <div className='row mt-5 gutter-x-0'>
                        <label htmlFor="desc-field">Content</label>
                        <textarea name='desc-field' rows={10} className='p-3 mt-1' placeholder='Your note content...' 
                                value={itemDetails.content}
                                onChange={(e) => setItemDetails(prev => {return {...prev, content: e.target.value}})}
                        />
                        {isContentEmpty && <p className="text-danger">Content cannot be empty.</p>}
                    </div>
                    
                    <div className="row mt-5">
                        
                        <div className='col-6 m-auto text-center'>
                            <Button action={handleSubmit} label="Create" size="sm" color="green" />
                        </div>
                        {displayErrorMsg && <p className="text-center text-danger mt-2">Error creating note. Please try again.</p>}
                    </div>
                </div>
            </div>
        }

    </Dialog>
   )
    
}

export default CreateNoteDialog;