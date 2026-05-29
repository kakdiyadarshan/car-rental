import { OFFERS_URL } from "../constants";
import { apiSlice } from "./apiSlice";

export const offersApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getOffers: builder.query({
      query: () => ({
        url: OFFERS_URL,
      }),
      keepUnusedDataFor: 5,
      providesTags: ["Offer"],
    }),
    createOffer: builder.mutation({
      query: (data) => ({
        url: OFFERS_URL,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Offer"],
    }),
    updateOffer: builder.mutation({
      query: (data) => ({
        url: `${OFFERS_URL}/${data.id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Offer"],
    }),
    deleteOffer: builder.mutation({
      query: (id) => ({
        url: `${OFFERS_URL}/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Offer"],
    }),
  }),
});

export const {
  useGetOffersQuery,
  useCreateOfferMutation,
  useUpdateOfferMutation,
  useDeleteOfferMutation,
} = offersApiSlice;
