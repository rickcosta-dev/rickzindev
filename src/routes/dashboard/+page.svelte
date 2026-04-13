<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { fade, fly } from 'svelte/transition';
	import { supabase, type Project, type Contact } from '$lib/supabaseClient';

	let projects = $state<Project[]>([]);
	let contacts = $state<Contact[]>([]);
	let loading = $state(true);
	let activeTab = $state<'projects' | 'messages'>('projects');
	let showModal = $state(false);
	let editingProject = $state<Project | null>(null);

	let projectForm = $state({
		title: '',
		description: '',
		tech: '',
		image_url: '',
		github_url: '',
		live_url: ''
	});

	onMount(async () => {
		const { data: { user } } = await supabase.auth.getUser();
		
		if (!user) {
			goto('/login');
			return;
		}

		await loadData();
	});

	async function loadData() {
		loading = true;
		
		const [projectsRes, contactsRes] = await Promise.all([
			supabase.from('projects').select('*').order('created_at', { ascending: false }),
			supabase.from('contacts').select('*').order('created_at', { ascending: false })
		]);

		if (projectsRes.data) projects = projectsRes.data;
		if (contactsRes.data) contacts = contactsRes.data;
		
		loading = false;
	}

	async function signOut() {
		await supabase.auth.signOut();
		goto('/');
	}

	function openModal(project?: Project) {
		if (project) {
			editingProject = project;
			projectForm = {
				title: project.title,
				description: project.description || '',
				tech: project.tech?.join(', ') || '',
				image_url: project.image_url || '',
				github_url: project.github_url || '',
				live_url: project.live_url || ''
			};
		} else {
			editingProject = null;
			projectForm = {
				title: '',
				description: '',
				tech: '',
				image_url: '',
				github_url: '',
				live_url: ''
			};
		}
		showModal = true;
	}

	function closeModal() {
		showModal = false;
		editingProject = null;
	}

	async function saveProject() {
		const techArray = projectForm.tech
			.split(',')
			.map(t => t.trim())
			.filter(t => t);

		const projectData = {
			title: projectForm.title,
			description: projectForm.description || null,
			tech: techArray,
			image_url: projectForm.image_url || null,
			github_url: projectForm.github_url || null,
			live_url: projectForm.live_url || null
		};

		if (editingProject) {
			await supabase
				.from('projects')
				.update(projectData)
				.eq('id', editingProject.id);
		} else {
			await supabase
				.from('projects')
				.insert([projectData]);
		}

		closeModal();
		await loadData();
	}

	async function deleteProject(id: string) {
		if (!confirm('Tem certeza que deseja excluir este projeto?')) return;
		
		await supabase
			.from('projects')
			.delete()
			.eq('id', id);
		
		await loadData();
	}

	async function deleteContact(id: string) {
		if (!confirm('Tem certeza que deseja excluir esta mensagem?')) return;
		
		await supabase
			.from('contacts')
			.delete()
			.eq('id', id);
		
		await loadData();
	}
</script>

<svelte:head>
	<title>Dashboard | Rick Gonzalez</title>
</svelte:head>

