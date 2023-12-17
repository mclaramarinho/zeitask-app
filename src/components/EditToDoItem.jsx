import React from "react";
import { IconButton, Switch, TextField, Typography } from "@mui/material";
import { DeleteOutline, Edit, Save } from "@mui/icons-material"

function EditToDoItem(props) {
    const handleEditMode = props.handleEditMode;
    const editMode = props.editMode;
    const itemDetails = props.itemDetails;

    const updateDescription = props.updateDescription;
    const updateTitle = props.updateTitle;
    const updateStatus = props.updateStatus;

    const handleDeleteItem = props.handleDeleteItem;

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
    </div>
  );
}

export default EditToDoItem;
