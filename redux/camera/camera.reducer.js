import CameraTypes from './camera.types'


const INITIAL_STATE={
    image:''
}

const cameraReducer=(state=INITIAL_STATE,action)=>{
    switch(action.type){
      case CameraTypes.CAMERA:
          return{
              ...state,
              image:action.payload
          };
     default:
         return state;
    }
}


export default cameraReducer;