import { defineConfig } from 'orval';

/**
 * Generates a typed service layer + TanStack Query hooks from your backend's
 * OpenAPI spec. Point `input.target` at your backend's swagger/openapi file
 * (URL or local path), then run: npm run api:gen
 */
export default defineConfig({
  api: {
    input: {
      // e.g. 'http://localhost:8080/v3/api-docs' or './openapi.json'
      target: './openapi.json',
    },
    output: {
      mode: 'tags-split', // one folder per API tag — keeps things tidy
      target: './src/api/generated',
      schemas: './src/api/generated/model',
      client: 'react-query',
      prettier: true,
      override: {
        mutator: {
          // Custom axios instance (auth headers, interceptors, base URL).
          path: './src/api/axios-instance.ts',
          name: 'customInstance',
        },
        query: {
          useQuery: true,
          useInfinite: true,
        },
      },
    },
  },
});
