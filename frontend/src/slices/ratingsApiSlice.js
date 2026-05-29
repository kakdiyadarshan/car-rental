import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { axiosInstance, getErrorObject, useMutationHelper } from "./apiSlice";
import { RATINGS_URL } from "../constants";

// Thunks
export const createOrUpdateRating = createAsyncThunk(
  "ratings/createOrUpdateRating",
  async (data, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(RATINGS_URL, data);
      return response.data;
    } catch (error) {
      return rejectWithValue(getErrorObject(error));
    }
  }
);

export const getMyRatings = createAsyncThunk(
  "ratings/getMyRatings",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`${RATINGS_URL}/myratings`);
      return response.data;
    } catch (error) {
      return rejectWithValue(getErrorObject(error));
    }
  }
);

export const getCarRating = createAsyncThunk(
  "ratings/getCarRating",
  async (carId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`${RATINGS_URL}/car/${carId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(getErrorObject(error));
    }
  }
);

export const getAllRatings = createAsyncThunk(
  "ratings/getAllRatings",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(RATINGS_URL);
      return response.data;
    } catch (error) {
      return rejectWithValue(getErrorObject(error));
    }
  }
);

// Initial State
const initialState = {
  ratings: [],
  myRatings: [],
  carRating: null,
  loading: false,
  error: null,
};

// Slice
const ratingsSlice = createSlice({
  name: "ratings",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // getAllRatings
      .addCase(getAllRatings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllRatings.fulfilled, (state, action) => {
        state.loading = false;
        state.ratings = action.payload;
      })
      .addCase(getAllRatings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // getMyRatings
      .addCase(getMyRatings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getMyRatings.fulfilled, (state, action) => {
        state.loading = false;
        state.myRatings = action.payload;
      })
      .addCase(getMyRatings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // getCarRating
      .addCase(getCarRating.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getCarRating.fulfilled, (state, action) => {
        state.loading = false;
        state.carRating = action.payload;
      })
      .addCase(getCarRating.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default ratingsSlice.reducer;

// Custom Hooks mimicking RTK Query API
export const useCreateOrUpdateRatingMutation = () => useMutationHelper(createOrUpdateRating);

export const useGetMyRatingsQuery = (arg, options = {}) => {
  const dispatch = useDispatch();
  const { myRatings, loading, error } = useSelector((state) => state.ratings);

  const refetch = useCallback(() => {
    dispatch(getMyRatings());
  }, [dispatch]);

  useEffect(() => {
    if (!options.skip) {
      dispatch(getMyRatings());
    }
  }, [dispatch, options.skip]);

  return { data: myRatings, isLoading: loading, error, refetch };
};

export const useGetCarRatingQuery = (carId, options = {}) => {
  const dispatch = useDispatch();
  const { carRating, loading, error } = useSelector((state) => state.ratings);

  const refetch = useCallback(() => {
    if (carId) {
      dispatch(getCarRating(carId));
    }
  }, [dispatch, carId]);

  useEffect(() => {
    if (carId && !options.skip) {
      dispatch(getCarRating(carId));
    }
  }, [dispatch, carId, options.skip]);

  return { data: carRating, isLoading: loading, error, refetch };
};

export const useGetAllRatingsQuery = (arg, options = {}) => {
  const dispatch = useDispatch();
  const { ratings, loading, error } = useSelector((state) => state.ratings);

  const refetch = useCallback(() => {
    dispatch(getAllRatings());
  }, [dispatch]);

  useEffect(() => {
    if (!options.skip) {
      dispatch(getAllRatings());
    }
  }, [dispatch, options.skip]);

  return { data: ratings, isLoading: loading, error, refetch };
};
