<script lang="ts">
	type MediaItem = { url: string; type: 'image' | 'video' };

	let {
		album,
		onclose
	}: {
		album: MediaItem[];
		onclose: () => void;
	} = $props();

	let currentIndex = $state(0);

	function next(e?: Event) {
		e?.preventDefault();
		e?.stopPropagation();
		currentIndex = (currentIndex + 1) % album.length;
	}

	function prev(e?: Event) {
		e?.preventDefault();
		e?.stopPropagation();
		currentIndex = (currentIndex - 1 + album.length) % album.length;
	}

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === 'Escape') onclose();
		if (e.key === 'ArrowRight') next();
		if (e.key === 'ArrowLeft') prev();
	}
</script>

<svelte:window onkeydown={handleKeydown} />

<div class="fixed inset-0 z-[100]">
	<button
		type="button"
		class="absolute inset-0 bg-black/95 backdrop-blur-sm"
		aria-label="Fechar álbum"
		onclick={onclose}
	></button>

	<div class="absolute inset-0 flex items-center justify-center">
		<button
			onclick={onclose}
			class="absolute p-3 text-white/70 hover:text-white hover:bg-white/10 rounded-full transition-all z-[110] bg-black/20"
			style="top: calc(env(safe-area-inset-top) + 1.25rem); right: calc(env(safe-area-inset-right) + 1.25rem);"
			aria-label="Fechar álbum"
		>
			<svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
			</svg>
		</button>

		<button
			type="button"
			onclick={prev}
			disabled={album.length <= 1}
			class="absolute left-2 sm:left-6 top-1/2 -translate-y-1/2 p-2 sm:p-4 text-white rounded-full transition-all z-[110] bg-black/60 shadow-lg backdrop-blur-sm hover:bg-white/20 disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:bg-black/60"
			aria-label="Anterior"
		>
			<svg class="w-8 h-8 sm:w-10 sm:h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
			</svg>
		</button>

		<button
			type="button"
			onclick={next}
			disabled={album.length <= 1}
			class="absolute right-2 sm:right-6 top-1/2 -translate-y-1/2 p-2 sm:p-4 text-white rounded-full transition-all z-[110] bg-black/60 shadow-lg backdrop-blur-sm hover:bg-white/20 disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:bg-black/60"
			aria-label="Próximo"
		>
			<svg class="w-8 h-8 sm:w-10 sm:h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
			</svg>
		</button>

		<div class="w-full h-full flex items-center justify-center p-4 sm:p-12">
			<div
				class="relative w-full max-w-[95vw] sm:max-w-5xl max-h-[85vh] flex flex-col items-center justify-center"
			>
				<div
					class="w-full max-h-[75vh] flex items-center justify-center rounded-2xl overflow-hidden shadow-2xl bg-zinc-900/50 border border-white/10"
				>
					{#if album[currentIndex].type === 'image'}
						<img
							src={album[currentIndex].url}
							alt="Project media {currentIndex + 1}"
							loading="lazy"
							class="max-h-[75vh] w-auto object-contain"
						/>
					{:else}
						<video
							src={album[currentIndex].url}
							controls
							autoplay
							class="max-h-[75vh] w-full aspect-video bg-black"
						>
							<track kind="captions" />
						</video>
					{/if}
				</div>

				<div
					class="mt-6 px-4 py-2 rounded-full bg-white/10 border border-white/10 text-white/80 text-sm font-medium backdrop-blur-md"
				>
					{currentIndex + 1} / {album.length}
				</div>
			</div>
		</div>
	</div>
</div>
