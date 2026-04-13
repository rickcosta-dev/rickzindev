<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { fade, fly } from 'svelte/transition';
	import { db, auth, type Project, type Contact, type Testimonial } from '$lib/firebaseConfig';
	import { 
		collection, 
		query, 
		orderBy, 
		limit,
		getDocs, 
		addDoc, 
		updateDoc, 
		deleteDoc, 
		doc, 
		serverTimestamp 
	} from 'firebase/firestore';
	import { onAuthStateChanged, signOut as firebaseSignOut } from 'firebase/auth';

	let projects = $state<Project[]>([]);
	let contacts = $state<Contact[]>([]);
	let testimonials = $state<Testimonial[]>([]);
	let loading = $state(true);
	let activeTab = $state<'projects' | 'messages' | 'testimonials'>('projects');
	let showModal = $state(false);
	let editingProject = $state<Project | null>(null);

	let showTestimonialModal = $state(false);
	let editingTestimonial = $state<Testimonial | null>(null);
	let testimonialForm = $state({
		name: '',
		role: '',
		company: '',
		quote: '',
		avatar_url: '',
		linkedin_url: '',
		approved: false
	});

	let projectForm = $state({
		title: '',
		description: '',
		tech: '',
		image_url: '',
		album: [] as { url: string; type: 'image' | 'video' }[],
		featured: false,
		featured_order: '',
		github_url: '',
		live_url: '',
		created_at: new Date().toISOString().split('T')[0]
	});

	let newAlbumItem = $state({ url: '', type: 'image' as 'image' | 'video' });

	function addAlbumItem() {
		if (newAlbumItem.url) {
			projectForm.album = [...projectForm.album, { ...newAlbumItem }];
			newAlbumItem = { url: '', type: 'image' };
		}
	}

	function removeAlbumItem(index: number) {
		projectForm.album = projectForm.album.filter((_, i) => i !== index);
	}

	onMount(() => {
		const unsubscribe = onAuthStateChanged(auth, (user) => {
			if (!user) {
				goto('/login');
			} else {
				loadData();
			}
		});

		return () => unsubscribe();
	});

	async function loadData() {
		loading = true;
		try {
			const projectsQuery = query(collection(db, 'projects'), orderBy('created_at', 'desc'));
			const contactsQuery = query(collection(db, 'contacts'), orderBy('created_at', 'desc'));
			const testimonialsQuery = query(collection(db, 'testimonials'), orderBy('created_at', 'desc'), limit(50));

			const [projectsSnap, contactsSnap, testimonialsSnap] = await Promise.all([
				getDocs(projectsQuery),
				getDocs(contactsQuery),
				getDocs(testimonialsQuery)
			]);

			projects = projectsSnap.docs.map(d => {
				const data = d.data();
				const created_at = data.created_at?.toDate ? data.created_at.toDate() : new Date(data.created_at);
				return { id: d.id, ...data, created_at };
			}) as Project[];
			contacts = contactsSnap.docs.map(d => ({ id: d.id, ...d.data() })) as Contact[];
			testimonials = testimonialsSnap.docs.map(d => ({ id: d.id, ...d.data() })) as Testimonial[];
		} catch (error) {
			console.error('Error loading dashboard data:', error);
		} finally {
			loading = false;
		}
	}

	async function signOut() {
		await firebaseSignOut(auth);
		goto('/');
	}

	function openModal(project?: Project) {
		if (project) {
			editingProject = project;
			const date = project.created_at instanceof Date 
				? project.created_at 
				: (project.created_at?.toDate ? project.created_at.toDate() : new Date(project.created_at));
			
			projectForm = {
				title: project.title,
				description: project.description || '',
				tech: project.tech?.join(', ') || '',
				image_url: project.image_url || '',
				album: project.album || [],
				featured: Boolean(project.featured),
				featured_order: project.featured_order ?? '',
				github_url: project.github_url || '',
				live_url: project.live_url || '',
				created_at: date.toISOString().split('T')[0]
			};
		} else {
			editingProject = null;
			projectForm = {
				title: '',
				description: '',
				tech: '',
				image_url: '',
				album: [],
				featured: false,
				featured_order: '',
				github_url: '',
				live_url: '',
				created_at: new Date().toISOString().split('T')[0]
			};
		}
		showModal = true;
	}

	function closeModal() {
		showModal = false;
		editingProject = null;
	}

	function openTestimonialModal(testimonial?: Testimonial) {
		if (testimonial) {
			editingTestimonial = testimonial;
			testimonialForm = {
				name: testimonial.name || '',
				role: testimonial.role || '',
				company: testimonial.company || '',
				quote: testimonial.quote || '',
				avatar_url: testimonial.avatar_url || '',
				linkedin_url: testimonial.linkedin_url || '',
				approved: Boolean(testimonial.approved)
			};
		} else {
			editingTestimonial = null;
			testimonialForm = {
				name: '',
				role: '',
				company: '',
				quote: '',
				avatar_url: '',
				linkedin_url: '',
				approved: false
			};
		}
		showTestimonialModal = true;
	}

	function closeTestimonialModal() {
		showTestimonialModal = false;
		editingTestimonial = null;
	}

	async function saveTestimonial() {
		const testimonialData = {
			name: testimonialForm.name.trim(),
			role: testimonialForm.role.trim() || null,
			company: testimonialForm.company.trim() || null,
			quote: testimonialForm.quote.trim(),
			avatar_url: testimonialForm.avatar_url.trim() || null,
			linkedin_url: testimonialForm.linkedin_url.trim() || null,
			approved: testimonialForm.approved ? true : null,
			updated_at: serverTimestamp(),
			...(editingTestimonial ? {} : { created_at: serverTimestamp() })
		};

		try {
			if (editingTestimonial) {
				const ref = doc(db, 'testimonials', editingTestimonial.id);
				await updateDoc(ref, testimonialData);
			} else {
				await addDoc(collection(db, 'testimonials'), testimonialData);
			}
			closeTestimonialModal();
			await loadData();
		} catch (error) {
			console.error('Error saving testimonial:', error);
		}
	}

	async function deleteTestimonial(id: string) {
		if (!confirm('Tem certeza que deseja excluir este depoimento?')) return;
		try {
			await deleteDoc(doc(db, 'testimonials', id));
			await loadData();
		} catch (error) {
			console.error('Error deleting testimonial:', error);
		}
	}

	async function toggleTestimonialApproved(testimonial: Testimonial) {
		try {
			await updateDoc(doc(db, 'testimonials', testimonial.id), {
				approved: testimonial.approved ? null : true,
				updated_at: serverTimestamp()
			});
			await loadData();
		} catch (error) {
			console.error('Error updating testimonial:', error);
		}
	}

	async function saveProject() {
		const techArray = projectForm.tech
			.split(',')
			.map(t => t.trim())
			.filter(t => t);

		const featuredOrder =
			projectForm.featured && projectForm.featured_order !== '' ? Number(projectForm.featured_order) : null;

		// Converte a string do input date para objeto Date
		const selectedDate = new Date(projectForm.created_at);
		// Ajusta para o fuso horário local se necessário, ou usa como UTC
		
		const projectData = {
			title: projectForm.title,
			description: projectForm.description || null,
			tech: techArray,
			image_url: projectForm.image_url || null,
			album: projectForm.album.length > 0 ? projectForm.album : null,
			featured: projectForm.featured ? true : null,
			featured_order: featuredOrder,
			github_url: projectForm.github_url || null,
			live_url: projectForm.live_url || null,
			created_at: selectedDate, // Salva como objeto Date (Firestore converte para Timestamp)
			updated_at: serverTimestamp()
		};

		try {
			if (editingProject) {
				const projectRef = doc(db, 'projects', editingProject.id);
				await updateDoc(projectRef, projectData);
			} else {
				await addDoc(collection(db, 'projects'), projectData);
			}
			closeModal();
			await loadData();
		} catch (error) {
			console.error('Error saving project:', error);
		}
	}

	async function deleteProject(id: string) {
		if (!confirm('Tem certeza que deseja excluir este projeto?')) return;
		try {
			await deleteDoc(doc(db, 'projects', id));
			await loadData();
		} catch (error) {
			console.error('Error deleting project:', error);
		}
	}

	async function deleteContact(id: string) {
		if (!confirm('Tem certeza que deseja excluir esta mensagem?')) return;
		try {
			await deleteDoc(doc(db, 'contacts', id));
			await loadData();
		} catch (error) {
			console.error('Error deleting contact:', error);
		}
	}
