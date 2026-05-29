import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { axiosInstance, getErrorObject, useMutationHelper } from "./apiSlice";
import { CONTACTS_URL } from "../constants";

// Thunks
export const createContact = createAsyncThunk(
  "contacts/createContact",
  async (data, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(CONTACTS_URL, data);
      return response.data;
    } catch (error) {
      return rejectWithValue(getErrorObject(error));
    }
  }
);

export const getContacts = createAsyncThunk(
  "contacts/getContacts",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(CONTACTS_URL);
      return response.data;
    } catch (error) {
      return rejectWithValue(getErrorObject(error));
    }
  }
);

export const deleteContact = createAsyncThunk(
  "contacts/deleteContact",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.delete(`${CONTACTS_URL}/${id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(getErrorObject(error));
    }
  }
);

// Initial State
const initialState = {
  contacts: [],
  loading: false,
  error: null,
};

// Slice
const contactsSlice = createSlice({
  name: "contacts",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getContacts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getContacts.fulfilled, (state, action) => {
        state.loading = false;
        state.contacts = action.payload;
      })
      .addCase(getContacts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default contactsSlice.reducer;

// Custom Hooks mimicking RTK Query API
export const useCreateContactMutation = () => useMutationHelper(createContact);
export const useDeleteContactMutation = () => useMutationHelper(deleteContact);

export const useGetContactsQuery = (arg, options = {}) => {
  const dispatch = useDispatch();
  const { contacts, loading, error } = useSelector((state) => state.contacts);

  const refetch = useCallback(() => {
    dispatch(getContacts());
  }, [dispatch]);

  useEffect(() => {
    if (!options.skip) {
      dispatch(getContacts());
    }
  }, [dispatch, options.skip]);

  return { data: contacts, isLoading: loading, error, refetch };
};
