<script lang="ts">
	import './layout.css';
	import './page.css';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href="/assets/dlst.gif" type="image/gif" />
</svelte:head>

{@render children()}
