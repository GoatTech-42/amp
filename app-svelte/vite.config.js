import { defineConfig } from "vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";
import tailwindcss from "@tailwindcss/vite";
const BUILD_ID = new Date().toISOString().slice(2, 16).replace("T", " ") + " PT-ish " + Math.random().toString(36).slice(2, 6);
export default defineConfig({
	define: { __BUILD_ID__: JSON.stringify(BUILD_ID) },
	base: "/amp/",
	plugins: [tailwindcss(), svelte()],
	build: { target: "es2020", chunkSizeWarningLimit: 900 },
});
