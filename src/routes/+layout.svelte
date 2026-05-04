<script lang="ts">
	import '../app.css';
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import { fly } from 'svelte/transition';
	import favicon from '$lib/assets/giño-rick-y-morty.gif';
	import { lang, languages, setLang, t } from '$lib/i18n';
	import rickPhoto from '$lib/assets/rick.jpg';

	let { children } = $props();

	let mobileMenuOpen = $state(false);
	let scrolled = $state(false);
	let langMenuOpen = $state(false);

	const links = [
		{ href: '/', key: 'nav.home' },
		{ href: '/projetos', key: 'nav.projects' },
		{ href: '/contato', key: 'nav.contact' },
		{ href: '/docs', key: 'nav.docs' }
	];

	onMount(() => {
		const handleScroll = () => { scrolled = window.scrollY > 50; };
		window.addEventListener('scroll', handleScroll, { passive: true });
		return () => window.removeEventListener('scroll', handleScroll);
	});

	function toggleMobileMenu() {
		mobileMenuOpen = !mobileMenuOpen;
	}

	function closeMobileMenu() {
		mobileMenuOpen = false;
	}

	function isActive(href: string) {
		if (href === '/') return $page.url.pathname === '/';
		return $page.url.pathname.startsWith(href);
	}
</script>

<svelte:head>
	<title>RickZin | Fullstack Developer</title>
	<meta name="description" content="Fullstack Developer especializado em SvelteKit, Firebase e TypeScript. Criando aplicações web modernas, performáticas e escaláveis." />
	<meta name="keywords" content="fullstack developer, sveltekit, typescript, firebase, web development, rickzin" />
	<meta name="author" content="RickZin" />
	<meta property="og:title" content="RickZin | Fullstack Developer" />
	<meta property="og:description" content="Fullstack Developer especializado em SvelteKit, Firebase e TypeScript." />
	<meta property="og:type" content="website" />
	<meta property="og:url" content="https://rickzin.dev" />
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content="RickZin | Fullstack Developer" />
	<meta name="twitter:description" content="Fullstack Developer especializado em SvelteKit, Firebase e TypeScript." />
	<link rel="canonical" href="https://rickzin.dev" />
	<link rel="icon" type="image/gif" href={favicon} />
</svelte:head>

