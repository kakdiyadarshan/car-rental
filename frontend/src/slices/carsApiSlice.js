import { CARS_URL } from "../constants";
import { apiSlice } from "./apiSlice";

export const carsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getCars: builder.query({
      query: () => ({
        url: CARS_URL,
      }),
      keepUnusedDataFor: 5,
      providesTags: ["Car"],
    }),
    getCarById: builder.query({
      query: (id) => ({
        url: `${CARS_URL}/${id}`,
      }),
      keepUnusedDataFor: 5,
    }),
    createCar: builder.mutation({
      query: (data) => ({
        url: CARS_URL,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Car"],
    }),
    updateCar: builder.mutation({
      query: (data) => ({
        url: `${CARS_URL}/${data.id}`,
        method: "PUT",
        body: data.formData,
      }),
      invalidatesTags: ["Car"],
    }),
    deleteCar: builder.mutation({
      query: (id) => ({
        url: `${CARS_URL}/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Car"],
    }),
  }),
});

export const {
  useGetCarsQuery,
  useGetCarByIdQuery,
  useCreateCarMutation,
  useUpdateCarMutation,
  useDeleteCarMutation,
} = carsApiSlice;
