import SoundActionTypes from "./sound.types";


const INITIAL_STATE={
    hidden:false
}


const soundReducer=(state=INITIAL_STATE,action)=>{
    switch(action.type){
        case SoundActionTypes.TOGGLE_CART_HIDDEN:
        return{
            ...state,
            hidden:!state.hidden
        }
        default:
            return state;
    };
 
}

export default soundReducer;