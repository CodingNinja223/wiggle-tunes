import CameraTypes from "./camera.types";


export const Camera=item=>({
    type:CameraTypes.CAMERA,
    payload:item
})