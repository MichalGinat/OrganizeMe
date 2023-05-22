export default {
  mode: "jit",
  purge: ["./src/**/*.{js,jsx,ts,tsx}", "./index.html"],
  theme: {
    extend: {
      backgroundImage: (theme) => ({
        login: "url('../../src/assets/pic.jpg')",
      }),
    
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};

