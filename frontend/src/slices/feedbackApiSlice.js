import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { axiosInstance, getErrorObject, useMutationHelper } from "./apiSlice";

// Thunks
export const getFeedback = createAsyncThunk(
  "feedback/getFeedback",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/api/feedback");
      return response.data;
    } catch (error) {
      return rejectWithValue(getErrorObject(error));
    }
  }
);

export const createFeedback = createAsyncThunk(
  "feedback/createFeedback",
  async (data, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/api/feedback", data);
      return response.data;
    } catch (error) {
      return rejectWithValue(getErrorObject(error));
    }
  }
);

export const updateFeedback = createAsyncThunk(
  "feedback/updateFeedback",
  async ({ id, ...data }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put(`/api/feedback/${id}`, data);
      return response.data;
    } catch (error) {
      return rejectWithValue(getErrorObject(error));
    }
  }
);

export const getMyFeedback = createAsyncThunk(
  "feedback/getMyFeedback",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/api/feedback/mine");
      return response.data;
    } catch (error) {
      return rejectWithValue(getErrorObject(error));
    }
  }
);

export const deleteFeedback = createAsyncThunk(
  "feedback/deleteFeedback",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.delete(`/api/feedback/${id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(getErrorObject(error));
    }
  }
);

// Initial State
const initialState = {
  feedback: [],
  myFeedback: null,
  loading: false,
  error: null,
};

// Slice
const feedbackSlice = createSlice({
  name: "feedback",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // getFeedback
      .addCase(getFeedback.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getFeedback.fulfilled, (state, action) => {
        state.loading = false;
        state.feedback = action.payload;
      })
      .addCase(getFeedback.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // getMyFeedback
      .addCase(getMyFeedback.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getMyFeedback.fulfilled, (state, action) => {
        state.loading = false;
        state.myFeedback = action.payload;
      })
      .addCase(getMyFeedback.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default feedbackSlice.reducer;

// Custom Hooks mimicking RTK Query API
export const useCreateFeedbackMutation = () => useMutationHelper(createFeedback);
export const useUpdateFeedbackMutation = () => useMutationHelper(updateFeedback);
export const useDeleteFeedbackMutation = () => useMutationHelper(deleteFeedback);

export const useGetFeedbackQuery = (arg, options = {}) => {
  const dispatch = useDispatch();
  const { feedback, loading, error } = useSelector((state) => state.feedback);

  const refetch = useCallback(() => {
    dispatch(getFeedback());
  }, [dispatch]);

  useEffect(() => {
    if (!options.skip) {
      dispatch(getFeedback());
    }
  }, [dispatch, options.skip]);

  return { data: feedback, isLoading: loading, error, refetch };
};

export const useGetMyFeedbackQuery = (arg, options = {}) => {
  const dispatch = useDispatch();
  const { myFeedback, loading, error } = useSelector((state) => state.feedback);

  const refetch = useCallback(() => {
    dispatch(getMyFeedback());
  }, [dispatch]);

  useEffect(() => {
    if (!options.skip) {
      dispatch(getMyFeedback());
    }
  }, [dispatch, options.skip]);

  return { data: myFeedback, isLoading: loading, error, refetch };
};
