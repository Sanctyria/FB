<script lang="ts">
	import { onMount } from 'svelte';

	let theme = $state<'light' | 'dark'>('light');

	onMount(() => {
		const savedTheme = window.localStorage.getItem('flameborns-theme');
		if (savedTheme === 'light' || savedTheme === 'dark') {
			theme = savedTheme;
		}
		document.documentElement.dataset.theme = theme;
	});

	function toggleTheme() {
		theme = theme === 'light' ? 'dark' : 'light';
		document.documentElement.dataset.theme = theme;
		window.localStorage.setItem('flameborns-theme', theme);
	}
</script>

<svelte:head>
	<meta name="theme-color" content={theme === 'dark' ? '#171614' : '#f8f5ef'} />
</svelte:head>

<button
	class="theme-toggle"
	type="button"
	onclick={toggleTheme}
	aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
	title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
>
	<span aria-hidden="true">{theme === 'light' ? '☾' : '☀'}</span>
	<span class="theme-toggle-label">{theme === 'light' ? 'Dark' : 'Light'}</span>
</button>
