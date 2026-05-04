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
	let imgLoaded = $state(false);

	// Swipe touch tracking
	let touchStartX = 0;
	let touchStartY = 0;

	function next(e?: Event) {
		e?.preventDefault();
		e?.stopPropagation();
		imgLoaded = false;
		currentIndex = (currentIndex + 1) % album.length;
	}

	function prev(e?: Event) {
		e?.preventDefault();
		e?.stopPropagation();
		imgLoaded = false;
		currentIndex = (currentIndex - 1 + album.length) % album.length;
	}

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === 'Escape') onclose();
		if (e.key === 'ArrowRight') next();
		if (e.key === 'ArrowLeft') prev();
	}

	function handleTouchStart(e: TouchEvent) {
		touchStartX = e.touches[0].clientX;
		touchStartY = e.touches[0].clientY;
	}

	function handleTouchEnd(e: TouchEvent) {
		const dx = e.changedTouches[0].clientX - touchStartX;
		const dy = e.changedTouches[0].clientY - touchStartY;
		// Only trigger if horizontal swipe is dominant and > 50px
		if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 50) {
			if (dx < 0) next();
			else prev();
		}
	}

	// Preload next image
	$effect(() => {
		if (album.length <= 1) return;
		const nextIdx = (currentIndex + 1) % album.length;
		const item = album[nextIdx];
		if (item.type === 'image') {
			const img = new Image();
			img.src = item.url;
		}
	});
</script>

<svelte:window onkeydown={handleKeydown} />

<div
	class="fixed inset-0 z-[100]"
	role="dialog"
	aria-modal="true"
	aria-label="Visualizador de mídia"
>
	<button
		type="button"
		class="absolute inset-0 bg-black/95 backdrop-blur-sm"
		aria-label="Fechar álbum"
		onclick={onclose}
	></button>

	<div class="absolute inset-0 flex items-center justify-center">
		<!-- Botão fechar -->
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

		<!-- Anterior -->
		<button
			type="button"
			onclick={prev}
			disabled={album.length <= 1}
			class="absolute left-2 sm:left-6 top-1/2 -translate-y-1/2 p-3 sm:p-4 text-white rounded-full transition-all z-[110] bg-black/60 shadow-lg backdrop-blur-sm hover:bg-white/20 disabled:opacity-0 disabled:pointer-events-none"
			aria-label="Mídia anterior"
		>
			<svg class="w-7 h-7 sm:w-9 sm:h-9" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
			</svg>
		</button>

		<!-- Próximo -->
		<button
			type="button"
			onclick={next}
			disabled={album.length <= 1}
			class="absolute right-2 sm:right-6 top-1/2 -translate-y-1/2 p-3 sm:p-4 text-white rounded-full transition-all z-[110] bg-black/60 shadow-lg backdrop-blur-sm hover:bg-white/20 disabled:opacity-0 disabled:pointer-events-none"
			aria-label="Próxima mídia"
		>
			<svg class="w-7 h-7 sm:w-9 sm:h-9" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
			</svg>
		</button>

		<!-- Conteúdo -->
		<div
			class="w-full h-full flex items-center justify-center p-4 sm:p-16"
			ontouchstart={handleTouchStart}
			ontouchend={handleTouchEnd}
		>
			<div class="relative w-full max-w-[95vw] sm:max-w-5xl max-h-[85vh] flex flex-col items-center justify-center">
				<div class="w-full max-h-[75vh] flex items-center justify-center rounded-2xl overflow-hidden shadow-2xl bg-zinc-900/50 border border-white/10 relative">
					{#if album[currentIndex].type === 'image'}
						{#if !imgLoaded}
							<!-- Skeleton enquanto carrega -->
							<div class="w-full h-64 sm:h-96 bg-zinc-800 animate-pulse rounded-2xl"></div>
						{/if}
						<img
							src={album[currentIndex].url}
							alt="Mídia do projeto {currentIndex + 1} de {album.length}"
							class="max-h-[75vh] w-auto object-contain transition-opacity duration-300 {imgLoaded ? 'opacity-100' : 'opacity-0 absolute'}"
							onload={() => imgLoaded = true}
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

				<!-- Contador + dots -->
				<div class="mt-5 flex items-center gap-3">
					<span class="px-3 py-1 rounded-full bg-white/10 border border-white/10 text-white/70 text-xs font-medium backdrop-blur-md">
						{currentIndex + 1} / {album.length}
					</span>
					{#if album.length > 1 && album.length <= 10}
						<div class="flex gap-1.5">
							{#each album as _, i}
								<button
									onclick={() => { imgLoaded = false; currentIndex = i; }}
									aria-label="Ir para mídia {i + 1}"
									class="w-1.5 h-1.5 rounded-full transition-all duration-200 {i === currentIndex ? 'bg-white scale-125' : 'bg-white/30 hover:bg-white/60'}"
								></button>
							{/each}
						</div>
					{/if}
				</div>
			</div>
		</div>
	</div>
</div>