<div class="min-h-screen py-24">
	<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
		<!-- Header -->
		<div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
			<div>
				<h1 class="text-3xl font-bold">
					<span class="gradient-text">Dashboard</span>
				</h1>
				<p class="text-slate-400">Gerencie seu portfólio</p>
			</div>
			<button 
				onclick={signOut}
				class="px-4 py-2 bg-red-500/10 text-red-400 rounded-lg hover:bg-red-500/20 transition-colors"
			>
				Sair
			</button>
		</div>

		<!-- Tabs -->
		<div class="flex gap-2 mb-6">
			<button
				onclick={() => activeTab = 'projects'}
				class="px-4 py-2 rounded-lg transition-colors {activeTab === 'projects' ? 'bg-accent-primary text-white' : 'bg-background-tertiary text-slate-400 hover:text-white'}"
			>
				Projetos ({projects.length})
			</button>
			<button
				onclick={() => activeTab = 'messages'}
				class="px-4 py-2 rounded-lg transition-colors {activeTab === 'messages' ? 'bg-accent-primary text-white' : 'bg-background-tertiary text-slate-400 hover:text-white'}"
			>
				Mensagens ({contacts.length})
			</button>
		</div>

		<!-- Projects Tab -->
		{#if activeTab === 'projects'}
			<div class="card">
				<div class="flex justify-between items-center mb-6">
					<h2 class="text-xl font-semibold">Gerenciar Projetos</h2>
					<button onclick={() => openModal()} class="btn-primary py-2 px-4">
						+ Novo Projeto
					</button>
				</div>

				{#if loading}
					<div class="space-y-4">
						{#each [1, 2, 3] as _}
							<div class="h-16 bg-background-tertiary rounded animate-pulse"></div>
						{/each}
					</div>
				{:else if projects.length > 0}
					<div class="overflow-x-auto">
						<table class="w-full">
							<thead>
								<tr class="border-b border-border-color">
									<th class="text-left py-3 px-4 text-sm font-medium text-slate-400">Título</th>
									<th class="text-left py-3 px-4 text-sm font-medium text-slate-400">Tecnologias</th>
									<th class="text-left py-3 px-4 text-sm font-medium text-slate-400">Data</th>
									<th class="text-right py-3 px-4 text-sm font-medium text-slate-400">Ações</th>
								</tr>
							</thead>
							<tbody>
								{#each projects as project}
									<tr class="border-b border-border-color">
										<td class="py-3 px-4">
											<a href="/projetos/{project.id}" target="_blank" class="hover:text-accent-primary transition-colors">
												{project.title}
											</a>
										</td>
										<td class="py-3 px-4">
											<div class="flex flex-wrap gap-1">
												{#each (project.tech || []).slice(0, 2) as t}
													<span class="px-2 py-0.5 text-xs bg-accent-primary/10 text-accent-primary rounded">
														{t}
													</span>
												{/each}
												{#if (project.tech || []).length > 2}
													<span class="px-2 py-0.5 text-xs text-slate-500">
														+{project.tech.length - 2}
													</span>
												{/if}
											</div>
										</td>
										<td class="py-3 px-4 text-slate-400 text-sm">
											{new Date(project.created_at).toLocaleDateString('pt-BR')}
										</td>
										<td class="py-3 px-4 text-right">
											<div class="flex justify-end gap-2">
												<button 
													onclick={() => openModal(project)}
													class="p-2 text-slate-400 hover:text-accent-primary transition-colors"
												>
													<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
														<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
													</svg>
												</button>
												<button 
													onclick={() => deleteProject(project.id)}
													class="p-2 text-slate-400 hover:text-red-400 transition-colors"
												>
													<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
														<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
													</svg>
												</button>
											</div>
										</td>
									</tr>
								{/each}
							</tbody>
						</table>
					</div>
				{:else}
					<div class="text-center py-8 text-slate-400">
						Nenhum projeto encontrado.
					</div>
				{/if}
			</div>
		{/if}

		<!-- Messages Tab -->
		{#if activeTab === 'messages'}
			<div class="card">
				<h2 class="text-xl font-semibold mb-6">Mensagens Recebidas</h2>

				{#if loading}
					<div class="space-y-4">
						{#each [1, 2, 3] as _}
							<div class="h-20 bg-background-tertiary rounded animate-pulse"></div>
						{/each}
					</div>
				{:else if contacts.length > 0}
					<div class="space-y-4">
						{#each contacts as contact}
							<div class="p-4 bg-background-tertiary rounded-lg">
								<div class="flex justify-between items-start mb-2">
									<div>
										<h3 class="font-semibold">{contact.name}</h3>
										<p class="text-sm text-slate-400">{contact.email}</p>
									</div>
									<div class="flex items-center gap-3">
										<span class="text-xs text-slate-500">
											{new Date(contact.created_at).toLocaleDateString('pt-BR')}
										</span>
										<button 
											onclick={() => deleteContact(contact.id)}
											class="p-2 text-slate-400 hover:text-red-400 transition-colors"
										>
											<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
												<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
											</svg>
										</button>
									</div>
								</div>
								<p class="text-slate-300 text-sm">{contact.message}</p>
							</div>
						{/each}
					</div>
				{:else}
					<div class="text-center py-8 text-slate-400">
						Nenhuma mensagem recebida.
					</div>
				{/if}
			</div>
		{/if}
	</div>
</div>

<!-- Modal -->
{#if showModal}
	<div 
		class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
		transition:fade={{ duration: 200 }}
	>
		<div 
			class="card w-full max-w-2xl max-h-[90vh] overflow-y-auto"
			transition:fly={{ y: 20, duration: 200 }}
		>
			<div class="flex justify-between items-center mb-6">
				<h2 class="text-xl font-semibold">
					{editingProject ? 'Editar Projeto' : 'Novo Projeto'}
				</h2>
				<button onclick={closeModal} class="text-slate-400 hover:text-white">
					<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
					</svg>
				</button>
			</div>

			<form onsubmit={(e) => { e.preventDefault(); saveProject(); }} class="space-y-4">
				<div>
					<label for="title" class="block text-sm font-medium mb-2">Título *</label>
					<input
						type="text"
						id="title"
						bind:value={projectForm.title}
						required
						class="input"
						placeholder="Nome do projeto"
					/>
				</div>

				<div>
					<label for="description" class="block text-sm font-medium mb-2">Descrição</label>
					<textarea
						id="description"
						bind:value={projectForm.description}
						rows="4"
						class="input resize-none"
						placeholder="Descrição do projeto..."
					></textarea>
				</div>

				<div>
					<label for="tech" class="block text-sm font-medium mb-2">Tecnologias</label>
					<input
						type="text"
						id="tech"
						bind:value={projectForm.tech}
						class="input"
						placeholder="Svelte, TypeScript, Supabase (separadas por vírgula)"
					/>
				</div>

				<div>
					<label for="image_url" class="block text-sm font-medium mb-2">URL da Imagem</label>
					<input
						type="url"
						id="image_url"
						bind:value={projectForm.image_url}
						class="input"
						placeholder="https://..."
					/>
				</div>

				<div>
					<label for="github_url" class="block text-sm font-medium mb-2">GitHub URL</label>
					<input
						type="url"
						id="github_url"
						bind:value={projectForm.github_url}
						class="input"
						placeholder="https://github.com/..."
					/>
				</div>

				<div>
					<label for="live_url" class="block text-sm font-medium mb-2">Live URL</label>
					<input
						type="url"
						id="live_url"
						bind:value={projectForm.live_url}
						class="input"
						placeholder="https://..."
					/>
				</div>

				<div class="flex gap-3 pt-4">
					<button type="button" onclick={closeModal} class="flex-1 btn-outline">
						Cancelar
					</button>
					<button type="submit" class="flex-1 btn-primary">
						Salvar
					</button>
				</div>
			</form>
		</div>
	</div>
{/if}