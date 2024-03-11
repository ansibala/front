//axios
import { ContactsOutlined } from "@material-ui/icons";
import axios from "axios";
import uploadFileTypes from "./episode.type";

//Type
import {
  DELETE_EPISODE,
  GET_EPISODE,
  INSERT_EPISODE,
  OPEN_EPISODE_TOAST,
  UPDATE_EPISODE,
} from "./episode.type";

//toast
import { Toast } from "../../Util/Toast_";

//get Episode
export const getEpisode = () => (dispatch) => {
  axios
    .get(`episode`)
    .then((result) => {
      console.log(result.data);
      dispatch({ type: GET_EPISODE, payload: result.data.episode });
    })
    .catch((error) => {
      console.log(error);
    });
};

//get Episode
export const getAllEpisode = (mongoId, seasons) => (dispatch) => {
  // axios
  //   .get(`episode/seasonWiseEpisodes?movieId=${mongoId}&season=${seasons}`)
  //   .then((result) => {
  //     console.log(result.data);
  //     dispatch({ type: GET_EPISODE, payload: result.data.episode });
  //   })
  //   .catch((error) => {
  //     console.log(error);
  //   });
};

//get season wise episode
export const getMovieEpisode = (dialogData, seasons) => (dispatch) => {
  axios
    .get(`episode/seasonWiseEpisode?movieId=${dialogData}&seasonId=${seasons}`)
    .then((res) => {
      console.log("getMovieEpisode....", res.data);
      dispatch({ type: GET_EPISODE, payload: res.data.episode });
    })
    .catch((error) => {
      console.log(error);
    });
};

//Insert Episode
export const insertEpisode = (formData) => (dispatch) => {
  axios
    .post(`episode/create`, formData)
    .then((res) => {
      console.log(res.data);
      if (res.data.status) {
        dispatch({ type: INSERT_EPISODE, payload: res.data.Episode });

        dispatch({
          type: OPEN_EPISODE_TOAST,
          payload: { data: "Insert Episode Successful ✔", for: "insert" },
        });
      } else {
        console.log("error", res.data.message);
      }
    })
    .catch((error) => {
      console.log(error);
    });
};

//Update Episode
export const updateEpisode = (data, mongoId) => (dispatch) => {
  axios
    .patch(`episode/update?episodeId=${mongoId}`, data)
    .then((res) => {
      if (res.status) {
        console.log(res.data);
        dispatch({
          type: UPDATE_EPISODE,
          payload: { data: res.data.episode, id: mongoId },
        });

        dispatch({
          type: OPEN_EPISODE_TOAST,
          payload: { data: "Update Episode Successful ✔", for: "update" },
        });
      } else {
        return res.data.message, "error";
      }
    })
    .catch((error) => {
      console.log(error);
    });
};

//Delete Episode
export const deleteEpisode = (mongoId) => (dispatch) => {
  axios
    .delete(`episode/delete?episodeId=${mongoId}`)
    .then((res) => {
      dispatch({ type: DELETE_EPISODE, payload: mongoId });
    })
    .catch((error) => {
      console.log(error);
    });
};

export const setUploadFile = (data) => ({
  type: uploadFileTypes.SET_UPLOAD_FILE,
  payload: data,
});

export const setUploadProgress = (id, progress) => ({
  type: uploadFileTypes.SET_UPLOAD_PROGRESS,
  payload: {
    id,
    progress,
  },
});

export const successUploadFile = (id) => ({
  type: uploadFileTypes.SUCCESS_UPLOAD_FILE,
  payload: id,
});

export const failureUploadFile = (id) => ({
  type: uploadFileTypes.FAILURE_UPLOAD_FILE,
  payload: id,
});

