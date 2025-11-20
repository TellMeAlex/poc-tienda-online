import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const BASE_URL = 'https://airis-api-711296505139.europe-southwest1.run.app';

export const airisApi = createApi({
  reducerPath: 'airisApi',
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL,
    prepareHeaders: (headers, { getState }) => {
      const token = getState().auth.token;
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['Products', 'UserMood', 'Auth'],
  endpoints: (builder) => ({
    // Authentication
    login: builder.mutation({
      query: ({ email, password }) => ({
        url: '/auth/token',
        method: 'POST',
        params: {
          user_email: email,
          user_password: password,
        },
      }),
      invalidatesTags: ['Auth'],
    }),

    // Get suggested products based on search query (vector embeddings)
    getSuggestedProducts: builder.query({
      query: (searchQuery) => ({
        url: '/operation/suggested-products',
        params: { query: searchQuery },
      }),
      providesTags: ['Products'],
    }),

    // Get latest user mood
    getLatestUserMood: builder.query({
      query: () => '/operation/latest-user-mood',
      providesTags: ['UserMood'],
    }),

    // Customize product by user (personalized images)
    customizeProductByUser: builder.mutation({
      query: (productId) => ({
        url: '/operation/customize_product_by_user',
        method: 'POST',
        params: { product_id: productId, user_id: 1 },
      }),
      invalidatesTags: ['Products'],
    }),

    // Get catalog products
    getCatalogProducts: builder.query({
      query: () => '/operation/get_catalog_products',
      providesTags: ['Products'],
    }),

    // Get image by path
    getImage: builder.query({
      query: (imagePath) => `/image/${imagePath}`,
    }),
  }),
});

export const {
  useLoginMutation,
  useGetSuggestedProductsQuery,
  useGetLatestUserMoodQuery,
  useCustomizeProductByUserMutation,
  useGetCatalogProductsQuery,
  useGetImageQuery,
} = airisApi;
