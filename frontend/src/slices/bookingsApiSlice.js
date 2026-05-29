import { BOOKINGS_URL } from "../constants";
import { apiSlice } from "./apiSlice";

export const bookingsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createBooking: builder.mutation({
      query: (data) => ({
        url: BOOKINGS_URL,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Booking"],
    }),
    getBookingById: builder.query({
      query: (id) => ({
        url: `${BOOKINGS_URL}/${id}`,
      }),
      keepUnusedDataFor: 5,
    }),
    getMyBookings: builder.query({
      query: () => ({
        url: `${BOOKINGS_URL}/mybookings`,
      }),
      keepUnusedDataFor: 5,
      providesTags: ["Booking"],
    }),
    getBookings: builder.query({
      query: () => ({
        url: BOOKINGS_URL,
      }),
      keepUnusedDataFor: 5,
      providesTags: ["Booking"],
    }),
    createPaymentSession: builder.mutation({
      query: (id) => ({
        url: `${BOOKINGS_URL}/${id}/pay`,
        method: "POST",
      }),
    }),
    updateBookingToPaid: builder.mutation({
      query: (id) => ({
        url: `${BOOKINGS_URL}/${id}/paid`,
        method: "PUT",
      }),
      invalidatesTags: ["Booking"],
    }),
    updateBookingStatus: builder.mutation({
      query: ({ id, status }) => ({
        url: `${BOOKINGS_URL}/${id}/status`,
        method: "PUT",
        body: { status },
      }),
      invalidatesTags: ["Booking"],
    }),
    updateBookingIdentity: builder.mutation({
      query: ({ id, proofOfIdentity }) => ({
        url: `${BOOKINGS_URL}/${id}/verify-identity`,
        method: "PUT",
        body: { proofOfIdentity },
      }),
      invalidatesTags: ["Booking"],
    }),
  }),
});

export const {
  useCreateBookingMutation,
  useGetBookingByIdQuery,
  useGetMyBookingsQuery,
  useGetBookingsQuery,
  useCreatePaymentSessionMutation,
  useUpdateBookingToPaidMutation,
  useUpdateBookingStatusMutation,
  useUpdateBookingIdentityMutation,
} = bookingsApiSlice;
