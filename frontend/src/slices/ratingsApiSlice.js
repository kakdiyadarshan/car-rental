import { RATINGS_URL } from "../constants";
import { apiSlice } from "./apiSlice";

export const ratingsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createOrUpdateRating: builder.mutation({
      query: (data) => ({
        url: RATINGS_URL,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Rating"],
    }),
    getMyRatings: builder.query({
      query: () => ({
        url: `${RATINGS_URL}/myratings`,
      }),
      keepUnusedDataFor: 5,
      providesTags: ["Rating"],
    }),
    getCarRating: builder.query({
      query: (carId) => ({
        url: `${RATINGS_URL}/car/${carId}`,
      }),
      keepUnusedDataFor: 5,
    }),
    getAllRatings: builder.query({
      query: () => ({
        url: RATINGS_URL,
      }),
      keepUnusedDataFor: 5,
      providesTags: ["Rating"],
    }),
  }),
});

export const {
  useCreateOrUpdateRatingMutation,
  useGetMyRatingsQuery,
  useGetCarRatingQuery,
  useGetAllRatingsQuery,
} = ratingsApiSlice;
