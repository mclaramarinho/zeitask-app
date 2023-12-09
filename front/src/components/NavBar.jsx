import { AppBar, Icon, IconButton, Menu, MenuItem, Toolbar, Typography } from "@mui/material";
import AccountCircle from '@mui/icons-material/AccountCircle';
import MenuIcon from '@mui/icons-material/Menu';

import React, { useState } from "react";

function NavBar(){
    const [anchorEl, setAnchorEl] = useState(null);

    function handleMenu(e){
        setAnchorEl(e.currentTarget)
    }
    function handleClose(){
        setAnchorEl(null)
    }
    return (
            <AppBar sx={{backgroundColor: "black", width:"100vw", marginLeft:"0"}} position="static">
                <Toolbar>
                    <Typography variant="h5" letterSpacing={10} fontFamily={"inherit"}>ZEITASK</Typography>
                    
                    <div className="position-absolute end-0 mx-4">
                        <IconButton size="large" edge="end" onClick={(e) => handleMenu(e)}>
                            <MenuIcon sx={{color: "white"}}  />
                        </IconButton>
                        <Menu id="nav-menu"
                                open={Boolean(anchorEl)} onClose={() => handleClose()}
                                transformOrigin={{vertical: 'top', horizontal:'left'}} 
                                keepMounted
                                anchorOrigin={{vertical: 'top', horizontal:'right'}}
                                variant="menu"
                        >
                            <MenuItem onClick={() => handleClose()}>Kanban</MenuItem>
                            <MenuItem onClick={() => handleClose()}>To Do List</MenuItem>
                            <MenuItem onClick={() => handleClose()}>Profile</MenuItem>
                            <MenuItem onClick={() => handleClose()} sx={{color: "crimson"}}>Log out</MenuItem>
                        </Menu>

                        
                    </div>
                    
                    
                    
                    
                </Toolbar>
            </AppBar>
    )
}

export default NavBar;