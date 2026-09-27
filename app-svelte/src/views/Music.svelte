<script>
	import { api } from "../lib/api.js";
	import { music, playTracks } from "../lib/store.js";

	let q = "", items = null, busy = false, err = false;
	async function search() {
		if (!q.trim()) return;
		busy = true; err = false;
		try {
			const d = await api("search?q=" + encodeURIComponent(q.trim()) + "&filter=videos");
			items = (d.items || []).filter((x) => x && x.id && !x.live);
		} catch (e) { err = true; }
		busy = false;
	}
	function playAll() { if (items && items.length) playTracks(items, 0); }
</script>

<div class="viewfade">
<div class="pad">
		<form class="mussearch" on:submit|preventDefault={search}>
		<input placeholder="search songs, artists..." bind:value={q} />
		<button class="btn amber" type="submit" disabled={busy}>{busy ? "..." : "search"}</button>
	</form>
	{#if items && items.length}
		<button class="btn" style="margin:0 0 10px" on:click={playAll}>play all ({items.length})</button>
	{:else if err}
		<p class="dim">search hiccuped - try again.</p>
	{:else if items && !items.length}
		<p class="dim">nothing came up for that.</p>
	{:else if !items}
		<p class="dim">audio-only. queues keep playing while you look around.</p>
	{/if}
</div>
{#if items && items.length}
	<div class="pllist">
		{#each items as it, i (it.id)}
			<button class="plitem musrow" class:on={$music && $music.items[$music.idx] && $music.items[$music.idx].id === it.id} on:click={() => playTracks(items, i)}>
				<span class="plnum">{i + 1}</span>
				<img loading="lazy" src={it.thumb} alt="">
				<span class="pliteminfo"><b>{it.title}</b><span class="dim">{it.uploader || ""}{it.dur ? " · " + it.dur : ""}</span></span>
			</button>
		{/each}
	</div>
{/if}
</div>
