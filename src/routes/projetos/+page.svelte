<script lang="ts">
	import { onMount } from 'svelte';
	import { fly } from 'svelte/transition';
	import { db, type Project } from '$lib/firebaseConfig';
	import { collection, query, orderBy, getDocs } from 'firebase/firestore';

	let projects = $state<Project[]>([]);
	let filteredProjects = $state<Project[]>([]);
	let loading = $state(true);
	let searchQuery = $state('');
	let selectedTechs = $state<string[]>([]);
	let allTechs = $state<string[]>([]);

	onMount(async () => {
		try {
			const q = query(collection(db, 'projects'), orderBy('created_at', 'desc'));
			const querySnapshot = await getDocs(q);
			const data = querySnapshot.docs.map(d => ({ id: d.id, ...d.data() })) as Project[];
			
			projects = data;
			filteredProjects = data;
			allTechs = [...new Set(data.flatMap(p => p.tech || []))];
		} catch (error) {
			console.error('Error loading projects:', error);
		} finally {
			loading = false;
		}
	});

	function filterProjects() {
		filteredProjects = projects.filter(project => {
			const matchesSearch = !searchQuery || 
				project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
				project.description?.toLowerCase().includes(searchQuery.toLowerCase());
			
			const matchesTech = selectedTechs.length === 0 || 
				selectedTechs.some(tech => project.tech?.includes(tech));
			
			return matchesSearch && matchesTech;
		});
	}

	function toggleTech(tech: string) {
		if (selectedTechs.includes(tech)) {
			selectedTechs = selectedTechs.filter(t => t !== tech);
		} else {
			selectedTechs = [...selectedTechs, tech];
		}
		filterProjects();
	}

	function clearFilters() {
		searchQuery = '';
		selectedTechs = [];
		filteredProjects = projects;
	}

	$effect(() => {
		if (searchQuery) {
			filterProjects();
		}
	});
</script>

<svelte:head>
	<title>Projetos | RickZin</title>
	<meta name="description" content="Projetos desenvolvidos por RickZin - Fullstack Developer" />
</svelte:head>

<div class="min-h-screen py-24">
	<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
		<!-- Header -->
		<div class="mb-12">
			<h1 class="text-4xl sm:text-5xl font-bold mb-4">
				Meus <span class="gradient-text">Projetos</span>
			</h1>
			<p class="text-slate-400 text-lg max-w-xl">
				Uma seleção dos projetos que desenvolvi ao longo da minha carreira como desenvolvedor.
			</p>
		</div>

		<!-- Filters -->
		<div class="flex flex-col lg:flex-row gap-4 mb-8">
			<!-- Search -->
			<div class="relative flex-1">
				<svg class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
				</svg>
				<input
					type="text"
					placeholder="Buscar projetos..."
					bind:value={searchQuery}
					oninput={filterProjects}
					class="input pl-12"
				/>
			</div>

			<!-- Tech Filters -->
			<div class="flex flex-wrap gap-2">
				{#each allTechs as tech}
					<button
						onclick={() => toggleTech(tech)}
						class="px-3 py-2 text-sm rounded-lg transition-all duration-200 {selectedTechs.includes(tech) ? 'bg-accent-primary text-white' : 'bg-background-tertiary text-slate-400 hover:text-white'}"
					>
						{tech}
					</button>
				{/each}
				{#if selectedTechs.length > 0 || searchQuery}
					<button
						onclick={clearFilters}
						class="px-3 py-2 text-sm rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-all"
					>
						Limpar
					</button>
				{/if}
			</div>
		</div>

		<!-- Projects Grid -->
		{#if loading}
			<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
				{#each [1, 2, 3, 4, 5, 6] as _}
					<div class="card">
						<div class="w-full h-48 bg-background-tertiary rounded-lg animate-pulse mb-4"></div>
						<div class="h-6 bg-background-tertiary rounded animate-pulse mb-2"></div>
						<div class="h-4 bg-background-tertiary rounded animate-pulse w-2/3 mb-4"></div>
						<div class="flex gap-2">
							<div class="h-6 w-16 bg-background-tertiary rounded animate-pulse"></div>
							<div class="h-6 w-16 bg-background-tertiary rounded animate-pulse"></div>
						</div>
					</div>
				{/each}
			</div>
		{:else if filteredProjects.length > 0}
			<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
				{#each filteredProjects as project, i}
					<div 
						class="card group"
						in:fly={{ y: 20, duration: 400, delay: i * 50 }}
					>
						<a href="/projetos/{project.id}" class="block">
							<div class="relative overflow-hidden rounded-lg mb-4">
								{#if project.image_url}
									<img 
										src={project.image_url} 
										alt={project.title}
										class="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
									/>
								{:else}
									<div class="w-full h-48 bg-background-tertiary flex items-center justify-center">
										<svg class="w-12 h-12 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
										</svg>
									</div>
								{/if}
							</div>
							<h3 class="text-xl font-semibold mb-2 group-hover:text-accent-primary transition-colors">{project.title}</h3>
							<p class="text-slate-400 text-sm line-clamp-2 mb-4">{project.description}</p>
						</a>
						{#if project.tech && project.tech.length > 0}
							<div class="flex flex-wrap gap-2">
								{#each project.tech as t}
									<span class="px-2 py-1 text-xs rounded-md bg-accent-primary/10 text-accent-primary">
										{t}
									</span>
								{/each}
							</div>
						{/if}
						{#if project.github_url || project.live_url}
							<div class="flex gap-2 mt-4">
								{#if project.github_url}
									<a 
										href={project.github_url} 
										target="_blank" 
										rel="noopener"
										aria-label="Ver no GitHub"
										class="p-2 bg-background-tertiary rounded-lg hover:bg-accent-primary/20 transition-colors"
									>
										<svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
											<path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
										</svg>
									</a>
								{/if}
								{#if project.live_url}
									<a 
										href={project.live_url} 
										target="_blank" 
										rel="noopener"
										aria-label="Ver demo"
										class="p-2 bg-background-tertiary rounded-lg hover:bg-accent-primary/20 transition-colors"
									>
										<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/>
										</svg>
									</a>
								{/if}
							</div>
						{/if}
					</div>
				{/each}
			</div>
		{:else}
			<div class="text-center py-20">
				<svg class="w-16 h-16 mx-auto text-slate-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
				</svg>
				<h3 class="text-xl font-semibold mb-2">Nenhum projeto encontrado</h3>
				<p class="text-slate-400">Tente ajustar os filtros de busca</p>
			</div>
		{/if}
	</div>
</div>

<style>
	.line-clamp-2 {
		display: -webkit-box;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
		overflow: hidden;
	}
</style>