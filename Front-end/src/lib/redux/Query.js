import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { getAllSolarUnitsById } from '../api/Solar-unit';


const backendUrl = import.meta.env.VITE_BACKEND_URL;

const baseUrl = backendUrl
  ? `${backendUrl.startsWith('http') ? backendUrl : 'https://' + backendUrl}/api`
  : 'http://localhost:8000/api';

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

  tagTypes: ['SolarUnitList'],
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
    getAllUsers:builder.query({
      query: () => `users/`,
    }),

    deleteSolarUnit: builder.mutation({
      query: (id) => ({
        url: `solar-units/${id}`,
        method: 'DELETE'
      }),
      invalidatesTags: [{ type: 'SolarUnitList', id: 'LIST' }],
    }),
    updateSolarUnit: builder.mutation({
      query: ({ id, body }) => ({
        url: `solar-units/${id}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: [{ type: 'SolarUnitList', id: 'LIST' }],
    }),
    createPaymentSession: builder.mutation({
      query: (body) => ({
        url: `payments/create-checkout-session`,
        method: 'POST',
        body,
      }),
    }),
    getSessionStatus: builder.query({
      query: (sessionId) => `payments/session-status?sessionId=${sessionId}`,
    }),
    getInvoiceById: builder.query({
      query: (id) => `invoices/${id}`,
    }),
    getAllInvoices: builder.query({
      query: () => `admin/invoices/`,
    }),
    getMyinvoices: builder.query({
      query: () => `invoices/`,
    }),
    updateUser: builder.mutation({
      query: ({ id, body }) => ({
        url: `users/${id}`,
        method: 'PUT',
        body,
      }),
    }),
    deleteUser: builder.mutation({
      query: (id) => ({
        url: `users/${id}`,
        method: 'DELETE'
      }),
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
  useGetSolarUnitByIdQuery,
  useGetAllUsersQuery,
  useDeleteSolarUnitMutation,
  useUpdateSolarUnitMutation,
  useCreatePaymentSessionMutation,
  useGetSessionStatusQuery,
  useGetInvoiceByIdQuery,
  useGetAllInvoicesQuery,
  useGetMyinvoicesQuery,
  useUpdateUserMutation,
  useDeleteUserMutation,
} = api;
