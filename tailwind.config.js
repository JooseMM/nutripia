/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}"
  ],
  theme: {
    colors: {
      "pewter": "#6B7973", // box font
      "lavander-gray":"#8878A5", // primary color
      "lavender-blush": "#EEEBF2", // background
      "lavender-purple": "#A093B7", // might be useful ??
      "lavender-gray": "#DDDAE2", // line separator
      "white-lavender": "#F3F2F6", // box background
      "dark-slate-grape": "#5F5373",
      "charcoal":"#313131", // font color
    },
    fontFamily: {
      "serif": ['"Open Sans"']
    },
    extend: {
      padding: {
        'mobile-padding': '5vw',
        'desktop-padding': '10vw'
      }
    },
  },
  plugins: [],
}

