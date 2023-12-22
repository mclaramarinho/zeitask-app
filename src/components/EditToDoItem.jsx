import React, { useEffect, useState } from "react";
import { IconButton, Switch, TextField, Typography } from "@mui/material";
import { DeleteOutline, Edit, Save } from "@mui/icons-material"
import { getUserToDoTags } from "../firebase/db/todos";

function EditToDoItem(props) {
    const handleEditMode = props.handleEditMode;
    const editMode = props.editMode;
    const itemDetails = props.itemDetails;

    const updateDescription = props.updateDescription;
    const updateTitle = props.updateTitle;
    const updateStatus = props.updateStatus;
    const updateTag = props.updateTag;
    const handleDeleteItem = props.handleDeleteItem;

    const [tags, setTags] = useState([]);
    useEffect(() => {
      getUserToDoTags().then(r => setTags(r))
    }, [])
  return (
    <div className={`container ${props.mobile && "p-4"}`}>
      <div className="row gutter-x-0">
        <TextField
          InputProps={{
            readOnly: !editMode,
            disableUnderline: !editMode,
            style: { fontWeight: 600, fontSize: 22 },
          }}
          value={itemDetails.newTitle}
          onChange={(e) => updateTitle(e)}
          className="col-10"
          variant="standard"
          classes={"title-input"}
        />
        <IconButton className="col-1 me-0" onMouseUp={() => handleEditMode()}>
          {editMode ? <Save /> : <Edit />}
        </IconButton>
        <IconButton className="col-1 me-0" onMouseUp={() => handleDeleteItem(itemDetails.title)}>
          <DeleteOutline />
        </IconButton>
      </div>
      <div className="row mt-5 gutter-x-0">
        <textarea
          name=""
          id=""
          className="p-3"
          rows="5"
          value={itemDetails.description}
          placeholder="Your task description..."
          onChange={(e) => updateDescription(e)}
          disabled={!editMode}
        />
      </div>
      <div className="row mt-3">
        <div className="col-12">
          <Typography
            variant="button"
            className="me-5 row"
            sx={{ fontSize: "16px" }}
          >
            Task Status
          </Typography>
          <Switch
            disabled={!editMode}
            checked={itemDetails.status}
            onChange={(e) => updateStatus(e)}
          />
          <Typography variant="caption" className="">
            {itemDetails.status ? "Done" : "Not done yet"}
          </Typography>
        </div>
      </div>
      <div className="row mt-3">
        <div className="col-12">
          <Typography
            variant="button"
            className="me-5 row"
            sx={{ fontSize: "16px" }}
          >
            ITEM TAG
          </Typography>
          <div className="row row-gap-2">
            {/* item tags available */}
            {tags.map((tag) =>{
              let backgroundColor = "";
              if(itemDetails.tag === tag.tagName){
                backgroundColor = tag.tagColor.split();
                backgroundColor[0] += "BF";
              }
              return (
                
                <div className="col-5 col-md-3 text-center justify-content-center p-0 m-auto">
                  <button value={tag.tagName} disabled={!editMode}
                          className="btn btn-sm btn-outline bolder border-box w-100 px-0"
                          onMouseUp={(e)=> updateTag(e)}
                          style={{borderColor: tag.tagColor, backgroundColor: backgroundColor}}>
                            {tag.tagName}
                  </button>
                </div>
              )
            })}
          </div>
          
        </div>
      </div>
    </div>
  );
}

export default EditToDoItem;
