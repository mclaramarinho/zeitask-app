import { useTheme } from '@mui/material/styles';
import { AppBar, Dialog, DialogTitle, IconButton, Snackbar, Switch, TextField, Typography, useMediaQuery } from "@mui/material";
import React, { useEffect, useState } from "react";
import Button from './Button';
import { createToDoItem, createUserToDoTag, getUserToDoTags } from '../firebase/db/todos';
import { Close } from '@mui/icons-material';
import { MuiColorInput } from 'mui-color-input';

function CreateToDoTag(props){
    const openCreateDialog = props.openCreateDialog;
    const setOpenCreateDialog = props.setOpenCreateDialog;
    

    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));

    const [tagDetails, setTagDetails] = useState({
        tagName: "", tagColor:""
    });
    const [isNameEmpty, setIsNameEmpty] = useState(false);
    const [isNameAvailable, setIsNameAvailable] = useState(true);
    const [isColorAvailable, setIsColorAvailable] = useState(true);

    const [wasCreated, setWasCreated] = useState(false);

    async function handleSubmit(){
        if(tagDetails.tagName.length === 0){
            setIsNameEmpty(true);
            return;
        }else{
            setIsNameEmpty(false);
            let existingTags = await getUserToDoTags();
            existingTags = Object.values(existingTags);

            const canBeSubmitted = existingTags.map(tag => {

                const currentTag = Array.from(Object.values(tag));
                if(currentTag[0] === tagDetails.tagName){
                    setIsNameAvailable(false);
                    if(currentTag[1] === tagDetails.tagColor){
                        setIsColorAvailable(false);
                    }
                    return false;
                }
                if(currentTag[1] === tagDetails.tagColor){
                    setIsColorAvailable(false);
                    return false;
                }
                return true;
            }).filter(item => item !== undefined && item !== true)

            if(canBeSubmitted.length === 0){
                setIsNameAvailable(true);
                setIsColorAvailable(true);
                createUserToDoTag(tagDetails).then(r => setWasCreated(r))
            }
        }
    }
    useEffect(() => {
        if(tagDetails.tagName.length > 0){
            setIsNameEmpty(false);
        }
    }, [tagDetails])



   return (
    <Dialog fullScreen={fullScreen} open={openCreateDialog} fullWidth onClose={() => {setOpenCreateDialog(false);    setWasCreated(false)}}>
        {wasCreated && 
            <div>
                <DialogTitle color={"darkgreen"} className='text-center'>New tag created!</DialogTitle>
            </div>
        }
        {!wasCreated &&
            <div className=''>
                <div className='container px-4 py-4'>
                    <div className='row align-items-center p-1'>
                        <DialogTitle className='col-11 p-0' fontWeight={600}>CREATE NEW TO DO TAG</DialogTitle>
                        <IconButton onMouseUp={() => setOpenCreateDialog(false)} className='col-1 h-100 p-0'>
                            <Close />
                        </IconButton>
                    </div>
                </div>
                
                <div className='container p-4'>
                    <div className='row gutter-x-0'>
                        <label htmlFor="title-field">Tag Name</label>
                        <TextField name='title-field' value={tagDetails.title}
                                    onChange={(e) => setTagDetails(prev => {return {...prev, tagName: e.target.value}})}
                        />
                        {isNameEmpty && <p>This field is required.</p>}
                        {!isNameEmpty && !isNameAvailable && <p>This tag name already exists.</p>}
                    </div>
                    <div className='row mt-5 gutter-x-0'>
                        <label htmlFor="desc-field">Color</label>
                        <MuiColorInput format="hex" value={tagDetails.tagColor} onChange={(newValue)=>setTagDetails(prev => {return {...prev, tagColor: newValue}})}  />
                        {!isColorAvailable && <p>This color is already in use.</p>}
                    </div>
                    <div className="row mt-5">
                        <div className='col-12 text-center align-self-end'>
                            <Button action={handleSubmit} label="Create" size="sm" color="green" />
                        </div>
                    </div>
                </div>
            </div>
        }

    </Dialog>
   )
    
}

export default CreateToDoTag;