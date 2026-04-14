<script lang="ts">
	import { onMount } from 'svelte';
	import { fly, fade } from 'svelte/transition';
	import { db, type Project, type Testimonial } from '$lib/firebaseConfig';
	import { collection, query, where, orderBy, limit, getDocs } from 'firebase/firestore';
	import rickPhoto from '$lib/assets/rick.jpg';
	import agLogo from '$lib/assets/AG_S_F.png';
	import pawnHubLogo from '$lib/assets/pawnhub.png';
	import aslLogo from '$lib/assets/asl.png';
	import calasansAvatar from '$lib/assets/calasans.png';
	import crazyArkzkAvatar from '$lib/assets/crazy-arkzk.png';
	import rickzinOwnerAvatar from '$lib/assets/giño-rick-y-morty.gif';

	let projects = $state<Project[]>([]);
	let loading = $state(true);
	let testimonials = $state<Testimonial[]>([]);
	let testimonialsLoading = $state(true);
	let selectedAlbum = $state<{ url: string; type: 'image' | 'video' }[] | null>(null);
	let currentAlbumIndex = $state(0);
	let selectedPartner = $state<{
		id: string;
		name: string;
		logo: string;
		owner: {
			name: string;
			title: string;
			avatar: string;
			bio: string;
		};
		about: string[];
		discordUrl: string;
		githubUrl: string;
	} | null>(null);

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
		if (e.key === 'Escape') {
			if (selectedAlbum) closeAlbum();
			if (selectedPartner) closePartner();
			return;
		}
		if (!selectedAlbum) return;
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

	const partners = [
		{
			id: 'aldergrounds',
			name: 'AlderGrounds',
			logo: agLogo,
			owner: {
				name: 'Calasans',
				title: 'Dono do AG',
				avatar: calasansAvatar,
				bio: 'Fundador do AlderGrounds (AG) e focado em modernizar a experiência multiplayer do GTA San Andreas.'
			},
			about: [
				'AlderGrounds (AG) é um mod multiplayer para GTA San Andreas que expande as funcionalidades do jogo no modo online.',
				'Sua estrutura é voltada para desenvolvedores, facilitando personalização e criação de recursos próprios.',
				'O objetivo da AG é modernizar a experiência multiplayer do GTA San Andreas, mantendo compatibilidade e flexibilidade.',
				'O mod oferece suporte a múltiplos ambientes de scripting:',
				'- C, C++, Rust, Go (via SDK)',
				'- C#, JS/TS (ambiente Node.js), Lua, Python e Pawn.',
				'AlderGrounds (AG) foi fundado por Calasans com o propósito de evoluir o cenário multiplayer do GTA San Andreas e impulsionar novas possibilidades para a comunidade.'
			],
			discordUrl: 'https://discord.gg/8jU2mqFryt',
			githubUrl: 'https://github.com/aldergrounds'
		},
		{
			id: 'asl',
			name: 'Atlas System Lab',
			logo: aslLogo,
			owner: {
				name: 'RickZin021',
				title: 'Dono do ASL',
				avatar: rickzinOwnerAvatar,
				bio: 'Fundador do Atlas System Lab (ASL), com foco em transformar ideias em projetos reais.'
			},
			about: [
				'O Atlas System Lab (ASL) é uma comunidade focada em desenvolvimento, com ênfase em Frontend, GameDev e criação de sistemas como bots e APIs.',
				'Diferente de muitas comunidades atuais, que acabam se tornando apenas espaços de conversa sem direção, aqui o foco permanece diretamente na criação de projetos reais e no aprendizado prático.',
				'Nosso objetivo é manter um ambiente ativo e dedicado, onde o desenvolvimento não seja deixado de lado e os membros realmente evoluam com o tempo.',
				'Além disso, contamos com chats para conversas gerais, garantindo também um espaço leve para interação entre os membros.',
				'O Atlas System Lab foi fundado por RickZin, com a proposta de criar um laboratório onde ideias saem do papel e se tornam realidade.'
			],
			discordUrl: 'https://discord.gg/r5jTW2WXHB',
			githubUrl: 'https://github.com/atlassystemlab/AtlasDev'
		},
		{
			id: 'pawnhub',
			name: 'PawnHub',
			logo: pawnHubLogo,
			owner: {
				name: 'Crazy ArKzK',
				title: 'Dono da PawnHub',
				avatar: crazyArkzkAvatar,
				bio: 'Fundador da Pawn Hubs, com foco em manter a comunidade ativa e dedicada ao desenvolvimento em Pawn.'
			},
			about: [
				'A Pawn Hubs é uma comunidade focada em SA-MP, com ênfase principal na linguagem Pawn e no suporte a dúvidas da comunidade.',
				'Diferente de muitas comunidades atuais, aqui o foco permanece diretamente no desenvolvimento e aprendizado da linguagem.',
				'O objetivo é manter um ambiente ativo e dedicado, onde canais relacionados ao Pawn não sejam abandonados.',
				'Além disso, há chats off-topic para conversas gerais, garantindo também um espaço leve para interação entre os membros.',
				'A Pawn Hubs foi fundada por Crazy ArKzK com a proposta de fortalecer e valorizar a comunidade focada em Pawn.'
			],
			discordUrl: 'https://discord.gg/WPV2nNVdDN',
			githubUrl: 'https://github.com/Pawn-Hubs'
		}
	] as const;

	function openPartner(partner: (typeof partners)[number]) {
		selectedPartner = partner;
		document.documentElement.style.overflow = 'hidden';
		document.body.style.overflow = 'hidden';
	}

	function closePartner() {
		selectedPartner = null;
		document.documentElement.style.overflow = '';
		document.body.style.overflow = '';
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

{#if selectedPartner}
	<div class="fixed inset-0 z-[100]">
		<button
			type="button"
			class="absolute inset-0 bg-black/80 backdrop-blur-sm"
			aria-label="Fechar comunidade"
			onclick={closePartner}
		></button>

		<div class="absolute inset-0 flex items-center justify-center p-4">
			<div class="card w-full max-w-2xl border border-white/10 bg-background-secondary/90 backdrop-blur-xl">
				<div class="flex items-start justify-between gap-4">
					<div class="flex items-center gap-4 min-w-0">
						<img src={selectedPartner.logo} alt={selectedPartner.name} class="w-14 h-14 rounded-2xl object-cover border border-white/10 bg-black/20" />
						<div class="min-w-0">
							<h3 class="text-2xl font-bold truncate">{selectedPartner.name}</h3>
							<p class="text-slate-400 text-sm">Comunidade parceira</p>
						</div>
					</div>
					<button
						type="button"
						onclick={closePartner}
						class="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
						aria-label="Fechar modal"
					>
						<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
						</svg>
					</button>
				</div>

				<div class="mt-6 space-y-3">
					{#each selectedPartner.about as paragraph}
						<p class="text-slate-300 text-sm leading-relaxed">{paragraph}</p>
					{/each}
				</div>

				<div class="mt-6 rounded-2xl overflow-hidden border border-white/10 bg-black/25">
					<div class="h-16 bg-gradient-to-r from-accent-primary/30 to-accent-secondary/30"></div>
					<div class="px-4 pb-4 -mt-10">
						<div class="flex items-end justify-between gap-4">
							<div class="flex items-end gap-3 min-w-0">
								<div class="relative">
									<img
										src={selectedPartner.owner.avatar}
										alt={selectedPartner.owner.name}
										class="w-20 h-20 rounded-full object-cover border-4 border-background-secondary shadow-lg"
									/>
									<span class="absolute bottom-2 right-2 w-3.5 h-3.5 rounded-full bg-green-500 border-2 border-background-secondary"></span>
								</div>
								<div class="min-w-0 pb-1">
									<p class="text-white font-bold leading-tight truncate">{selectedPartner.owner.name}</p>
									<div class="flex flex-wrap items-center gap-2 mt-1">
										<span class="px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-xs font-semibold text-slate-200">
											{selectedPartner.owner.title}
										</span>
										<span class="px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-xs font-semibold text-slate-400">
											Online
										</span>
									</div>
								</div>
							</div>
						</div>

						<div class="mt-4 rounded-xl bg-background-primary/60 border border-white/5 p-4">
							<p class="text-[11px] uppercase tracking-widest text-slate-400 font-semibold mb-2">Sobre</p>
							<p class="text-slate-300 text-sm leading-relaxed">{selectedPartner.owner.bio}</p>
						</div>
					</div>
				</div>

				<div class="mt-8 flex flex-col sm:flex-row gap-3">
					<a
						href={selectedPartner.discordUrl}
						target="_blank"
						rel="noopener"
						class="btn-primary flex-1 flex items-center justify-center gap-2 py-3"
					>
						<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
							<path d="M19.54 0c1.11 0 2.01.9 2.01 2.01v19.98c0 1.11-.9 2.01-2.01 2.01H4.46C3.35 26 2.45 25.1 2.45 23.99V2.01C2.45.9 3.35 0 4.46 0h15.08zM15.6 7.2c-1.18-.54-2.45-.83-3.78-.86l-.37.75c-1.29.06-2.56.35-3.78.86-.12-.21-.24-.5-.37-.75-1.33.03-2.6.32-3.78.86-2.39 3.56-3.04 7.03-2.72 10.45 1.58 1.17 3.11 1.88 4.62 2.35.37-.5.71-1.03 1-1.6-.54-.2-1.06-.47-1.57-.8.13-.1.26-.2.38-.3 3.03 1.38 6.32 1.38 9.32 0 .12.1.25.2.38.3-.51.33-1.03.6-1.57.8.29.57.63 1.1 1 1.6 1.51-.47 3.04-1.18 4.62-2.35.38-3.96-.65-7.39-2.72-10.45zM8.84 16.66c-.9 0-1.63-.83-1.63-1.85 0-1.02.73-1.85 1.63-1.85.9 0 1.64.83 1.63 1.85 0 1.02-.73 1.85-1.63 1.85zm6.02 0c-.9 0-1.63-.83-1.63-1.85 0-1.02.73-1.85 1.63-1.85.9 0 1.64.83 1.63 1.85 0 1.02-.73 1.85-1.63 1.85z"/>
						</svg>
						Discord
					</a>
					<a
						href={selectedPartner.githubUrl}
						target="_blank"
						rel="noopener"
						class="btn-outline flex-1 flex items-center justify-center gap-2 py-3"
					>
						<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
							<path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
						</svg>
						GitHub
					</a>
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

<section class="pt-6 pb-10 bg-background-secondary reveal">
	<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
		<div class="h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>

		<div class="mt-8 text-center">
			<h3 class="text-xl sm:text-2xl font-bold">
				Comunidades <span class="gradient-text">Parceiras</span>
			</h3>
			<p class="text-slate-400 text-sm sm:text-base">Clique para conhecer</p>
		</div>
	</div>

	<div class="mt-6 marquee-bleed">
		<div class="marquee">
			<div class="marquee-track">
				{#each partners as partner}
					<button
						type="button"
						class={partner.id === 'asl' ? 'marquee-item marquee-item-featured' : 'marquee-item'}
						onclick={() => openPartner(partner)}
						aria-label={"Abrir informações da comunidade " + partner.name}
					>
						<div class="relative">
							<img
								src={partner.logo}
								alt={partner.name}
								class={partner.id === 'asl'
									? 'w-7 h-7 rounded-lg object-cover border border-blue-400/40 bg-blue-500/10'
									: 'w-7 h-7 rounded-lg object-cover border border-white/10 bg-black/20'}
							/>
							{#if partner.id === 'asl'}
								<span class="absolute -top-4 left-1/2 -translate-x-1/2 text-base drop-shadow" aria-hidden="true">👑</span>
							{/if}
						</div>
						<span class={partner.id === 'asl' ? 'text-sm font-semibold text-blue-200' : 'text-sm font-semibold text-slate-200'}>
							{partner.name}
						</span>
					</button>
				{/each}
			</div>
		</div>
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
	@keyframes marqueeScroll {
		from { transform: translateX(100vw); }
		to { transform: translateX(-100%); }
	}
	.marquee-bleed {
		width: 100vw;
		position: relative;
		left: 50%;
		right: 50%;
		margin-left: -50vw;
		margin-right: -50vw;
		padding-left: 0;
		padding-right: 0;
	}
	.marquee {
		overflow: hidden;
		border-radius: 0;
		background: rgba(255, 255, 255, 0.03);
		border: 1px solid rgba(255, 255, 255, 0.06);
	}
	.marquee-track {
		display: flex;
		gap: 0.75rem;
		width: max-content;
		padding: 0.9rem 1.25rem;
		animation: marqueeScroll 20s linear infinite;
		will-change: transform;
	}
	.marquee:hover .marquee-track,
	.marquee:focus-within .marquee-track {
		animation-play-state: paused;
	}
	.marquee-item {
		display: inline-flex;
		align-items: center;
		gap: 0.6rem;
		padding: 0.65rem 0.9rem;
		border-radius: 9999px;
		background: rgba(0, 0, 0, 0.25);
		border: 1px solid rgba(255, 255, 255, 0.08);
		transition: transform 160ms ease, background 160ms ease, border-color 160ms ease;
		white-space: nowrap;
	}
	.marquee-item:hover,
	.marquee-item:focus-visible {
		transform: translateY(-1px);
		background: rgba(255, 255, 255, 0.06);
		border-color: rgba(255, 255, 255, 0.16);
		outline: none;
	}
	.marquee-item-featured {
		background: rgba(59, 130, 246, 0.12);
		border-color: rgba(59, 130, 246, 0.35);
	}
	.marquee-item-featured:hover,
	.marquee-item-featured:focus-visible {
		background: rgba(59, 130, 246, 0.18);
		border-color: rgba(59, 130, 246, 0.5);
	}
	.line-clamp-2 {
		display: -webkit-box;
		-webkit-line-clamp: 2;
		line-clamp: 2;
		-webkit-box-orient: vertical;
		overflow: hidden;
	}
</style>
