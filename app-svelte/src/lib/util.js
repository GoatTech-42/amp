export function compact(n) {
	n = Number(n) || 0;
	if (n >= 1e9) return (n / 1e9).toFixed(1).replace(/\.0$/, "") + "B";
	if (n >= 1e6) return (n / 1e6).toFixed(1).replace(/\.0$/, "") + "M";
	if (n >= 1e3) return (n / 1e3).toFixed(1).replace(/\.0$/, "") + "K";
	return "" + n;
}
export const fmtViews = (v) => compact(v) + " views";
export function fmtLikes(x) {
	const n = Number(String(x).replace(/[^\d]/g, ""));
	if (!isFinite(n) || n < 10000) return x;
	return compact(n);
}
export function durToSec(d) {
	const m = /^(\d+):(\d\d)$/.exec(d || "");
	return m ? Number(m[1]) * 60 + Number(m[2]) : 0;
}
export function fmtT(sec) {
	sec = Math.max(0, Math.floor(sec || 0));
	return Math.floor(sec / 60) + ":" + String(sec % 60).padStart(2, "0");
}
export function idle(fn) {
	if ("requestIdleCallback" in window) requestIdleCallback(fn, { timeout: 4000 });
	else setTimeout(fn, 1600);
}
// paste a youtube link anywhere we accept input -> straight to its page
export function routeUrl(raw) {
	let m;
	if ((m = /(?:shorts\/|watch\?[^\s]*v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/.exec(raw))) return "#/w/" + m[1];
	if ((m = /[?&]list=([a-zA-Z0-9_-]{10,80})/.exec(raw))) return "#/p/" + m[1];
	if ((m = /channel\/([a-zA-Z0-9_-]{20,40})/.exec(raw))) return "#/c/" + m[1];
	return null;
}
