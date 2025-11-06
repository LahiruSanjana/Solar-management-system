import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
const baseUrl = 'http://localhost:8000/api';
const baseUrlWeather='http://api.weatherapi.com/v1';

export const api = createApi({
  reducerPath: 'energyApi',
  reducerPath: 'weatherApi',
  baseQuery: fetchBaseQuery({ baseUrl , baseUrlWeather }),
  endpoints: (builder) => ({
    getEnergyGenerationRecords: builder.query({
      query: ({ id, groupBy, limit }) => `energy-generation-records/solar-unit/${id}?groupBy=${groupBy}&limit=${limit}`,
    }),
    getEnvironmentCondition: builder.query({
      query: ({ API_KEY }) => `${baseUrlWeather}/current.json?key=${API_KEY}&q=Galtude`,
    }),
    getLast24HoursEnergyData: builder.query({
      query: ({ id }) => `energy-generation-records/solar-unit/${id}/last24`,
    }),
  }),
})

export const { useGetEnergyGenerationRecordsQuery , useGetEnvironmentConditionQuery , useGetLast24HoursEnergyDataQuery } = api

