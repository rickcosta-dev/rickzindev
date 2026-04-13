<script lang="ts">
	import { onMount } from 'svelte';
	import { fly, fade } from 'svelte/transition';
	import { db, type Project, type Testimonial } from '$lib/firebaseConfig';
	import { collection, query, where, orderBy, limit, getDocs } from 'firebase/firestore';
	import rickPhoto from '$lib/assets/rick.jpg';

	let projects = $state<Project[]>([]);
	let loading = $state(true);
	let testimonials = $state<Testimonial[]>([]);
	let testimonialsLoading = $state(true);
	let selectedAlbum = $state<{ url: string; type: 'image' | 'video' }[] | null>(null);
	let currentAlbumIndex = $state(0);

	function openAlbum(album: { url: string; type: 'image' | 'video' }[] | null) {
		if (album && album.length > 0) {
			selectedAlbum = album;
			currentAlbumIndex = 0;
			document.documentElement.style.overflow = 'hidden';
			document.body.style.overflow = 'hidden';
		}
	}

	function closeAlbum() {
		selectedAlbum = null;
		document.documentElement.style.overflow = '';
		document.body.style.overflow = '';
	}

	function nextAlbumItem(e?: Event) {
		if (e) {
			e.preventDefault();
			e.stopPropagation();
		}
		if (selectedAlbum) {
			currentAlbumIndex = (currentAlbumIndex + 1) % selectedAlbum.length;
		}
	}

	function prevAlbumItem(e?: Event) {
		if (e) {
			e.preventDefault();
			e.stopPropagation();
		}
		if (selectedAlbum) {
			currentAlbumIndex = (currentAlbumIndex - 1 + selectedAlbum.length) % selectedAlbum.length;
		}
	}

	function handleKeydown(e: KeyboardEvent) {
		if (!selectedAlbum) return;
		if (e.key === 'Escape') closeAlbum();
		if (e.key === 'ArrowRight') nextAlbumItem();
		if (e.key === 'ArrowLeft') prevAlbumItem();
	}

	function handleAlbumOverlayClick(e: MouseEvent) {
		if (e.target === e.currentTarget) {
			closeAlbum();
		}
	}

	function getInitials(fullName: string) {
		const parts = fullName.trim().split(/\s+/).filter(Boolean);
		const first = parts[0]?.[0] ?? '';
		const last = parts.length > 1 ? parts[parts.length - 1]?.[0] ?? '' : '';
		return (first + last).toUpperCase();
	}

	const skills = {
		'Front-end': [
			{ name: 'HTML5', color: '#E34F26' },
			{ name: 'CSS3', color: '#1572B6' },
			{ name: 'JavaScript', color: '#F7DF1E' },
			{ name: 'TypeScript', color: '#3178C6' },
			{ name: 'SvelteKit', color: '#FF3E00' },
			{ name: 'TailwindCSS', color: '#06B6D4' },
			{ name: 'React', color: '#61DAFB' },
			{ name: 'Bootstrap', color: '#7952B3' }
		],
		'Back-end': [
			{ name: 'Node.js', color: '#339933' },
			{ name: 'Express', color: '#000000' },
			{ name: 'PHP', color: '#777BB4' },
			{ name: 'Lua', color: '#000080' },
			{ name: 'Pawn', color: '#EBEBEB' },
			{ name: 'API REST', color: '#009688' },
			{ name: 'Firebase', color: '#FFCA28' }
		],
		'Banco de Dados': [
			{ name: 'PostgreSQL', color: '#4169E1' },
			{ name: 'MySQL', color: '#4479A1' },
			{ name: 'MongoDB', color: '#47A248' },
			{ name: 'SQLite', color: '#003B57' }
		],
		'Ferramentas': [
			{ name: 'Git', color: '#F05032' },
			{ name: 'Docker', color: '#2496ED' }
		]
	};

	const services = [
		{
			title: 'Fullstack Development',
			description: 'Desenvolvimento de aplicações web completas, do backend ao frontend, utilizando tecnologias modernas.',
			icon: 'M13 10V3L4 14h7v7l9-11h-7z'
		},
		{
			title: 'API Design',
			description: 'Criação de APIs RESTful e GraphQL escaláveis, documentadas e seguras para integrations.',
			icon: 'M4 6h16M4 10h16M4 14h16M4 18h16'
		},
		{
			title: 'Technical Consulting',
			description: 'Consultoria técnica para arquitetura, performance e melhores práticas de desenvolvimento.',
			icon: 'M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.038-.175 3.42 3.42 0 014.976 0 3.42 3.42 0 001.038.175 3.42 3.42 0 014.976 0 3.42 3.42 0 001.038.175 3.42 3.42 0 014.976 0 3.42 3.42 0 001.038-.175 3.42 3.42 0 014.976 0 3.42 3.42 0 001.038.175 3.42 3.42 0 004.976 0 3.42 3.42 0 001.038-.175 3.42 3.42 0 014.976 0 3.42 3.42 0 001.038.175 3.42 3.42 0 004.976 0 3.42 3.42 0 001.038-.175 3.42 3.42 0 014.976 0 3.42 3.42 0 001.038.175 3.42 3.42 0 004.976 0 3.42 3.42 0 001.038-.175 3.42 3.42 0 014.976 0 3.42 3.42 0 001.038.175'
		}
	];

	onMount(() => {
		const toDateValue = (value: any) => {
			if (!value) return null;
			if (value instanceof Date) return value;
			if (typeof value?.toDate === 'function') return value.toDate();
			const d = new Date(value);
			return Number.isNaN(d.getTime()) ? null : d;
		};

		const loadProjects = async () => {
			try {
				let data: Project[] = [];

				try {
					const featuredQuery = query(collection(db, 'projects'), where('featured', '==', true), limit(50));
					const featuredSnap = await getDocs(featuredQuery);
					const featured = featuredSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Project[];

					featured.sort((a, b) => {
						const ao = a.featured_order ?? Number.POSITIVE_INFINITY;
						const bo = b.featured_order ?? Number.POSITIVE_INFINITY;
						if (ao !== bo) return ao - bo;

						const ad = toDateValue(a.created_at)?.getTime() ?? 0;
						const bd = toDateValue(b.created_at)?.getTime() ?? 0;
						return bd - ad;
					});

					data = featured.slice(0, 3);
				} catch {
					data = [];
				}

				if (!data || data.length === 0) {
					const recentQuery = query(collection(db, 'projects'), orderBy('created_at', 'desc'), limit(3));
					const recentSnap = await getDocs(recentQuery);
					data = recentSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Project[];
				}

				projects = data;
			} catch (error) {
				console.error('Error loading projects:', error);
			} finally {
				loading = false;
			}
		};

		const loadTestimonials = async () => {
			try {
				const approvedQuery = query(collection(db, 'testimonials'), where('approved', '==', true), limit(50));
				const snap = await getDocs(approvedQuery);
				const data = snap.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Testimonial[];

				data.sort((a, b) => {
					const ad = toDateValue(a.created_at)?.getTime() ?? 0;
					const bd = toDateValue(b.created_at)?.getTime() ?? 0;
					return bd - ad;
				});

				testimonials = data.slice(0, 3);
			} catch (error) {
				console.error('Error loading testimonials:', error);
			} finally {
				testimonialsLoading = false;
			}
		};

		loadProjects();
		loadTestimonials();

		const observer = new IntersectionObserver((entries) => {
			entries.forEach(entry => {
				if (entry.isIntersecting) {
					entry.target.classList.add('visible');
				}
			});
		}, { threshold: 0.1 });

		document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
		return () => observer.disconnect();
	});
