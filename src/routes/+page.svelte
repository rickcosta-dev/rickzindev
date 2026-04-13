<script lang="ts">
	import { onMount } from 'svelte';
	import { fly } from 'svelte/transition';
	import { db, type Project } from '$lib/firebaseConfig';
	import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore';

	let projects = $state<Project[]>([]);
	let loading = $state(true);

	const techStack = [
		{ name: 'SvelteKit', icon: 'S', color: '#ff3e00' },
		{ name: 'TypeScript', icon: 'TS', color: '#3178c6' },
		{ name: 'Node.js', icon: 'N', color: '#339933' },
		{ name: 'PostgreSQL', icon: 'PG', color: '#336791' },
		{ name: 'Firebase', icon: 'F', color: '#FFCA28' },
		{ name: 'TailwindCSS', icon: 'TW', color: '#06b6d4' },
		{ name: 'Git', icon: 'G', color: '#f05032' },
		{ name: 'Docker', icon: 'D', color: '#2496ed' }
	];

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

	const testimonials = [
		{
			name: 'Carlos Silva',
			company: 'TechCorp',
			quote: 'Excelente trabalho! Entregou o projeto antes do prazo com qualidade excepcional.',
			avatar: 'CS'
		},
		{
			name: 'Maria Santos',
			company: 'StartupXYZ',
			quote: 'Profissional muito competente. Recomendamos para qualquer projeto fullstack.',
			avatar: 'MS'
		},
		{
			name: 'João Oliveira',
			company: 'DevHub',
			quote: 'Código limpo, bem estruturado e documentado. Uma parceria de sucesso.',
			avatar: 'JO'
		}
	];

	onMount(() => {
		const loadProjects = async () => {
			try {
				const q = query(collection(db, 'projects'), orderBy('created_at', 'desc'), limit(3));
				const querySnapshot = await getDocs(q);
				projects = querySnapshot.docs.map(doc => ({
					id: doc.id,
					...doc.data()
				})) as Project[];
			} catch (error) {
				console.error('Error loading projects:', error);
			} finally {
				loading = false;
			}
		};

		loadProjects();

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

<!-- Hero Section -->
<section class="min-h-[85vh] pt-16 flex items-center justify-center relative overflow-hidden">
	<!-- Animated Background -->
	<div class="absolute inset-0 overflow-hidden">
		<div class="absolute top-1/4 -left-1/4 w-[600px] h-[600px] bg-accent-primary/20 rounded-full blur-[120px] animate-pulse-slow"></div>
		<div class="absolute bottom-1/4 -right-1/4 w-[600px] h-[600px] bg-accent-secondary/20 rounded-full blur-[120px] animate-pulse-slow" style="animation-delay: 1.5s;"></div>
	</div>

	<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
		<div in:fly={{ y: 30, duration: 600, delay: 200 }}>
			<div class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent-primary/10 border border-accent-primary/30 mb-8">
				<span class="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
				<span class="text-sm text-slate-300">Disponível para novos projetos</span>
			</div>
		</div>

		<h1 in:fly={{ y: 30, duration: 600, delay: 400 }} class="text-5xl sm:text-6xl lg:text-7xl font-extrabold mb-6">
			<span class="text-slate-50">Olá, sou </span>
			<span class="gradient-text">Rick Gonzalez</span>
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

<!-- Tech Stack Section -->
<section id="tech" class="py-20 reveal">
	<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
		<div class="text-center mb-16">
			<h2 class="text-3xl sm:text-4xl font-bold mb-4">
				<span class="gradient-text">Tech Stack</span>
			</h2>
			<p class="text-slate-400 text-lg max-w-xl mx-auto">
				Tecnologias que utilizo para criar soluções modernas
			</p>
		</div>

		<div class="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4">
			{#each techStack as tech, i}
				<div 
					class="group card flex flex-col items-center justify-center p-6 cursor-default"
					style="animation: float 3s ease-in-out infinite; animation-delay: {i * 0.2}s;"
				>
					<div 
						class="w-14 h-14 rounded-xl flex items-center justify-center text-lg font-bold mb-3 transition-transform group-hover:scale-110"
						style="background-color: {tech.color}20; color: {tech.color};"
					>
						{tech.icon}
					</div>
					<span class="text-xs text-slate-400">{tech.name}</span>
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
					<a href="/projetos/{project.id}" class="card group block">
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

		<div class="grid grid-cols-1 md:grid-cols-3 gap-6">
			{#each testimonials as testimonial, i}
				<div class="card">
					<svg class="w-8 h-8 text-accent-primary/30 mb-4" fill="currentColor" viewBox="0 0 24 24">
						<path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849v4.059l3.016 3.063L14.017 21zM12 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849v4.059l3.016 3.063L12 21z"/>
					</svg>
					<p class="text-slate-300 mb-6 italic">"{testimonial.quote}"</p>
					<div class="flex items-center gap-3">
						<div class="w-10 h-10 rounded-full bg-gradient-to-br from-accent-primary to-accent-secondary flex items-center justify-center text-sm font-bold">
							{testimonial.avatar}
						</div>
						<div>
							<p class="font-medium text-sm">{testimonial.name}</p>
							<p class="text-slate-500 text-xs">{testimonial.company}</p>
						</div>
					</div>
				</div>
			{/each}
		</div>
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
	.line-clamp-2 {
		display: -webkit-box;
		-webkit-line-clamp: 2;
		line-clamp: 2;
		-webkit-box-orient: vertical;
		overflow: hidden;
	}
</style>