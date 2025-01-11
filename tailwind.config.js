/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}"
  ],
  theme: {
    colors: {
      "green": "#5B9279",
      "deep-dark-green": "#395246",
      "dark-green": "#38594A",
      "light-green": "#78A591",
      "light-grayish-green": "#607A6E",
      "separator": "#DAE2DF",
      "white": "#fff"
    },
    fontFamily: {
      "body": ['"Open Sans"', '"Montserrat", serif' ],
      "header": ['"Open Sans"' ]
    },
    extend: {
      padding: {
        'mobile-padding': '5vw'
      }
    },
  },
  plugins: [],
}

