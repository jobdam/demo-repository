/** @format */

import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type FormFieldState = {
  name: string;
  email: string;
};

const initialState: FormFieldState = {
  name: "",
  email: "",
};

const formFieldSlice = createSlice({
  name: "formField",
  initialState,
  reducers: {
    setName(state, action: PayloadAction<string>) {
      state.name = action.payload;
    },
    setEmail(state, action: PayloadAction<string>) {
      state.email = action.payload;
    },
    // setError(state, action: PayloadAction<string | undefined>) {
    //   state.error = action.payload;
    // },
    resetFormField() {
      return initialState;
    },
  },
});

export const { setName, setEmail, setError, resetFormField } =
  formFieldSlice.actions;
export default formFieldSlice.reducer;
