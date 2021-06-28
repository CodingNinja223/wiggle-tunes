import { createSelector } from "reselect";

const selectCart=state=>state.sound;

export const selectCartHidden=createSelector(
    [selectCart],
    sound=>sound.hidden
);