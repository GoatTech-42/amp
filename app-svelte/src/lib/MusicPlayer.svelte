<script>
	import { onDestroy } from "svelte";
	import { music, musicSeek, musicStop } from "./store.js";
	import { api } from "./api.js";
	import { fmtT } from "./util.js";
	import { ICON } from "./icons.js";

	let au, cur = null, loading = false, playing = false, t = 0, dur = 0, trackId = "";
	let loadSeq = 0;
	$: track = $music && $music.items[$music.idx] ? $music.items[$music.idx] : null;
	$: if (track && track.id !== trackId) { trackId = track.id; loadAudio(track.id); }
	$: if (!track && trackId) { trackId = ""; if (au) { au.pause(); au.src = ""; } cur = null; }

	async function loadAudio(id) {
		const seq = ++loadSeq;
		loading = true; playing = false; t = 0; dur = 0;
		try {
			const d = await api("watch?v=" + encodeURIComponent(id));
			if (seq !== loadSeq) return;
			// best audio: the hd m4a track; else the smallest progressive stream
			let src = d.hd && d.hd.audio ? d.hd.audio : "";
			if (!src && (d.streams || []).length) src = d.streams[d.streams.length - 1].src;
			if (!src) { loading = false; return; }
			cur = d;
			au.src = src;
			au.play().then(() => { if (seq === loadSeq) playing = true; }).catch(() => {});
		} catch (e) {}
		loading = false;
	}
	function toggle() { if (!au || !au.src) return; if (au.paused) { au.play().then(() => (playing = true)).catch(() => {}); } else { au.pause(); playing = false; } }
	function seek(e) {
		if (!au || !dur) return;
		const r = e.currentTarget.getBoundingClientRect();
		au.currentTime = Math.max(0, Math.min(1, (e.clientX - r.left) / r.width)) * dur;
	}
	onDestroy(() => { if (au) au.pause(); });
</script>

<audio bind:this={au} preload="auto"
	on:timeupdate={() => { t = au.currentTime; dur = au.duration || dur; }}
	on:loadedmetadata={() => { dur = au.duration || 0; }}
	on:ended={() => musicSeek(1)}></audio>

{#if track}
	<div class="mpbar">
		<img class="mpthumb" src={track.thumb || ""} alt="">
		<div class="mpinfo">
			<b>{track.title}</b>
			<span class="dim">{track.uploader || ""}{loading ? " · loading" : ""}</span>
		</div>
		<div class="mpctl">
			<button class="mpbtn mpprev" on:click={() => musicSeek(-1)} disabled={$music.idx === 0}>{@html ICON.play}</button>
			<button class="mpbtn mpplay" on:click={toggle}>{@html playing ? ICON.pause : ICON.play}</button>
			<button class="mpbtn" on:click={() => musicSeek(1)} disabled={$music.idx >= $music.items.length - 1}>{@html ICON.play}</button>
		</div>
		<span class="mptime">{fmtT(t)} / {fmtT(dur)}</span>
		<button class="mpbtn mpclose" on:click={musicStop}>×</button>
		<div class="mpprog" on:click={seek}><div class="mpprogfill" style="width:{dur ? (t / dur) * 100 : 0}%"></div></div>
	</div>
{/if}
