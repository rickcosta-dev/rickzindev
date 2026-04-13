<script lang="ts">
	import { fly } from 'svelte/transition';

	let { data: pageData } = $props();
	let project = $derived(pageData.project);
	let prevProject = $derived(pageData.prevProject);
	let nextProject = $derived(pageData.nextProject);
</script>

<svelte:head>
	<title>{project.title} | RickZin</title>
	<meta name="description" content={project.description || project.title} />
</svelte:head>

<div class="min-h-screen">
	<!-- Hero Image -->
	<div class="relative h-[50vh] min-h-[400px]">
		{#if project.image_url}
			<img 
				src={project.image_url} 
				alt={project.title}
				class="w-full h-full object-cover"
			/>
		{:else}
			<div class="w-full h-full bg-background-secondary flex items-center justify-center">
				<svg class="w-24 h-24 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
				</svg>
			</div>
		{/if}
		<div class="absolute inset-0 bg-gradient-to-t from-background-primary via-background-primary/50 to-transparent"></div>
		
		<!-- Navigation -->
		<div class="absolute top-24 left-0 right-0">
			<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<a href="/projetos" class="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors">
					<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
					</svg>
					Voltar aos projetos
				</a>
			</div>
		</div>
	</div>

	<!-- Content -->
	<div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-32 relative z-10">
		<div class="card mb-8" in:fly={{ y: 20, duration: 400 }}>
			<!-- Title -->
			<h1 class="text-3xl sm:text-4xl font-bold mb-4">{project.title}</h1>
			
			<!-- Links -->
			<div class="flex flex-wrap gap-4 mb-6">
				{#if project.github_url}
					<a 
						href={project.github_url}
						target="_blank"
						rel="noopener"
						class="inline-flex items-center gap-2 px-4 py-2 bg-background-tertiary rounded-lg hover:bg-accent-primary/20 transition-colors"
					>
						<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
							<path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
						</svg>
						GitHub
					</a>
				{/if}
				{#if project.live_url}
					<a 
						href={project.live_url}
						target="_blank"
						rel="noopener"
						class="btn-primary inline-flex items-center gap-2"
					>
						<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/>
						</svg>
						Ver Demo
					</a>
				{/if}
			</div>

			<!-- Tech Stack -->
			{#if project.tech && project.tech.length > 0}
				<div class="flex flex-wrap gap-2 mb-6">
					{#each project.tech as tech}
						<span class="px-3 py-1 text-sm rounded-lg bg-accent-primary/10 text-accent-primary">
							{tech}
						</span>
					{/each}
				</div>
			{/if}

			<!-- Description -->
			<div class="prose prose-invert max-w-none">
				<p class="text-slate-300 text-lg leading-relaxed whitespace-pre-wrap">{project.description}</p>
			</div>
		</div>

		<!-- Navigation Between Projects -->
		<div class="flex justify-between gap-4">
			{#if prevProject}
				<a href="/projetos/{prevProject.id}" class="flex-1 card flex items-center gap-3 hover:border-accent-primary/50">
					<svg class="w-5 h-5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
					</svg>
					<div class="text-left">
						<p class="text-xs text-slate-500">Anterior</p>
						<p class="font-medium text-sm truncate">{prevProject.title}</p>
					</div>
				</a>
			{:else}
				<div class="flex-1"></div>
			{/if}
			
			{#if nextProject}
				<a href="/projetos/{nextProject.id}" class="flex-1 card flex items-center gap-3 justify-end text-right hover:border-accent-primary/50">
					<div>
						<p class="text-xs text-slate-500">Próximo</p>
						<p class="font-medium text-sm truncate">{nextProject.title}</p>
					</div>
					<svg class="w-5 h-5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
					</svg>
				</a>
			{/if}
		</div>
	</div>
</div>