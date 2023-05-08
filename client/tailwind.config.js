export default {
  mode: "jit",
  purge: ["./src/**/*.{js,jsx,ts,tsx}", "./index.html"],
  theme: {
    extend: {
      backgroundColor: {
        "bg-main-custom": "#EAF2F8",
        "bg-navbar-custom": "#161b21 ",
        "bg-login-custom": "#E0E7FF ",
      },
    },
  },

  plugins: [],
};
