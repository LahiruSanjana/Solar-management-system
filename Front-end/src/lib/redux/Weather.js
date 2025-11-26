import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
const baseUrl = 'https://api.weatherapi.com/v1';

export const weatherApi = createApi({
  reducerPath: 'weatherApi',
  baseQuery: fetchBaseQuery({ baseUrl }),

  endpoints: (builder) => ({
    getEnvironmentCondition: builder.query({
      query: ({ API_KEY }) =>
        `${baseUrl}/current.json?key=${API_KEY}&q=Galtude`,
    }),
  }),
});

export const { useGetEnvironmentConditionQuery } = weatherApi;
