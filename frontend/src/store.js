import { configureStore } from "@reduxjs/toolkit";
import authSliceReducer from "./slices/authSlice";
import usersSliceReducer from "./slices/usersApiSlice";
import bookingsSliceReducer from "./slices/bookingsApiSlice";
import brandsSliceReducer from "./slices/brandsApiSlice";
import carsSliceReducer from "./slices/carsApiSlice";
import contactsSliceReducer from "./slices/contactApiSlice";
import feedbackSliceReducer from "./slices/feedbackApiSlice";
import offersSliceReducer from "./slices/offersApiSlice";
import ratingsSliceReducer from "./slices/ratingsApiSlice";

const store = configureStore({
  reducer: {
    auth: authSliceReducer,
    users: usersSliceReducer,
    bookings: bookingsSliceReducer,
    brands: brandsSliceReducer,
    cars: carsSliceReducer,
    contacts: contactsSliceReducer,
    feedback: feedbackSliceReducer,
    offers: offersSliceReducer,
    ratings: ratingsSliceReducer,
  },
  devTools: true,
});

export default store;
