<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';

	onMount(() => {
		goto('/docs', { replaceState: true });
	});
</script>

<svelte:head>
	<title>Docs | RickZin</title>
</svelte:head>

<div class="min-h-screen py-24">
	<div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
		<div class="card text-center">
			<p class="text-slate-400">Redirecionando…</p>
		</div>
	</div>
</div>
