import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { axiosInstance, getErrorObject, useMutationHelper } from "./apiSlice";
import { CARS_URL } from "../constants";

// Thunks
export const getCars = createAsyncThunk(
  "cars/getCars",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(CARS_URL);
      return response.data;
    } catch (error) {
      return rejectWithValue(getErrorObject(error));
    }
  }
);

export const getCarById = createAsyncThunk(
  "cars/getCarById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`${CARS_URL}/${id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(getErrorObject(error));
    }
  }
);

export const createCar = createAsyncThunk(
  "cars/createCar",
  async (data, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(CARS_URL, data);
      return response.data;
    } catch (error) {
      return rejectWithValue(getErrorObject(error));
    }
  }
);

export const updateCar = createAsyncThunk(
  "cars/updateCar",
  async (data, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put(`${CARS_URL}/${data.id}`, data.formData);
      return response.data;
    } catch (error) {
      return rejectWithValue(getErrorObject(error));
    }
  }
);

export const deleteCar = createAsyncThunk(
  "cars/deleteCar",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.delete(`${CARS_URL}/${id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(getErrorObject(error));
    }
  }
);

// Initial State
const initialState = {
  cars: [],
  car: null,
  loading: false,
  error: null,
};

// Slice
const carsSlice = createSlice({
  name: "cars",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // getCars
      .addCase(getCars.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getCars.fulfilled, (state, action) => {
        state.loading = false;
        state.cars = action.payload;
      })
      .addCase(getCars.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // getCarById
      .addCase(getCarById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getCarById.fulfilled, (state, action) => {
        state.loading = false;
        state.car = action.payload;
      })
      .addCase(getCarById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default carsSlice.reducer;

// Custom Hooks mimicking RTK Query API
export const useCreateCarMutation = () => useMutationHelper(createCar);
export const useUpdateCarMutation = () => useMutationHelper(updateCar);
export const useDeleteCarMutation = () => useMutationHelper(deleteCar);

export const useGetCarsQuery = (arg, options = {}) => {
  const dispatch = useDispatch();
  const { cars, loading, error } = useSelector((state) => state.cars);

  const refetch = useCallback(() => {
    dispatch(getCars());
  }, [dispatch]);

  useEffect(() => {
    if (!options.skip) {
      dispatch(getCars());
    }
  }, [dispatch, options.skip]);

  return { data: cars, isLoading: loading, error, refetch };
};

export const useGetCarByIdQuery = (id, options = {}) => {
  const dispatch = useDispatch();
  const { car, loading, error } = useSelector((state) => state.cars);

  const refetch = useCallback(() => {
    if (id) {
      dispatch(getCarById(id));
    }
  }, [dispatch, id]);

  useEffect(() => {
    if (id && !options.skip) {
      dispatch(getCarById(id));
    }
  }, [dispatch, id, options.skip]);

  return { data: car, isLoading: loading, error, refetch };
};
