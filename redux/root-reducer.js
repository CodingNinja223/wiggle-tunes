import {combineReducers} from 'redux';
import cartReducer from './cart/cart.reducer';
import soundReducer from './sound/sound.reducer';



export default combineReducers({
    cart:cartReducer,
    sound:soundReducer
})