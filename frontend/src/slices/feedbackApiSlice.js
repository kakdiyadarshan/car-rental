import { apiSlice } from './apiSlice';

export const feedbackApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getFeedback: builder.query({
      query: () => ({
        url: '/api/feedback',
      }),
      providesTags: ['Feedback'],
    }),
    createFeedback: builder.mutation({
      query: (data) => ({
        url: '/api/feedback',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Feedback'],
    }),
    updateFeedback: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/api/feedback/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['Feedback'],
    }),
    getMyFeedback: builder.query({
      query: () => ({
        url: '/api/feedback/mine',
      }),
      providesTags: ['Feedback'],
    }),
    deleteFeedback: builder.mutation({
      query: (id) => ({
        url: `/api/feedback/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Feedback'],
    }),
  }),
});

export const {
  useGetFeedbackQuery,
  useCreateFeedbackMutation,
  useDeleteFeedbackMutation,
  useUpdateFeedbackMutation,
  useGetMyFeedbackQuery,
} = feedbackApiSlice;