</script>

<svelte:head>
	<title>Dashboard | RickZin</title>
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
			<button
				onclick={() => activeTab = 'testimonials'}
				class="px-4 py-2 rounded-lg transition-colors {activeTab === 'testimonials' ? 'bg-accent-primary text-white' : 'bg-background-tertiary text-slate-400 hover:text-white'}"
			>
				Depoimentos ({testimonials.length})
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
									<th class="text-left py-3 px-4 text-sm font-medium text-slate-400">Destaque</th>
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
												{#if project.tech}
													{#each project.tech.slice(0, 2) as t}
														<span class="px-2 py-0.5 rounded bg-accent-primary/10 text-accent-primary text-[10px] font-medium">
															{t}
														</span>
													{/each}
													{#if project.tech.length > 2}
														<span class="text-[10px] text-slate-500">+{project.tech.length - 2}</span>
													{/if}
												{/if}
											</div>
										</td>
										<td class="py-3 px-4 text-slate-400 text-sm">
											{#if project.featured}
												<span class="inline-flex items-center gap-2 px-2 py-1 rounded-md bg-accent-primary/10 text-accent-primary text-xs font-medium">
													★ {project.featured_order ?? '-'}
												</span>
											{:else}
												<span class="text-slate-500">-</span>
											{/if}
										</td>
										<td class="py-3 px-4 text-slate-400 text-sm">
											{new Date(project.created_at).toLocaleDateString('pt-BR')}
										</td>
										<td class="py-3 px-4 text-right">
											<div class="flex justify-end gap-2">
												<button 
													onclick={() => openModal(project)}
													class="p-2 text-slate-400 hover:text-accent-primary transition-colors"
													title="Editar projeto"
												>
													<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
														<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
													</svg>
												</button>
												<button 
													onclick={() => deleteProject(project.id)}
													class="p-2 text-slate-400 hover:text-red-400 transition-colors"
													title="Excluir projeto"
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
											title="Excluir mensagem"
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

		{#if activeTab === 'testimonials'}
			<div class="card">
				<div class="flex justify-between items-center mb-6">
					<h2 class="text-xl font-semibold">Gerenciar Depoimentos</h2>
					<button onclick={() => openTestimonialModal()} class="btn-primary py-2 px-4">
						+ Novo Depoimento
					</button>
				</div>

				{#if loading}
					<div class="space-y-4">
						{#each [1, 2, 3] as _}
							<div class="h-20 bg-background-tertiary rounded animate-pulse"></div>
						{/each}
					</div>
				{:else if testimonials.length > 0}
					<div class="space-y-4">
						{#each testimonials as testimonial}
							<div class="p-4 bg-background-tertiary rounded-lg border border-zinc-800">
								<div class="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
									<div class="min-w-0">
										<div class="flex items-center gap-2">
											<h3 class="font-semibold truncate">{testimonial.name}</h3>
											{#if testimonial.approved}
												<span class="px-2 py-0.5 rounded bg-green-500/10 text-green-400 text-[10px] font-semibold">APROVADO</span>
											{:else}
												<span class="px-2 py-0.5 rounded bg-slate-500/10 text-slate-300 text-[10px] font-semibold">PENDENTE</span>
											{/if}
										</div>
										<p class="text-xs text-slate-500 mt-1">
											{testimonial.role || '-'}{testimonial.company ? ` • ${testimonial.company}` : ''}
										</p>
										<p class="text-slate-300 text-sm mt-3">
											“{testimonial.quote}”
										</p>
									</div>

									<div class="flex flex-wrap gap-2">
										<button
											type="button"
											onclick={() => toggleTestimonialApproved(testimonial)}
											class="px-3 py-2 rounded-lg text-xs font-semibold bg-background-secondary border border-zinc-800 text-slate-300 hover:text-white transition-colors"
										>
											{testimonial.approved ? 'Desaprovar' : 'Aprovar'}
										</button>
										<button
											type="button"
											onclick={() => openTestimonialModal(testimonial)}
											class="px-3 py-2 rounded-lg text-xs font-semibold bg-background-secondary border border-zinc-800 text-slate-300 hover:text-white transition-colors"
										>
											Editar
										</button>
										<button
											type="button"
											onclick={() => deleteTestimonial(testimonial.id)}
											class="px-3 py-2 rounded-lg text-xs font-semibold bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20 transition-colors"
										>
											Excluir
										</button>
									</div>
								</div>
							</div>
						{/each}
					</div>
				{:else}
					<div class="text-center py-8 text-slate-400">
						Nenhum depoimento cadastrado.
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
				<button onclick={closeModal} class="text-slate-400 hover:text-white" title="Fechar modal">
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
					<label for="image_url" class="block text-sm font-medium mb-2">URL da Imagem Principal *</label>
					<input
						type="url"
						id="image_url"
						bind:value={projectForm.image_url}
						required
						class="input"
						placeholder="https://..."
					/>
				</div>

				<div>
					<label for="album_url" class="block text-sm font-medium mb-2">Álbum (Imagens e Vídeos)</label>
					<div class="space-y-3 mb-4">
						{#each projectForm.album as item, i}
							<div class="flex gap-2 items-center bg-background-tertiary p-2 rounded-lg border border-zinc-800">
								<div class="flex-1 truncate text-xs text-slate-400">{item.url}</div>
								<span class="text-[10px] px-2 py-0.5 rounded bg-accent-primary/10 text-accent-primary uppercase">
									{item.type}
								</span>
								<button 
									type="button" 
									onclick={() => removeAlbumItem(i)}
									class="p-1 text-red-400 hover:bg-red-500/10 rounded transition-colors"
									title="Remover item do álbum"
								>
									<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
									</svg>
								</button>
							</div>
						{/each}
					</div>
					
					<div class="flex gap-2">
						<input
							type="url"
							id="album_url"
							bind:value={newAlbumItem.url}
							class="input flex-1"
							placeholder="URL da mídia..."
						/>
						<select 
							bind:value={newAlbumItem.type}
							class="input w-32"
							aria-label="Tipo de mídia"
						>
							<option value="image">Imagem</option>
							<option value="video">Vídeo</option>
						</select>
						<button 
							type="button" 
							onclick={addAlbumItem}
							class="btn-outline px-4"
							title="Adicionar ao álbum"
						>
							+
						</button>
					</div>
				</div>

				<div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
					<div class="flex items-center gap-3 bg-background-tertiary border border-zinc-800 rounded-xl px-4 py-3">
						<input id="featured" type="checkbox" bind:checked={projectForm.featured} class="h-4 w-4" />
						<label for="featured" class="text-sm font-medium">Projeto em destaque</label>
					</div>
					<div>
						<label for="featured_order" class="block text-sm font-medium mb-2">Ordem do destaque</label>
						<input
							type="number"
							id="featured_order"
							bind:value={projectForm.featured_order}
							class="input"
							placeholder="1, 2, 3..."
							disabled={!projectForm.featured}
						/>
					</div>
				</div>

				<div>
					<label for="created_at" class="block text-sm font-medium mb-2">Data de Criação *</label>
					<input
						type="date"
						id="created_at"
						bind:value={projectForm.created_at}
						required
						class="input"
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

{#if showTestimonialModal}
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
					{editingTestimonial ? 'Editar Depoimento' : 'Novo Depoimento'}
				</h2>
				<button onclick={closeTestimonialModal} class="text-slate-400 hover:text-white" title="Fechar modal">
					<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
					</svg>
				</button>
			</div>

			<form onsubmit={(e) => { e.preventDefault(); saveTestimonial(); }} class="space-y-4">
				<div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
					<div>
						<label for="t_name" class="block text-sm font-medium mb-2">Nome *</label>
						<input id="t_name" type="text" bind:value={testimonialForm.name} required class="input" />
					</div>
					<div class="flex items-center gap-3 bg-background-tertiary border border-zinc-800 rounded-xl px-4 py-3">
						<input id="t_approved" type="checkbox" bind:checked={testimonialForm.approved} class="h-4 w-4" />
						<label for="t_approved" class="text-sm font-medium">Aprovado</label>
					</div>
				</div>

				<div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
					<div>
						<label for="t_role" class="block text-sm font-medium mb-2">Cargo</label>
						<input id="t_role" type="text" bind:value={testimonialForm.role} class="input" placeholder="Ex: Product Manager" />
					</div>
					<div>
						<label for="t_company" class="block text-sm font-medium mb-2">Empresa</label>
						<input id="t_company" type="text" bind:value={testimonialForm.company} class="input" placeholder="Ex: TechCorp" />
					</div>
				</div>

				<div>
					<label for="t_quote" class="block text-sm font-medium mb-2">Depoimento *</label>
					<textarea id="t_quote" bind:value={testimonialForm.quote} rows="4" required class="input resize-none" placeholder="Escreva o depoimento..."></textarea>
				</div>

				<div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
					<div>
						<label for="t_avatar" class="block text-sm font-medium mb-2">Avatar URL</label>
						<input id="t_avatar" type="url" bind:value={testimonialForm.avatar_url} class="input" placeholder="https://..." />
					</div>
					<div>
						<label for="t_linkedin" class="block text-sm font-medium mb-2">LinkedIn URL</label>
						<input id="t_linkedin" type="url" bind:value={testimonialForm.linkedin_url} class="input" placeholder="https://linkedin.com/in/..." />
					</div>
				</div>

				<div class="flex gap-3 pt-4">
					<button type="button" onclick={closeTestimonialModal} class="flex-1 btn-outline">
						Cancelar
					</button>
					<button type="submit" class="flex-1 btn-primary" disabled={!testimonialForm.name || !testimonialForm.quote}>
						Salvar
					</button>
				</div>
			</form>
		</div>
	</div>
{/if}
