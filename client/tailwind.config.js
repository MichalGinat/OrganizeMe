export default {
  mode: "jit",
  purge: ["./src/**/*.{js,jsx,ts,tsx}", "./index.html"],
  theme: {
    extend: {
      backgroundColor: {
        "bg-main-custom": "#7e869e  ",
        "bg-navbar-custom": "#161b21 ",
        "bg-login-custom": "#E0E7FF ",
      },
    },
  },

  plugins: [],
};
