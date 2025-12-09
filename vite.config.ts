import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { VitePWA } from "vite-plugin-pwa";

// https://vite.dev/config/
export default defineConfig({
	plugins: [
		react(),
		tailwindcss(),
		VitePWA({
			registerType: "autoUpdate",
			manifest: {
				name: "kk-mini",
				short_name: "kk-mini",
				start_url: "/",
				display: "standalone",
				background_color: "#ffffff",
				theme_color: "#ffffff",
				icons: [
					{ src: "/icon-192x192.png", sizes: "192x192", type: "image/png" },
					{ src: "/icon-512x512.png", sizes: "512x512", type: "image/png" },
				],
			},
		}),
	],
});
