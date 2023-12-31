import { useTheme } from '@mui/material/styles';
import { AppBar, Dialog, DialogTitle, IconButton, Snackbar, Switch, TextField, Typography, useMediaQuery } from "@mui/material";
import React, { useEffect, useState } from "react";
import Button from './Button';
import { createToDoItem, getUserToDoTags } from '../firebase/db/todos';
import { Close } from '@mui/icons-material';
function CreateToDoItem(props){
    const openCreateDialog = props.openCreateDialog;
    const setOpenCreateDialog = props.setOpenCreateDialog;

    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));
    const [itemDetails, setItemDetails] = useState({
        title: "", description:"", status:false, tag: ""
    });
    const [displayErrorMsg, setDisplayErrorMsg] = useState(false);
    const [wasCreated, setWasCreated] = useState(false);
    const [tags, setTags] = useState([]);

    useEffect(() => {
      getUserToDoTags().then(r => setTags(r))
    }, [])
    
    function handleSubmit(){
        if(itemDetails.title.length > 0){
            createToDoItem(itemDetails)
            setWasCreated(true)
            
        }else{
            setDisplayErrorMsg(true)
        }
    }
    useEffect(() => {
        if(itemDetails.title.length > 0){
            setDisplayErrorMsg(false);
        }
    }, [itemDetails])

    function handleCloseDialog(){
        setOpenCreateDialog(false);
        setWasCreated(false);
        setItemDetails({title: "", description:"", status:false, tag: ""});
    }
   return (
    <Dialog fullScreen={fullScreen} open={openCreateDialog} fullWidth onClose={() => handleCloseDialog()}>
        {wasCreated && 
            <div>
                <DialogTitle color={"darkgreen"} className='text-center'>New item created!</DialogTitle>
            </div>
        }
        {!wasCreated &&
            <div className=''>

                <div className='container px-4 py-4'>
                    <div className='row align-items-center p-1'>
                        <DialogTitle className='col-11 p-0' fontWeight={600}>CREATE NEW TO DO</DialogTitle>
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
                        {displayErrorMsg && <p>This field is required.</p>}
                    </div>
                    <div className='row mt-5 gutter-x-0'>
                        <label htmlFor="desc-field">Description</label>
                        <textarea name='desc-field' rows={5} className='p-3 mt-1' placeholder='Your to do item description...' 
                                onChange={(e) => setItemDetails(prev => {return {...prev, description: e.target.value}})}
                        />
                    </div>
                    <div className='row mt-5 gutter-x-0'>
                        <label htmlFor="desc-field">Select a tag</label>
                        <select onChange={(e) => setItemDetails(prev => {return {...prev, tag: e.target.value}})} className='form-select' name="" id="">
                            {tags.length > 0 && tags.map(tag => {
                                return <option style={{backgroundColor: tag.tagColor+"BF"}} value={tag.tagName}>{tag.tagName}</option>
                            })}
                        </select>
                    </div>
                    <div className="row mt-5">
                        <div className="col-6">
                            <label htmlFor="status-field">Task Status</label>
                            <br />
                            <Switch
                                name='status-field'
                                checked={itemDetails.status}
                                onChange={(e) => setItemDetails(prev => {return {...prev, status: e.target.checked}})}
                            />
                            <Typography variant="caption" className="">
                                {itemDetails.status ? "Done" : "Not done yet"}
                            </Typography>
                        </div>
                        <div className='col-6 text-end align-self-end'>
                            <Button action={handleSubmit} label="Confirm" size="sm" color="green" />
                        </div>
                    </div>
                </div>
            </div>
        }

    </Dialog>
   )
    
}

export default CreateToDoItem;