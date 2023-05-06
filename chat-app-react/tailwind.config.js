/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        "gray-blur": "#888",
      },
      backgroundColor: {
        "btn-main": "#05a081",
        "btn-github": "#111",
        "btn-google": "#4267b2",
        blackOverlay: "rgba(0, 0 ,0 ,0.5)",
        "hover-image": "rgba(0, 0, 0, 0.4)",
        "main-upload": "#f7f7f7",
      },
      boxShadow: {
        header: "rgba(17, 17, 26, 0.1) 0px 0px 16px",
        "modal-header": "rgba(149, 157, 165, 0.2) 0px 8px 24px",
        search: "rgba(0, 0, 0, 0.24) 0px 3px 8px",
      },
      fontSize: {
        "sider-bar": ["0.9rem", "1.35rem"],
      },
    },
  },
  plugins: [],
};
