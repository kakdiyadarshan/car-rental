import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { axiosInstance, getErrorObject, useMutationHelper } from "./apiSlice";
import { USERS_URL } from "../constants";

// Import auth thunks and hooks to re-export for backward compatibility
import { 
  loginUser, 
  registerUser, 
  logoutUser, 
  updateProfile,
  useLoginMutation,
  useRegisterMutation,
  useLogoutMutation,
  useUpdateProfileMutation 
} from "./authSlice";

export { 
  loginUser, 
  registerUser, 
  logoutUser, 
  updateProfile,
  useLoginMutation,
  useRegisterMutation,
  useLogoutMutation,
  useUpdateProfileMutation 
};

// Thunks specific to Users
export const getUserProfile = createAsyncThunk(
  "users/profile",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`${USERS_URL}/profile`);
      return response.data;
    } catch (error) {
      return rejectWithValue(getErrorObject(error));
    }
  }
);

export const forgotPassword = createAsyncThunk(
  "users/forgotPassword",
  async (data, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(`${USERS_URL}/forgotpassword`, data);
      return response.data;
    } catch (error) {
      return rejectWithValue(getErrorObject(error));
    }
  }
);

export const resetPassword = createAsyncThunk(
  "users/resetPassword",
  async ({ token, password }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put(`${USERS_URL}/resetpassword/${token}`, { password });
      return response.data;
    } catch (error) {
      return rejectWithValue(getErrorObject(error));
    }
  }
);

export const getUsers = createAsyncThunk(
  "users/getUsers",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(USERS_URL);
      return response.data;
    } catch (error) {
      return rejectWithValue(getErrorObject(error));
    }
  }
);

export const deleteUser = createAsyncThunk(
  "users/deleteUser",
  async (userId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.delete(`${USERS_URL}/${userId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(getErrorObject(error));
    }
  }
);

// Initial State
const initialState = {
  users: [],
  profile: null,
  loading: false,
  error: null,
};

// Slice
const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // getUsers
      .addCase(getUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
      })
      .addCase(getUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // getUserProfile
      .addCase(getUserProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload;
      })
      .addCase(getUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default usersSlice.reducer;

// Custom Hooks mimicking RTK Query API
export const useForgotPasswordMutation = () => useMutationHelper(forgotPassword);
export const useResetPasswordMutation = () => useMutationHelper(resetPassword);
export const useDeleteUserMutation = () => useMutationHelper(deleteUser);

export const useProfileQuery = (arg, options = {}) => {
  const dispatch = useDispatch();
  const { profile, loading, error } = useSelector((state) => state.users);

  const refetch = useCallback(() => {
    dispatch(getUserProfile());
  }, [dispatch]);

  useEffect(() => {
    if (!options.skip) {
      dispatch(getUserProfile());
    }
  }, [dispatch, options.skip]);

  return { data: profile, isLoading: loading, error, refetch };
};

export const useGetUsersQuery = (arg, options = {}) => {
  const dispatch = useDispatch();
  const { users, loading, error } = useSelector((state) => state.users);

  const refetch = useCallback(() => {
    dispatch(getUsers());
  }, [dispatch]);

  useEffect(() => {
    if (!options.skip) {
      dispatch(getUsers());
    }
  }, [dispatch, options.skip]);

  return { data: users, isLoading: loading, error, refetch };
};
