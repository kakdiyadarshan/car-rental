import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { axiosInstance, getErrorObject, useMutationHelper } from "./apiSlice";
import { OFFERS_URL } from "../constants";

// Thunks
export const getOffers = createAsyncThunk(
  "offers/getOffers",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(OFFERS_URL);
      return response.data;
    } catch (error) {
      return rejectWithValue(getErrorObject(error));
    }
  }
);

export const createOffer = createAsyncThunk(
  "offers/createOffer",
  async (data, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(OFFERS_URL, data);
      return response.data;
    } catch (error) {
      return rejectWithValue(getErrorObject(error));
    }
  }
);

export const updateOffer = createAsyncThunk(
  "offers/updateOffer",
  async (data, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put(`${OFFERS_URL}/${data.id}`, data);
      return response.data;
    } catch (error) {
      return rejectWithValue(getErrorObject(error));
    }
  }
);

export const deleteOffer = createAsyncThunk(
  "offers/deleteOffer",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.delete(`${OFFERS_URL}/${id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(getErrorObject(error));
    }
  }
);

// Initial State
const initialState = {
  offers: [],
  loading: false,
  error: null,
};

// Slice
const offersSlice = createSlice({
  name: "offers",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getOffers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getOffers.fulfilled, (state, action) => {
        state.loading = false;
        state.offers = action.payload;
      })
      .addCase(getOffers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default offersSlice.reducer;

// Custom Hooks mimicking RTK Query API
export const useCreateOfferMutation = () => useMutationHelper(createOffer);
export const useUpdateOfferMutation = () => useMutationHelper(updateOffer);
export const useDeleteOfferMutation = () => useMutationHelper(deleteOffer);

export const useGetOffersQuery = (arg, options = {}) => {
  const dispatch = useDispatch();
  const { offers, loading, error } = useSelector((state) => state.offers);

  const refetch = useCallback(() => {
    dispatch(getOffers());
  }, [dispatch]);

  useEffect(() => {
    if (!options.skip) {
      dispatch(getOffers());
    }
  }, [dispatch, options.skip]);

  return { data: offers, isLoading: loading, error, refetch };
};
