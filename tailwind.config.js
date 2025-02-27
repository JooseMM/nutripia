/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,ts}"],
  theme: {
    fontFamily: {
      serif: ['"Open Sans"'],
    },
    extend: {
      colors: {
        pewter: "#6B7973", // box font
        "primary-purple": "#8878A5", // primary color
        "lavender-blush": "#EEEBF2", // background
        "lavender-purple": "#B8AEC9", // might be useful ??
        "lavender-gray": "#DDDAE2", // line separator
        "lavender-white": "#FAFAFB", // line separator
        "white-lavender": "#F3F2F6", // box background
        "dark-slate-grape": "#5F5373",
        charcoal: "#313131", // font color
        "soft-charcoal": "#5A5A5A",
        "lighter-charcoal": "#737373",
        "wrong-input": "#EF6868",
        red: "#BA6874",
        "red-dark": "#3F1D22",
      },
      spacing: {
        "big-container": "70%",
        "small-container": "35%",
        "mobile-padding": "5vw",
        "desktop-padding": "10vw",
      },
      backgroundImage: {
        "check-icon": "url('assets/icons/check-icon.svg')",
        "uncheck-icon": "url('assets/icons/uncheck-icon.svg')",
        "login-image": "url('assets/images/login-bg.webp')",
        "register-image": "url('assets/images/register-bg.webp')",
      },
    },
  },
  plugins: [],
};
