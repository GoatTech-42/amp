import { get } from "svelte/store";
import { rjLowData } from "./store.js";

export async function api(path) {
	for (let attempt = 0; attempt < 2; attempt++) {
		try {
			const r = await fetch("/api/jetstream/" + path);
			if (r.status === 401) { location.href = "/login"; throw new Error("locked"); }
			if (!r.ok) {
				let msg = "api " + r.status;
				try { const j = await r.json(); if (j && j.error) msg = j.error; } catch (e2) {}
				throw new Error(msg);
			}
			return await r.json();
		} catch (e) {
			if (e.message === "locked" || attempt === 1) throw e;
			await new Promise((res) => setTimeout(res, 1200));
		}
	}
}
export function prefetch(path) { if (get(rjLowData)) return; fetch("/api/jetstream/" + path).catch(() => {}); }
