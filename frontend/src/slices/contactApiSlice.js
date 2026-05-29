import { CONTACTS_URL } from "../constants";
import { apiSlice } from "./apiSlice";

export const contactApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createContact: builder.mutation({
      query: (data) => ({
        url: CONTACTS_URL,
        method: "POST",
        body: data,
      }),
    }),
    getContacts: builder.query({
      query: () => ({
        url: CONTACTS_URL,
      }),
      providesTags: ["Contact"],
      keepUnusedDataFor: 5,
    }),
    deleteContact: builder.mutation({
      query: (id) => ({
        url: `${CONTACTS_URL}/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Contact"],
    }),
  }),
});

export const {
  useCreateContactMutation,
  useGetContactsQuery,
  useDeleteContactMutation,
} = contactApiSlice;
