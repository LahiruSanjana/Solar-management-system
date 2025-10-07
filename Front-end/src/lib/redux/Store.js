import { configureStore } from "@reduxjs/toolkit";
import uiReducer from "./features/Uislice";

const Store = configureStore({
  reducer: {
    ui:uiReducer,
  },
});

export default Store;
