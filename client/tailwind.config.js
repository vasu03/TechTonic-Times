/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "node_modules/flowbite-react/lib/esm/**/*.js",
  ],
  theme: {
    extend: {},
    screens: {
      'sm': '500px',
      // default => @media (min-width: 640px) { ... }

      'md': '768px',
      // default => @media (min-width: 768px) { ... }

      'lg': '1024px',
      // default => @media (min-width: 1024px) { ... }

      'xl': '1280px',
      // default => @media (min-width: 1280px) { ... }

      '2xl': '1536px',
      // default => @media (min-width: 1536px) { ... }
    }
  },
  plugins: [
    require("flowbite/plugin"),
    require("tailwind-scrollbar"),
  ],
}