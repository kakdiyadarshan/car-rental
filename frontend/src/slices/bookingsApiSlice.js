import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { axiosInstance, getErrorObject, useMutationHelper } from "./apiSlice";
import { BOOKINGS_URL } from "../constants";

// Thunks
export const createBooking = createAsyncThunk(
  "bookings/createBooking",
  async (data, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(BOOKINGS_URL, data);
      return response.data;
    } catch (error) {
      return rejectWithValue(getErrorObject(error));
    }
  }
);

export const getBookingById = createAsyncThunk(
  "bookings/getBookingById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`${BOOKINGS_URL}/${id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(getErrorObject(error));
    }
  }
);

export const getMyBookings = createAsyncThunk(
  "bookings/getMyBookings",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`${BOOKINGS_URL}/mybookings`);
      return response.data;
    } catch (error) {
      return rejectWithValue(getErrorObject(error));
    }
  }
);

export const getBookings = createAsyncThunk(
  "bookings/getBookings",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(BOOKINGS_URL);
      return response.data;
    } catch (error) {
      return rejectWithValue(getErrorObject(error));
    }
  }
);

export const createPaymentSession = createAsyncThunk(
  "bookings/createPaymentSession",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(`${BOOKINGS_URL}/${id}/pay`);
      return response.data;
    } catch (error) {
      return rejectWithValue(getErrorObject(error));
    }
  }
);

export const updateBookingToPaid = createAsyncThunk(
  "bookings/updateBookingToPaid",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put(`${BOOKINGS_URL}/${id}/paid`);
      return response.data;
    } catch (error) {
      return rejectWithValue(getErrorObject(error));
    }
  }
);

export const updateBookingStatus = createAsyncThunk(
  "bookings/updateBookingStatus",
  async ({ id, status }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put(`${BOOKINGS_URL}/${id}/status`, { status });
      return response.data;
    } catch (error) {
      return rejectWithValue(getErrorObject(error));
    }
  }
);

export const updateBookingIdentity = createAsyncThunk(
  "bookings/updateBookingIdentity",
  async ({ id, proofOfIdentity }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put(`${BOOKINGS_URL}/${id}/verify-identity`, { proofOfIdentity });
      return response.data;
    } catch (error) {
      return rejectWithValue(getErrorObject(error));
    }
  }
);

// Initial State
const initialState = {
  bookings: [],
  booking: null,
  myBookings: [],
  loading: false,
  error: null,
};

// Slice
const bookingsSlice = createSlice({
  name: "bookings",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // getBookings
      .addCase(getBookings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getBookings.fulfilled, (state, action) => {
        state.loading = false;
        state.bookings = action.payload;
      })
      .addCase(getBookings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // getMyBookings
      .addCase(getMyBookings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getMyBookings.fulfilled, (state, action) => {
        state.loading = false;
        state.myBookings = action.payload;
      })
      .addCase(getMyBookings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // getBookingById
      .addCase(getBookingById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getBookingById.fulfilled, (state, action) => {
        state.loading = false;
        state.booking = action.payload;
      })
      .addCase(getBookingById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default bookingsSlice.reducer;

// Custom Hooks mimicking RTK Query API
export const useCreateBookingMutation = () => useMutationHelper(createBooking);
export const useCreatePaymentSessionMutation = () => useMutationHelper(createPaymentSession);
export const useUpdateBookingToPaidMutation = () => useMutationHelper(updateBookingToPaid);
export const useUpdateBookingStatusMutation = () => useMutationHelper(updateBookingStatus);
export const useUpdateBookingIdentityMutation = () => useMutationHelper(updateBookingIdentity);

export const useGetBookingsQuery = (arg, options = {}) => {
  const dispatch = useDispatch();
  const { bookings, loading, error } = useSelector((state) => state.bookings);

  const refetch = useCallback(() => {
    dispatch(getBookings());
  }, [dispatch]);

  useEffect(() => {
    if (!options.skip) {
      dispatch(getBookings());
    }
  }, [dispatch, options.skip]);

  return { data: bookings, isLoading: loading, error, refetch };
};

export const useGetMyBookingsQuery = (arg, options = {}) => {
  const dispatch = useDispatch();
  const { myBookings, loading, error } = useSelector((state) => state.bookings);

  const refetch = useCallback(() => {
    dispatch(getMyBookings());
  }, [dispatch]);

  useEffect(() => {
    if (!options.skip) {
      dispatch(getMyBookings());
    }
  }, [dispatch, options.skip]);

  return { data: myBookings, isLoading: loading, error, refetch };
};

export const useGetBookingByIdQuery = (id, options = {}) => {
  const dispatch = useDispatch();
  const { booking, loading, error } = useSelector((state) => state.bookings);

  const refetch = useCallback(() => {
    if (id) {
      dispatch(getBookingById(id));
    }
  }, [dispatch, id]);

  useEffect(() => {
    if (id && !options.skip) {
      dispatch(getBookingById(id));
    }
  }, [dispatch, id, options.skip]);

  return { data: booking, isLoading: loading, error, refetch };
};
