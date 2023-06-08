// import { defineConfig } from "vite";
// import react from "@vitejs/plugin-react";

// // // https://vitejs.dev/config/
// // export default defineConfig({
// //   plugins: [react()],
// // })
// export default {
//   plugins: [react()],
//   server: {
//     proxy: {
//       "/api": {
//         target: import.meta.env.VITE_API_BASE_URL,
//         changeOrigin: true,
//         secure: false,
//         ws: true,
//       },
//     },
//   },
// };

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ mode }) => {
  const isProduction = mode === "production";
  const apiUrl = isProduction
    ? "https://organizeme.vercel.app"
    : "http://localhost:3000";

  return {
    plugins: [react()],
    server: {
      proxy: {
        "/api": {
          target: apiUrl,
          changeOrigin: true,
          secure: false,
          ws: true,
        },
      },
    },
  };
});

