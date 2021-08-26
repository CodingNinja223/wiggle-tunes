import { createSelector } from "reselect";

const selectCart=state=>state.sound;

export const selectCartHidden=createSelector(
    [selectCart],
    sound=>sound.hidden
);

export const selectPodcastData=createSelector(
    [selectCart],
    sound=>sound.sound
)