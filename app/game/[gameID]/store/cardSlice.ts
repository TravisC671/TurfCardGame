import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "./store";

export interface SelectedCard {
	selectedCard: number;
}

const initialState: SelectedCard = {
	selectedCard: -1,
};

export const cardSlice = createSlice({
	name: "card",
	initialState,
	reducers: {
		setSelectedCard: (state, action) => {
			state.selectedCard = action.payload;
		},
	},
});

export const select = (state) => {
	return state.card.selectedCard;
};

export function observeStore(store, select, onChange) {
	let currentState = select(store.getState());

	function handleChange() {
		const nextState = select(store.getState());
		if (nextState !== currentState) {
			currentState = nextState;
			onChange(currentState);
		}
	}

	let unsubscribe = store.subscribe(handleChange);
	return unsubscribe;
}

export const { setSelectedCard } = cardSlice.actions;

export const selectCardState = (state: RootState) => state.card.selectedCard;

export default cardSlice.reducer;
