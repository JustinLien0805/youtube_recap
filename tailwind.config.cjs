/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {},
  },
  daisyui: {
    themes: [
      {
        mytheme: {
          primary: "#dc2626",

          secondary: "#e0219a",

          accent: "#e041cb",

          neutral: "#dc2626",

          "base-100": "#171717",

          info: "#44B8EE",

          success: "#197B5C",

          warning: "#F3CA16",

          error: "#E6403D",
        },
      },
    ],
  },
  plugins: [require("daisyui")],
};
