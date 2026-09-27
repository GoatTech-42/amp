import { writable, get } from "svelte/store";

// amp session store: the audio queue lives for this page session.
export const music = writable(null); // { items: [{id,title,uploader,thumb,dur}], idx }
export function playTracks(items, idx = 0) { music.set({ items, idx }); }
export function musicSeek(d) { music.update((m) => (m ? { ...m, idx: Math.max(0, Math.min(m.idx + d, m.items.length - 1)) } : m)); }
export function musicStop() { music.set(null); }

// data saver is one shared state across ramjet addons (rj.settings localStorage)
export const rjLowData = writable(false);
try { const s = JSON.parse(localStorage.getItem("rj.settings") || "null"); if (s) rjLowData.set(!!s.lowData); } catch (e) {}
