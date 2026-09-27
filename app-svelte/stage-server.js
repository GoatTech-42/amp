// jetstream staging: static dist + API proxy to ramjet (cookie injected server-side)
const http = require("http");
const fs = require("fs");
const path = require("path");
const ROOT = __dirname + "/dist";
const COOKIE = "rj_session=5c4a8f0a01caf7572593d01301bb4f6fa1c24f274c1e68917c54eae78a862d21";
const MIME = { ".html": "text/html; charset=utf-8", ".js": "text/javascript; charset=utf-8", ".css": "text/css; charset=utf-8", ".svg": "image/svg+xml", ".png": "image/png", ".webmanifest": "application/manifest+json" };
http.createServer((req, res) => {
	const u = new URL(req.url, "http://x");
	if (u.pathname.startsWith("/api/jetstream/") || u.pathname === "/rjcrypto.js") {
		const p = http.request({ host: "127.0.0.1", port: 14204, path: req.url, method: req.method, headers: { cookie: COOKIE, accept: req.headers.accept || "*/*" } }, (r) => {
			res.writeHead(r.statusCode, r.headers);
			r.pipe(res);
		});
		p.on("error", () => { res.writeHead(502); res.end("proxy error"); });
		req.pipe(p);
		return;
	}
	let fp = path.join(ROOT, u.pathname === "/" ? "index.html" : u.pathname);
	if (!fp.startsWith(ROOT)) { res.writeHead(403); return res.end(); }
	fs.readFile(fp, (err, data) => {
		if (err) { // SPA fallback
			fs.readFile(path.join(ROOT, "index.html"), (e2, d2) => {
				if (e2) { res.writeHead(404); return res.end(); }
				res.writeHead(200, { "content-type": "text/html; charset=utf-8" }); res.end(d2);
			});
			return;
		}
		res.writeHead(200, { "content-type": MIME[path.extname(fp)] || "application/octet-stream", "cache-control": "no-cache" });
		res.end(data);
	});
}).listen(14206, "127.0.0.1", () => console.log("staging on 14206"));
