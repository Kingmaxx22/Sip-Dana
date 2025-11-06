/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL: string
  // more env variables can be declared here
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
