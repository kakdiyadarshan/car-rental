import { BRANDS_URL } from "../constants";
import { apiSlice } from "./apiSlice";

export const brandsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getBrands: builder.query({
      query: () => ({
        url: BRANDS_URL,
      }),
      keepUnusedDataFor: 5,
      providesTags: ["Brand"],
    }),
    createBrand: builder.mutation({
      query: (data) => ({
        url: `${BRANDS_URL}?folder=brand`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Brand"],
    }),
    updateBrand: builder.mutation({
      query: (data) => ({
        url: `${BRANDS_URL}/${data.id}?folder=brand`,
        method: "PUT",
        body: data.formData,
      }),
      invalidatesTags: ["Brand"],
    }),
    deleteBrand: builder.mutation({
      query: (id) => ({
        url: `${BRANDS_URL}/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Brand"],
    }),
  }),
});

export const {
  useGetBrandsQuery,
  useCreateBrandMutation,
  useUpdateBrandMutation,
  useDeleteBrandMutation,
} = brandsApiSlice;
