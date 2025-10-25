import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
const baseUrl = 'http://localhost:8000/api';

export const api = createApi({
  reducerPath: 'energyApi',
  baseQuery: fetchBaseQuery({ baseUrl }),
  endpoints: (builder) => ({
    getEnergyGenerationRecords: builder.query({
      query: ({ id, groupBy }) => `energy-generation-records/solar-unit/${id}?groupBy=${groupBy}`,
    }),
  }),
})

export const { useGetEnergyGenerationRecordsQuery } = api

