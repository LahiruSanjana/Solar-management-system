import { configureStore } from "@reduxjs/toolkit";
import uiReducer from "./features/Uislice";
import { api } from "./Query";
import { weatherApi } from "./Weather";

const store = configureStore({
  reducer: {
    ui: uiReducer,
    [api.reducerPath]: api.reducer,
    [weatherApi.reducerPath]: weatherApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(api.middleware).concat(weatherApi.middleware), // ✅ middleware must be added
});

export default store;