</script>

<svelte:window onkeydown={handleKeydown} />

<!-- Hero Section -->
<section class="min-h-[85vh] pt-16 flex items-center justify-center relative overflow-hidden">
	<!-- Animated Background -->
	<div class="absolute inset-0 overflow-hidden">
		<div class="absolute top-1/4 -left-1/4 w-[600px] h-[600px] bg-accent-primary/20 rounded-full blur-[120px] animate-pulse-slow"></div>
		<div class="absolute bottom-1/4 -right-1/4 w-[600px] h-[600px] bg-accent-secondary/20 rounded-full blur-[120px] animate-pulse-slow" style="animation-delay: 1.5s;"></div>
	</div>

	<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
		<div in:fly={{ y: 30, duration: 600, delay: 200 }} class="mb-8">
			<div class="relative inline-block">
				<div class="absolute inset-0 bg-accent-primary/20 rounded-full blur-2xl animate-pulse"></div>
				<img 
					src={rickPhoto} 
					alt="Rick Gonzalez" 
					class="relative w-32 h-32 sm:w-40 sm:h-40 rounded-full object-cover border-2 border-accent-primary/30 shadow-2xl"
				/>
				<div class="absolute -bottom-2 -right-2 px-3 py-1 rounded-full bg-background-secondary border border-accent-primary/30 flex items-center gap-2">
					<span class="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
					<span class="text-[10px] sm:text-xs text-slate-300 font-medium">Online</span>
				</div>
			</div>
		</div>

		<h1 in:fly={{ y: 30, duration: 600, delay: 400 }} class="text-5xl sm:text-6xl lg:text-7xl font-extrabold mb-6">
			<span class="text-slate-50">Olá, eu sou </span>
			<span class="gradient-text">RickZin</span>
		</h1>

		<p in:fly={{ y: 30, duration: 600, delay: 600 }} class="text-xl sm:text-2xl text-slate-400 mb-8 max-w-2xl mx-auto">
			Fullstack Developer especializado em criar aplicações web modernas, performáticas e escaláveis.
		</p>

		<div in:fly={{ y: 30, duration: 600, delay: 800 }} class="flex flex-col sm:flex-row gap-4 justify-center">
			<a href="/projetos" class="btn-primary text-lg px-8 py-4">
				Ver Projetos
			</a>
			<a href="/contato" class="btn-outline text-lg px-8 py-4">
				Contato
			</a>
		</div>
	</div>
