import { useState, useCallback } from "react";
import { useDispatch } from "react-redux";
import axios from "axios";
import { BASE_URL } from "../constants";

// Create custom Axios instance
export const axiosInstance = axios.create({
  baseURL: BASE_URL,
});

// Configure request interceptor to dynamically inject the user JWT token
axiosInstance.interceptors.request.use(
  (config) => {
    const userInfo = localStorage.getItem("userInfo")
      ? JSON.parse(localStorage.getItem("userInfo"))
      : null;
    if (userInfo && userInfo.token) {
      config.headers.authorization = `Bearer ${userInfo.token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Standardized error handler to align Axios errors with RTK Query's format
export const getErrorObject = (error) => {
  return {
    status: error.response?.status || 500,
    data: error.response?.data || { message: error.message || "An unexpected error occurred" },
  };
};

// Custom mutation hook builder
export const useMutationHelper = (thunk) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const trigger = useCallback((data) => {
    setLoading(true);
    setError(null);
    
    const promise = dispatch(thunk(data)).then((action) => {
      setLoading(false);
      if (thunk.fulfilled.match(action)) {
        return { data: action.payload };
      } else {
        const err = action.payload || { message: "Mutation failed" };
        setError(err);
        throw err;
      }
    });

    promise.unwrap = async () => {
      const res = await promise;
      return res.data;
    };

    return promise;
  }, [dispatch, thunk]);

  return [trigger, { isLoading: loading, error }];
};

// Empty apiSlice to maintain potential backward compatibility
export const apiSlice = {};