<div class="min-h-screen flex flex-col">
	<!-- Skip-to-content para acessibilidade -->
	<a href="#main-content" class="skip-link">Ir para o conteúdo</a>

	<nav class="fixed top-0 left-0 right-0 z-50 transition-all duration-300 {scrolled ? 'glass shadow-lg' : ''}">
		<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
			<div class="flex items-center justify-between h-16">
				<a href="/" class="flex items-center gap-2">
					<div class="w-10 h-10 rounded-xl overflow-hidden flex items-center justify-center">
						<img src={favicon} alt="Logo RickZin" class="w-full h-full object-cover" />
					</div>
					<span class="hidden sm:block text-lg font-bold">Rick<span class="text-accent-primary">Zin</span></span>
				</a>

				<div class="hidden md:flex items-center gap-8">
					{#each links as link}
						<a
							href={link.href}
							class="text-sm font-medium transition-colors duration-200 relative {isActive(link.href) ? 'text-accent-primary' : 'text-slate-400 hover:text-white'}"
						>
							{t(link.key, $lang)}
							{#if isActive(link.href)}
								<span class="absolute -bottom-1 left-0 right-0 h-0.5 bg-accent-primary rounded-full"></span>
							{/if}
						</a>
					{/each}
				</div>

				<div class="hidden md:flex items-center gap-3">
					<div class="relative">
						<button
							type="button"
							onclick={() => langMenuOpen = !langMenuOpen}
							class="px-3 py-2 rounded-xl bg-background-tertiary border border-zinc-800 text-sm font-semibold text-slate-300 hover:text-white transition-colors"
							aria-label="Selecionar idioma"
							aria-expanded={langMenuOpen}
							aria-haspopup="listbox"
						>
							{$lang.toUpperCase()}
						</button>
						{#if langMenuOpen}
							<div
								class="absolute right-0 mt-2 w-28 rounded-xl border border-zinc-800 bg-background-secondary shadow-xl overflow-hidden"
								role="listbox"
								aria-label="Idiomas disponíveis"
							>
								{#each languages as l}
									<button
										type="button"
										role="option"
										aria-selected={l.code === $lang}
										onclick={() => { setLang(l.code); langMenuOpen = false; }}
										class="w-full text-left px-3 py-2 text-sm {l.code === $lang ? 'text-accent-primary bg-accent-primary/10' : 'text-slate-300 hover:bg-white/5'}"
									>
										{l.label}
									</button>
								{/each}
							</div>
						{/if}
					</div>

					<a href="/login" class="text-sm font-medium text-slate-400 hover:text-white transition-colors">
						{t('nav.login', $lang)}
					</a>
					<a href="/dashboard" class="btn-primary text-sm py-2 px-4">
						{t('nav.dashboard', $lang)}
					</a>
				</div>

				<button
					onclick={toggleMobileMenu}
					class="md:hidden p-2 text-slate-400 hover:text-white transition-colors rounded-lg hover:bg-white/5"
					aria-label={mobileMenuOpen ? 'Fechar menu' : 'Abrir menu'}
					aria-expanded={mobileMenuOpen}
					aria-controls="mobile-menu"
				>
					<svg class="w-6 h-6 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						{#if mobileMenuOpen}
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
						{:else}
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
						{/if}
					</svg>
				</button>
			</div>
		</div>

		{#if mobileMenuOpen}
			<div
				id="mobile-menu"
				class="md:hidden glass border-t border-border-color"
				in:fly={{ y: -8, duration: 200 }}
				out:fly={{ y: -8, duration: 150 }}
			>
				<div class="px-4 py-4 space-y-1">
					{#each links as link}
						<a
							href={link.href}
							onclick={closeMobileMenu}
							class="flex items-center gap-3 px-3 py-2.5 rounded-xl text-base font-medium transition-colors {isActive(link.href) ? 'text-accent-primary bg-accent-primary/10' : 'text-slate-400 hover:text-white hover:bg-white/5'}"
						>
							{#if isActive(link.href)}
								<span class="w-1.5 h-1.5 rounded-full bg-accent-primary flex-shrink-0"></span>
							{:else}
								<span class="w-1.5 h-1.5 rounded-full bg-transparent flex-shrink-0"></span>
							{/if}
							{t(link.key, $lang)}
						</a>
					{/each}

					<div class="pt-3 border-t border-border-color mt-3">
						<div class="flex items-center justify-between mb-3 px-3">
							<span class="text-xs font-semibold text-slate-500 uppercase tracking-wider">Idioma</span>
							<div class="flex gap-1.5">
								{#each languages as l}
									<button
										type="button"
										onclick={() => setLang(l.code)}
										class="px-2.5 py-1 rounded-lg text-xs font-semibold border {l.code === $lang ? 'bg-accent-primary border-accent-primary text-white' : 'border-zinc-700 bg-background-tertiary text-slate-300 hover:border-zinc-600'} transition-colors"
									>
										{l.label}
									</button>
								{/each}
							</div>
						</div>
						<div class="flex gap-2">
							<a href="/login" onclick={closeMobileMenu} class="flex-1 text-center py-2.5 text-sm text-slate-400 hover:text-white border border-zinc-800 rounded-xl transition-colors">
								{t('nav.login', $lang)}
							</a>
							<a href="/dashboard" onclick={closeMobileMenu} class="flex-1 text-center btn-primary py-2.5 text-sm">
								{t('nav.dashboard', $lang)}
							</a>
						</div>
					</div>
				</div>
			</div>
		{/if}
	</nav>

	<main id="main-content" class="flex-1 pt-16">
		{@render children()}
	</main>

	<footer class="bg-background-secondary border-t border-border-color">
		<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
			<div class="grid grid-cols-1 md:grid-cols-4 gap-8">
				<div class="md:col-span-2">
					<div class="flex items-center gap-2 mb-4">
						<img src={rickPhoto} alt="RickZin" class="w-10 h-10 rounded-xl object-cover border border-white/10" />
						<span class="text-lg font-bold">Rick<span class="text-accent-primary">Dev</span></span>
					</div>
					<p class="text-slate-400 text-sm max-w-md">
						{t('footer.brandDesc', $lang)}
					</p>
				</div>

				<div>
					<h4 class="font-semibold mb-4">{t('footer.nav', $lang)}</h4>
					<ul class="space-y-2">
						<li><a href="/" class="text-slate-400 hover:text-accent-primary text-sm">{t('nav.home', $lang)}</a></li>
						<li><a href="/projetos" class="text-slate-400 hover:text-accent-primary text-sm">{t('nav.projects', $lang)}</a></li>
						<li><a href="/contato" class="text-slate-400 hover:text-accent-primary text-sm">{t('nav.contact', $lang)}</a></li>
						<li><a href="/docs" class="text-slate-400 hover:text-accent-primary text-sm">{t('nav.docs', $lang)}</a></li>
					</ul>
				</div>

				<div>
					<h4 class="font-semibold mb-4">{t('footer.connect', $lang)}</h4>
					<div class="flex gap-4">
						<a href="https://github.com" target="_blank" rel="noopener" aria-label="GitHub" class="text-slate-400 hover:text-white transition-colors">
							<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
								<path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
							</svg>
						</a>
						<a href="mailto:rick@example.com" aria-label="Email" class="text-slate-400 hover:text-white transition-colors">
							<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
							</svg>
						</a>
					</div>
				</div>
			</div>

			<div class="mt-8 pt-8 border-t border-border-color flex flex-col md:flex-row justify-between items-center gap-4">
				<p class="text-slate-500 text-sm">
					© {new Date().getFullYear()} RickZin. Todos os direitos reservados.
				</p>
				<div class="flex gap-6 text-sm">
					<span class="text-slate-500">Privacidade</span>
					<span class="text-slate-500">Termos</span>
				</div>
			</div>
		</div>
	</footer>
</div>