</section>

{#if selectedAlbum}
	<div class="fixed inset-0 z-[100]">
		<button
			type="button"
			class="absolute inset-0 bg-black/95 backdrop-blur-sm"
			aria-label="Fechar álbum"
			onclick={closeAlbum}
		></button>

		<div class="absolute inset-0 flex items-center justify-center">
		<!-- Close Button -->
		<button 
			onclick={closeAlbum}
			class="absolute p-3 text-white/70 hover:text-white hover:bg-white/10 rounded-full transition-all z-[110] bg-black/20"
			style="top: calc(env(safe-area-inset-top) + 1.25rem); right: calc(env(safe-area-inset-right) + 1.25rem);"
			aria-label="Fechar álbum"
		>
			<svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
			</svg>
		</button>

		<!-- Navigation Buttons -->
		<button 
			type="button"
			onclick={prevAlbumItem}
			disabled={selectedAlbum.length <= 1}
			class="absolute left-2 sm:left-6 top-1/2 -translate-y-1/2 p-2 sm:p-4 text-white rounded-full transition-all z-[110] bg-black/60 shadow-lg backdrop-blur-sm hover:bg-white/20 disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:bg-black/60"
			aria-label="Anterior"
		>
			<svg class="w-8 h-8 sm:w-10 sm:h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
			</svg>
		</button>

		<button 
			type="button"
			onclick={nextAlbumItem}
			disabled={selectedAlbum.length <= 1}
			class="absolute right-2 sm:right-6 top-1/2 -translate-y-1/2 p-2 sm:p-4 text-white rounded-full transition-all z-[110] bg-black/60 shadow-lg backdrop-blur-sm hover:bg-white/20 disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:bg-black/60"
			aria-label="Próximo"
		>
			<svg class="w-8 h-8 sm:w-10 sm:h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
			</svg>
		</button>

		<!-- Media Container -->
		<div class="w-full h-full flex items-center justify-center p-4 sm:p-12">
			<div class="relative w-full max-w-[95vw] sm:max-w-5xl max-h-[85vh] flex flex-col items-center justify-center animate-fadeIn">
				<div class="w-full max-h-[75vh] flex items-center justify-center rounded-2xl overflow-hidden shadow-2xl bg-zinc-900/50 border border-white/10">
					{#if selectedAlbum[currentAlbumIndex].type === 'image'}
						<img 
							src={selectedAlbum[currentAlbumIndex].url} 
							alt="Project media {currentAlbumIndex + 1}" 
							class="max-h-[75vh] w-auto object-contain"
						/>
					{:else}
						<video 
							src={selectedAlbum[currentAlbumIndex].url} 
							controls 
							autoplay
							class="max-h-[75vh] w-full aspect-video bg-black"
						>
							<track kind="captions" />
						</video>
					{/if}
				</div>

				<!-- Counter -->
				<div class="mt-6 px-4 py-2 rounded-full bg-white/10 border border-white/10 text-white/80 text-sm font-medium backdrop-blur-md">
					{currentAlbumIndex + 1} / {selectedAlbum.length}
				</div>
			</div>
		</div>
		</div>
	</div>
{/if}

<!-- Tech Stack Section -->
<section id="tech" class="py-20 reveal">
	<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
		<div class="text-center mb-16">
			<h2 class="text-3xl sm:text-4xl font-bold mb-4">
				<span class="gradient-text">Habilidades</span>
			</h2>
			<p class="text-slate-400 text-lg max-w-xl mx-auto">
				Tecnologias que utilizo para criar soluções modernas
			</p>
		</div>

		<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
			{#each Object.entries(skills) as [category, items]}
				<div class="card bg-background-secondary/50 border-accent-primary/20">
					<h3 class="text-xl font-bold mb-6 text-accent-primary">{category}</h3>
					<div class="flex flex-wrap gap-3">
						{#each items as item}
							<div 
								class="px-3 py-1.5 rounded-lg bg-background-tertiary border border-zinc-800 text-sm font-medium text-slate-300 hover:border-accent-primary/50 hover:text-white transition-all cursor-default"
								style="border-left: 3px solid {item.color}"
							>
								{item.name}
							</div>
						{/each}
					</div>
				</div>
			{/each}
		</div>
	</div>
</section>

<!-- Featured Projects Section -->
<section id="projects" class="py-20 bg-background-secondary reveal">
	<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
		<div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-16">
			<div>
				<h2 class="text-3xl sm:text-4xl font-bold mb-2">
					Projetos <span class="gradient-text">Destaque</span>
				</h2>
				<p class="text-slate-400">Alguns dos meus trabalhos recentes</p>
			</div>
			<a href="/projetos" class="btn-outline py-2 px-4 text-sm">
				Ver Todos →
			</a>
		</div>

		{#if loading}
			<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
				{#each [1, 2, 3] as _}
					<div class="card">
						<div class="w-full h-48 bg-background-tertiary rounded-lg animate-pulse mb-4"></div>
						<div class="h-6 bg-background-tertiary rounded animate-pulse mb-2"></div>
						<div class="h-4 bg-background-tertiary rounded animate-pulse w-2/3"></div>
					</div>
				{/each}
			</div>
		{:else if projects.length > 0}
			<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
				{#each projects as project}
					<div class="card group block overflow-hidden relative">
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
								<div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
							</div>
						</a>

						{#if project.album && project.album.length > 0}
							<button 
								onclick={(e) => { e.preventDefault(); e.stopPropagation(); openAlbum(project.album); }}
								class="absolute bottom-32 right-6 p-2 rounded-full bg-accent-primary text-white shadow-lg transform translate-y-0 opacity-100 md:translate-y-4 md:opacity-0 md:group-hover:translate-y-0 md:group-hover:opacity-100 transition-all z-20 hover:scale-110"
								title="Ver Álbum"
							>
								<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
								</svg>
							</button>
						{/if}

						<a href="/projetos/{project.id}" class="block">
							<h3 class="text-xl font-semibold mb-2 group-hover:text-accent-primary transition-colors">{project.title}</h3>
							<p class="text-slate-400 text-sm line-clamp-2 mb-4">{project.description}</p>
							{#if project.tech && project.tech.length > 0}
								<div class="flex flex-wrap gap-2">
									{#each project.tech.slice(0, 3) as t}
										<span class="px-2 py-1 text-xs rounded-md bg-accent-primary/10 text-accent-primary">
											{t}
										</span>
									{/each}
								</div>
							{/if}
						</a>
					</div>
				{/each}
			</div>
		{:else}
			<div class="text-center py-8">
				<p class="text-slate-400">Nenhum projeto encontrado ainda.</p>
				<a href="/dashboard" class="text-accent-primary hover:underline mt-2 inline-block">
					Adicionar projeto →
				</a>
			</div>
		{/if}
	</div>
</section>

<!-- Services Section -->
<section id="services" class="py-20 reveal">
	<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
		<div class="text-center mb-16">
			<h2 class="text-3xl sm:text-4xl font-bold mb-4">
				<span class="gradient-text">Serviços</span>
			</h2>
			<p class="text-slate-400 text-lg max-w-xl mx-auto">
				O que posso oferecer para o seu projeto
			</p>
		</div>

		<div class="grid grid-cols-1 md:grid-cols-3 gap-6">
			{#each services as service, i}
				<div 
					class="card text-center group"
					style="animation: fadeIn 0.4s ease-out {i * 0.1}s both;"
				>
					<div class="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-accent-primary to-accent-secondary flex items-center justify-center group-hover:scale-110 transition-transform">
						<svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d={service.icon}/>
						</svg>
					</div>
					<h3 class="text-xl font-semibold mb-3">{service.title}</h3>
					<p class="text-slate-400 text-sm">{service.description}</p>
				</div>
			{/each}
		</div>
	</div>
</section>

<!-- Testimonials Section -->
<section id="testimonials" class="py-20 bg-background-secondary reveal">
	<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
		<div class="text-center mb-16">
			<h2 class="text-3xl sm:text-4xl font-bold mb-4">
				<span class="gradient-text">Depoimentos</span>
			</h2>
			<p class="text-slate-400 text-lg max-w-xl mx-auto">
				O que clientes dizem sobre o meu trabalho
			</p>
		</div>

		{#if testimonialsLoading}
			<div class="grid grid-cols-1 md:grid-cols-3 gap-6">
				{#each [1, 2, 3] as _}
					<div class="card">
						<div class="w-10 h-10 rounded-full bg-background-tertiary animate-pulse mb-6"></div>
						<div class="h-4 bg-background-tertiary rounded animate-pulse mb-2"></div>
						<div class="h-4 bg-background-tertiary rounded animate-pulse mb-2 w-5/6"></div>
						<div class="h-4 bg-background-tertiary rounded animate-pulse w-2/3"></div>
					</div>
				{/each}
			</div>
		{:else if testimonials.length > 0}
			<div class="grid grid-cols-1 md:grid-cols-3 gap-6">
				{#each testimonials as testimonial, i}
					<div class="card">
						<svg class="w-8 h-8 text-accent-primary/30 mb-4" fill="currentColor" viewBox="0 0 24 24">
							<path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849v4.059l3.016 3.063L14.017 21zM12 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849v4.059l3.016 3.063L12 21z"/>
						</svg>
						<p class="text-slate-300 mb-6 italic">"{testimonial.quote}"</p>
						<div class="flex items-center gap-3">
							{#if testimonial.avatar_url}
								<img
									src={testimonial.avatar_url}
									alt={testimonial.name}
									class="w-10 h-10 rounded-full object-cover border border-white/10"
								/>
							{:else}
								<div class="w-10 h-10 rounded-full bg-gradient-to-br from-accent-primary to-accent-secondary flex items-center justify-center text-sm font-bold">
									{getInitials(testimonial.name)}
								</div>
							{/if}
							<div class="min-w-0">
								{#if testimonial.linkedin_url}
									<a href={testimonial.linkedin_url} target="_blank" rel="noopener" class="font-medium text-sm hover:text-accent-primary transition-colors truncate block">
										{testimonial.name}
									</a>
								{:else}
									<p class="font-medium text-sm truncate">{testimonial.name}</p>
								{/if}
								<p class="text-slate-500 text-xs truncate">
									{testimonial.role || ''}{testimonial.company ? ` • ${testimonial.company}` : ''}
								</p>
							</div>
						</div>
					</div>
				{/each}
			</div>
		{:else}
			<div class="text-center py-8 text-slate-400">
				Nenhum depoimento disponível ainda.
			</div>
		{/if}
	</div>
</section>

<!-- CTA Section -->
<section class="py-20 reveal">
	<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
		<div class="relative overflow-hidden rounded-3xl bg-gradient-to-br from-accent-primary/20 to-accent-secondary/20 border border-accent-primary/30 p-12 sm:p-20 text-center">
			<div class="absolute inset-0 bg-gradient-to-t from-accent-primary/10 to-transparent"></div>
			<div class="relative z-10">
				<h2 class="text-3xl sm:text-4xl font-bold mb-4">
					Vamos trabalhar juntos?
				</h2>
				<p class="text-slate-400 text-lg mb-8 max-w-xl mx-auto">
					Estou disponível para projetos freelancer e oportunidades full-time.
				</p>
				<a href="/contato" class="btn-primary text-lg px-8 py-4 inline-block">
					Fale Comigo
				</a>
			</div>
		</div>
	</div>
</section>

<style>
	@keyframes fadeIn {
		from { opacity: 0; transform: scale(0.98); }
		to { opacity: 1; transform: scale(1); }
	}
	:global(.animate-fadeIn) {
		animation: fadeIn 0.3s ease-out forwards;
	}
	.line-clamp-2 {
		display: -webkit-box;
		-webkit-line-clamp: 2;
		line-clamp: 2;
		-webkit-box-orient: vertical;
		overflow: hidden;
	}
</style>
