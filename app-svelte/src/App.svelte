<script>
	import Music from "./views/Music.svelte";
	import MusicPlayer from "./lib/MusicPlayer.svelte";
	import { ICON } from "./lib/icons.js";
</script>

<div class="ampshell">
	<header class="amphead">
		<span class="ampmark">{@html ICON.amp}</span>
		<h1>amp</h1>
	</header>
	<Music />
	<MusicPlayer />
</div>
