import { combineReducers } from "redux";
import cameraReducer from "./camera/camera.reducer";

export default combineReducers({
    camera:cameraReducer
})