/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./src/**/*.{js,jsx,ts,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: {
                    50: '#fdfcf9',
                    100: '#f9f6ed',
                    200: '#f1ead5',
                    300: '#e7d9b5',
                    400: '#d7b56d', // Main gold color from Figma
                    500: '#c9a658',
                    600: '#b5934a',
                    700: '#9c7d3f',
                    800: '#836836',
                    900: '#6d562d',
                },
                dark: {
                    50: '#f6f7f9',
                    100: '#eceef2',
                    200: '#d4dae3',
                    300: '#afbecf',
                    400: '#849cb7',
                    500: '#6480a1',
                    600: '#506889',
                    700: '#425570',
                    800: '#39485e',
                    900: '#0f1c2d', // Main dark color from Figma
                },
                success: {
                    400: '#5ec937', // Green from Figma
                    500: '#4ade80',
                }
            },
            fontFamily: {
                'sans': ['Quicksand', 'system-ui', 'sans-serif'],
                'open': ['Open Sans', 'system-ui', 'sans-serif'],
            },
        },
    },
    plugins: [],
}
