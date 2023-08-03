/** @type {import('tailwindcss').Config} */
const colors = require("tailwindcss/colors");

module.exports = {
	content: ["./src/**/*.{js,jsx,ts,tsx}"],
	theme: {
		colors: {
			"logo-blue": "#39529D",
			"logo-lblue": "#779EE9",
			"light-blue": "#C2D5F9",
			"hover-blue": "#b2cbfa",
			blue: "#779EE9",
			white: "#FFFFFF",
			black: "#000000",
			"delete-red": "#ef4444",
			"edit-green": "#059668",
			gray: colors.gray,
			slate: colors.slate,
			zinc: colors.zinc,
		},
		borderWidth: {
			DEFAULT: "1px",
			0: "0",
			2: "2px",
			3: "3px",
			4: "4px",
			6: "6px",
			8: "8px",
		},
		// margin: {
		//   '2.75': '0.6875rem',
		// },
		extend: {
			dropShadow: {
				custom: "0px 4px 4px #98C0EB",
				card: "0px 4px 4px 0px rgba(0, 0, 0, 0.75)",
			},
			height: {
				100: "25rem",
				120: "30rem",
				110: "27.5rem",
				140: "35rem",
			},
			aspectRatio: {
				"9/16": "9/16",
				"3/4": "3/4",
				"1/1.5": "1/1.5",
				"1.5/1": "1.5/1",
			},
			animation: {
				shine: "shine 1s",
			},
			keyframes: {
				shine: {
					"100%": { left: "125%" },
				},
			},
		},
	},
	plugins: [require("@headlessui/tailwindcss")({ prefix: "ui" })],
};
