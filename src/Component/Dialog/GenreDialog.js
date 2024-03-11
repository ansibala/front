import React, { useState, useEffect } from "react";

// material-ui
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Typography,
  Tooltip,
} from "@material-ui/core";
import Cancel from "@material-ui/icons/Cancel";

//react-redux
import { useDispatch, useSelector } from "react-redux";
import { connect } from "react-redux";

//action
import { insertGenre, updateGenre } from "../../store/Genre/genre.action";
import { CLOSE_DIALOG } from "../../store/Genre/genre.type";

//Alert
import { permissionError } from "../../Util/Alert";

const GenreDialog = (props) => {
  const { dialog: open, dialogData } = useSelector((state) => state.genre);

  const dispatch = useDispatch();

  const [name, setName] = useState("");
  // const [image, setImage] = useState([]);
  // const [imagePath, setImagePath] = useState("");
  const [genreId, setGenreId] = useState("");

  const [error, setError] = useState({
    name: "",
    // image: "",
  });

  const hasPermission = useSelector((state) => state.admin.admin.flag);

  //Insert and update Data Functionality
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!genreId) {
      if (
        // !image || !imagePath ||
        !name
      ) {
        const error = {};
        if (!name) error.name = "Name is Required!";
        // if (!image || !imagePath) error.image = "Image is Required!";
        return setError({ ...error });
      }
    } else {
      if (
        // !image && !imagePath &&
        !name
      ) {
        if (!name) error.name = "Name is Required!";
        // if (image.length === 0 && !imagePath)
        //   error.image = "Image is Required!";
        return setError({ ...error });
      }
    }

    dispatch({ type: CLOSE_DIALOG });
    if (!hasPermission) return permissionError();
    if (genreId) {
      props.updateGenre(genreId, name);
    } else {
      props.insertGenre(name);
    }
  };

  //Empty Data After Insert
  useEffect(() => {
    setName("");
    // setImagePath("");
    setGenreId("");
    setError({
      name: "",
      // image: "",
    });
  }, [open]);

  //Set Data Value
  useEffect(() => {
    if (dialogData) {
      setName(dialogData.name);
      // setImagePath(dialogData.image);
      setGenreId(dialogData._id);
    }
  }, [dialogData]);

  //Close Dialog
  const handleClose = () => {
    dispatch({ type: CLOSE_DIALOG });
  };

  //  Image Load fffff
  // const imageLoad = (event) => {
  //   setImage(event.target.files[0]);

  //   setImagePath(URL.createObjectURL(event.target.files[0]));
  // };

  return (
    <>
      <Dialog
        open={open}
        aria-labelledby="responsive-dialog-title"
        onClose={handleClose}
        disableBackdropClick
        disableEscapeKeyDown
        fullWidth
        maxWidth="xs"
      >
        <DialogTitle id="responsive-dialog-title">
          {dialogData ? <h5>Edit Genre</h5> : <h5>Add Genre</h5>}
        </DialogTitle>

        <Tooltip title="Close">
          <Cancel
            className="cancelButton"
            style={{
              position: "absolute",
              top: "23px",
              right: "15px",
              color: "#fff",
            }}
            onClick={handleClose}
          />
        </Tooltip>

        <DialogContent>
          <div className="modal-body pt-1 px-1 pb-3">
            <div className="d-flex flex-column">
              <form>
                <div className="form-group">
                  <div className="row">
                    <div className="col-md-12 my-2">
                      <label className="float-left styleForTitle text-white">
                        Name
                      </label>
                      <input
                        type="text"
                        placeholder="Name"
                        className="form-control form-control-line text-capitalize"
                        required
                        value={name}
                        onChange={(e) => {
                          setName(e.target.value);

                          if (!e.target.value) {
                            return setError({
                              ...error,
                              name: "Name is Required!",
                            });
                          } else {
                            return setError({
                              ...error,
                              name: "",
                            });
                          }
                        }}
                      />
                      {error.name && (
                        <div className="pl-1 text-left">
                          {error.name && (
                            <span className="error">{error.name}</span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  
                </div>
              </form>
            </div>
          </div>
        </DialogContent>
        <div>
          <hr className=" dia_border w-100 mt-0"></hr>
        </div>
        <DialogActions>
          <button
            type="button"
            className="btn btn-danger btn-sm px-3 py-1 mb-3"
            onClick={handleClose}
          >
            Cancel
          </button>
          {dialogData ? (
            <button
              type="button"
              className="btn btn-success btn-sm px-3 py-1 mr-3 mb-3"
              onClick={handleSubmit}
            >
              Update
            </button>
          ) : (
            <button
              type="button"
              className="btn btn-success btn-sm px-3 py-1 mr-3 mb-3"
              onClick={handleSubmit}
            >
              Insert
            </button>
          )}
        </DialogActions>
      </Dialog>
    </>
  );
};

export default connect(null, { insertGenre, updateGenre })(GenreDialog);
