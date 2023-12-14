import { useTheme } from '@mui/material/styles';
import { Dialog, DialogTitle, Snackbar, Switch, TextField, Typography, useMediaQuery } from "@mui/material";
import React, { useEffect, useState } from "react";
import Button from './Button';
import { createToDoItem } from '../firebase/db/todos';

function CreateToDoItem(props){
    const openCreateDialog = props.openCreateDialog;
    const setOpenCreateDialog = props.setOpenCreateDialog;

    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));
    const [itemDetails, setItemDetails] = useState({
        title: "", description:"", status:false
    });
    const [displayErrorMsg, setDisplayErrorMsg] = useState(false);
    const [wasCreated, setWasCreated] = useState(false);

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
   return (
    <Dialog fullScreen={fullScreen} open={openCreateDialog} fullWidth onClose={() => setOpenCreateDialog(false)}>
        {wasCreated && 
            <div>
                <DialogTitle color={"darkgreen"} className='text-center'>New item created!</DialogTitle>
            </div>
        }
        {!wasCreated &&
            <div>
                <DialogTitle>Create New To Do Item</DialogTitle>
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
                        <textarea name='desc-field' rows={5} className='p-3' placeholder='Your to do item description...' 
                                onChange={(e) => setItemDetails(prev => {return {...prev, description: e.target.value}})}
                        />
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