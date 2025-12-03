import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { getAllSolarUnitsById } from '../api/Solar-unit';

const baseUrl = 'http://localhost:8000/api';

export const api = createApi({
  reducerPath: 'energyApi',
  baseQuery: fetchBaseQuery({
    baseUrl,
    prepareHeaders: async (headers) => {
      const session = window.Clerk?.session;

      if (session) {
        const token = await session.getToken();

        console.log("Clerk Token:", token);

        if (token) {
          headers.set("Authorization", `Bearer ${token}`);
        }
      }

      return headers;
    }
  }),

  endpoints: (builder) => ({
    getEnergyGenerationRecords: builder.query({
      query: ({ id, groupBy, limit }) =>
        `energy-generation-records/solar-unit/${id}?groupBy=${groupBy}&limit=${limit}`,
    }),

    getLast24HoursEnergyData: builder.query({
      query: ({ id }) => `energy-generation-records/solar-unit/${id}/last24`,
    }),

    getSolarUnitsByClerkId: builder.query({
      query: () => `solar-units/me`,
    }),

    getSolarStatusStats: builder.query({
      query: () => `solar-units/stats`,
    }),
    getAllSolarUnitsSum: builder.query({
      query: () => `solar-units/total`,
    }),
    getAllSolarUnits: builder.query({
      query: () => `solar-units/`,
    }),
    createSolarUnit: builder.mutation({
      query: (body) => ({
        url: `solar-units/`,
        method: 'POST',
        body,
      }),
    }),
    getSolarUnitById: builder.query({
      query: (id) => `solar-units/${id}`,
    }),
  }),
});

export const {
  useGetEnergyGenerationRecordsQuery,
  useGetLast24HoursEnergyDataQuery,
  useGetSolarUnitsByClerkIdQuery,
  useGetSolarStatusStatsQuery,
  useGetAllSolarUnitsSumQuery,
  useGetAllSolarUnitsQuery,
  useCreateSolarUnitMutation,
  useGetSolarUnitByIdQuery
} = api;
