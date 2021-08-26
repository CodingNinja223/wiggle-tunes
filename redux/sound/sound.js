import SoundActionTypes from "./sound.types";
import PODCAST_ITEM from "./sound.types"

export const toggleCartHidden = () => ({
    type:SoundActionTypes.TOGGLE_CART_HIDDEN
  });

  export const SoundCard=(item)=>({
  type:PODCAST_ITEM.PODCAST_ITEM,
  payload:item
  })