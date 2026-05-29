import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { axiosInstance, getErrorObject, useMutationHelper } from "./apiSlice";
import { BRANDS_URL } from "../constants";

// Thunks
export const getBrands = createAsyncThunk(
  "brands/getBrands",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(BRANDS_URL);
      return response.data;
    } catch (error) {
      return rejectWithValue(getErrorObject(error));
    }
  }
);

export const createBrand = createAsyncThunk(
  "brands/createBrand",
  async (data, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(`${BRANDS_URL}?folder=brand`, data);
      return response.data;
    } catch (error) {
      return rejectWithValue(getErrorObject(error));
    }
  }
);

export const updateBrand = createAsyncThunk(
  "brands/updateBrand",
  async (data, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put(`${BRANDS_URL}/${data.id}?folder=brand`, data.formData);
      return response.data;
    } catch (error) {
      return rejectWithValue(getErrorObject(error));
    }
  }
);

export const deleteBrand = createAsyncThunk(
  "brands/deleteBrand",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.delete(`${BRANDS_URL}/${id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(getErrorObject(error));
    }
  }
);

// Initial State
const initialState = {
  brands: [],
  loading: false,
  error: null,
};

// Slice
const brandsSlice = createSlice({
  name: "brands",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getBrands.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getBrands.fulfilled, (state, action) => {
        state.loading = false;
        state.brands = action.payload;
      })
      .addCase(getBrands.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default brandsSlice.reducer;

// Custom Hooks mimicking RTK Query API
export const useCreateBrandMutation = () => useMutationHelper(createBrand);
export const useUpdateBrandMutation = () => useMutationHelper(updateBrand);
export const useDeleteBrandMutation = () => useMutationHelper(deleteBrand);

export const useGetBrandsQuery = (arg, options = {}) => {
  const dispatch = useDispatch();
  const { brands, loading, error } = useSelector((state) => state.brands);

  const refetch = useCallback(() => {
    dispatch(getBrands());
  }, [dispatch]);

  useEffect(() => {
    if (!options.skip) {
      dispatch(getBrands());
    }
  }, [dispatch, options.skip]);

  return { data: brands, isLoading: loading, error, refetch };
};
