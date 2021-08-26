import SoundActionTypes from "./sound.types";
import PODCAST_ITEM from "./sound.types"
import {addSound} from './sound.utils'
const INITIAL_STATE={
    hidden:true,
    sound:[]
}

const soundReducer=(state=INITIAL_STATE,action)=>{
    switch(action.type){
        case SoundActionTypes.TOGGLE_CART_HIDDEN:
        return{
            ...state,
            hidden:!state.hidden
        };
        case PODCAST_ITEM.PODCAST_ITEM:
            return{
              ...state,
               sound:[...action.payload]
            }
        default:
            return state;
    }
}

export default soundReducer;