export const uploadFile = (files, data, mongoId, update) => (dispatch) => {
  if (!mongoId && files.length && data.videoType == 7) {
    files.map((file, index) => {
      const formPayload = new FormData();
      formPayload.append("videoUrl", file.file);
      formPayload.append("name", data.name);
      formPayload.append("movie", data.movies);
      formPayload.append("image", data.image);
      formPayload.append("episodeNumber", data.episodeNumber);
      formPayload.append("season", data.seasonNumber);
      formPayload.append("videoType", data.videoType);

      axios
        .post(`episode/create`, formPayload, formPayload, {
          onUploadProgress: (progress) => {
            const { loaded, total } = progress;
            const percentageProgress = Math.floor((loaded / total) * 100);
            dispatch(setUploadProgress(file.id, percentageProgress));
          },
        })
        .then((res) => {
          if (res.data.status) {
            dispatch(successUploadFile(file.id));
            Toast("success", "Insert Episode Successful ✔");
          } else {
            return res.data.message, "error";
          }
        })

        .catch((res) => {
          dispatch(failureUploadFile(file.id));
        });
    });
  }
  if (mongoId && files.length && data.videoType == 7) {
    files.map((file, index) => {
      const formPayload = new FormData();
      formPayload.append("videoUrl", file.file);
      formPayload.append("name", data.name);
      formPayload.append("movie", data.movies);
      formPayload.append("image", data.image);
      formPayload.append("episodeNumber", data.episodeNumber);
      formPayload.append("season", data.seasonNumber);
      formPayload.append("videoType", data.videoType);

      axios
        .patch(`episode/update?episodeId=${mongoId}`, formPayload, {
          onUploadProgress: (progress) => {
            const { loaded, total } = progress;
            const percentageProgress = Math.floor((loaded / total) * 100);
            dispatch(setUploadProgress(file.id, percentageProgress));
          },
        })
        .then((res) => {
          dispatch(successUploadFile(file.id));

          if (res.status) {
            console.log("::: ", res.data);
            dispatch({
              type: UPDATE_EPISODE,
              payload: { data: res.data.episode, id: mongoId },
            });

            if (update == "update") {
              Toast("info", "Update Episode Successful ✔");
            }
          } else {
            return res.data.message, "error";
          }
        })
        .catch((error) => {
          // dispatch(failureUploadFile(file.id));
          console.log(error);
        });
    });
  }
  if (mongoId && data.videoType != 7) {
    const formPayload = new FormData();
    formPayload.append("name", data.name);

    formPayload.append("movie", data.movies);
    formPayload.append("image", data.image);
    formPayload.append("episodeNumber", data.episodeNumber);
    formPayload.append("season", data.seasonNumber);
    formPayload.append("videoType", data.videoType);

    if (data.videoType == 0) {
      formPayload.append("videoUrl", data.youtubeUrl);
    } else if (data.videoType == 1) {
      formPayload.append("videoUrl", data.m3u8Url);
    } else if (data.videoType == 2) {
      formPayload.append("videoUrl", data.movUrl);
    } else if (data.videoType == 3) {
      formPayload.append("videoUrl", data.mp4Url);
    } else if (data.videoType == 4) {
      formPayload.append("videoUrl", data.mkvUrl);
    } else if (data.videoType == 5) {
      formPayload.append("videoUrl", data.webmUrl);
    } else {
      formPayload.append("videoUrl", data.embedUrl);
    }

    axios
      .patch(`episode/update?episodeId=${mongoId}`, formPayload)
      .then((res) => {
        if (res.data.status) {
          dispatch({
            type: UPDATE_EPISODE,
            payload: { data: res.data.episode, id: mongoId },
          });

          if (update == "update") {
            Toast("info", "Update Episode Successful ✔");
          }
        } else {
          return res.data.message, "error";
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }
  if (!mongoId && data.videoType != 7) {
    const formPayload = new FormData();
    formPayload.append("name", data.name);

    formPayload.append("movie", data.movies);
    formPayload.append("image", data.image);
    formPayload.append("episodeNumber", data.episodeNumber);
    formPayload.append("season", data.seasonNumber);
    formPayload.append("videoType", data.videoType);

    if (data.videoType == 0) {
      formPayload.append("videoUrl", data.youtubeUrl);
    } else if (data.videoType == 1) {
      formPayload.append("videoUrl", data.m3u8Url);
    } else if (data.videoType == 2) {
      formPayload.append("videoUrl", data.movUrl);
    } else if (data.videoType == 3) {
      formPayload.append("videoUrl", data.mp4Url);
    } else if (data.videoType == 4) {
      formPayload.append("videoUrl", data.mkvUrl);
    } else if (data.videoType == 5) {
      formPayload.append("videoUrl", data.webmUrl);
    } else {
      formPayload.append("videoUrl", data.embedUrl);
    }
    axios
      .post(`episode/create`, formPayload)
      .then((res) => {
        if (res.data.status) {
          dispatch({
            type: INSERT_EPISODE,
            payload: { data: res.data.episode },
          });

          if (update == "update") {
            Toast("success", "Insert Episode Successful ✔");
          }
        } else {
          return res.data.message, "error";
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }
};
