import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// Use proxy in development, full URL in production
const BASE_URL = import.meta.env.DEV
  ? '/api/loader'
  : 'https://airis-loader-711296505139.europe-southwest1.run.app';

export const airisLoaderApi = createApi({
  reducerPath: 'airisLoaderApi',
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL,
  }),
  tagTypes: ['UserImages', 'ProductImages'],
  endpoints: (builder) => ({
    // Upload user images
    uploadUserImages: builder.mutation({
      query: ({ userId, imagesKind, images }) => {
        const formData = new FormData();
        formData.append('user_id', userId);
        formData.append('images_kind', imagesKind);
        
        // Append multiple images
        images.forEach((image) => {
          formData.append('images', image);
        });

        return {
          url: '/users/user-images',
          method: 'POST',
          body: formData,
        };
      },
      invalidatesTags: ['UserImages'],
    }),

    // Create product with images
    createProductWithImages: builder.mutation({
      query: ({
        productName,
        productDescription,
        productGender,
        productPrice,
        productRank = 0,
        productCharacteristics = [],
        images,
        imagesKind,
      }) => {
        const formData = new FormData();
        formData.append('product_name', productName);
        if (productDescription) {
          formData.append('product_description', productDescription);
        }
        formData.append('product_gender', productGender);
        formData.append('product_price', productPrice);
        formData.append('product_rank', productRank);
        
        // Append characteristics as JSON array
        productCharacteristics.forEach((char) => {
          formData.append('product_characteristics', char);
        });

        formData.append('images_kind', imagesKind);
        
        // Append multiple images
        images.forEach((image) => {
          formData.append('images', image);
        });

        return {
          url: '/products/products-with-images',
          method: 'POST',
          body: formData,
        };
      },
      invalidatesTags: ['ProductImages'],
    }),

    // Add images to existing product
    addProductImages: builder.mutation({
      query: ({ productId, images, imagesKind }) => {
        const formData = new FormData();
        formData.append('product_id', productId);
        formData.append('images_kind', imagesKind);
        
        // Append multiple images
        images.forEach((image) => {
          formData.append('images', image);
        });

        return {
          url: '/products/add-product-images',
          method: 'POST',
          body: formData,
        };
      },
      invalidatesTags: ['ProductImages'],
    }),
  }),
});

export const {
  useUploadUserImagesMutation,
  useCreateProductWithImagesMutation,
  useAddProductImagesMutation,
} = airisLoaderApi;
