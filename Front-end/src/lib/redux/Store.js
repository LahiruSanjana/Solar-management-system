import { configureStore } from "@reduxjs/toolkit";
import uiReducer from "./features/Uislice";
import { api } from "./Query";

const Store = configureStore({
  reducer: {
    ui:uiReducer,
    [api.reducerPath]: api.reducer,
  },
    middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(api.middleware),
});

export default Store;
