// env.d.ts
/// <reference types="vite/client" />

declare namespace NodeJS {
  interface ProcessEnv {
    DATABASE_URL: string;
    NODE_ENV: 'development' | 'production';
  }
}