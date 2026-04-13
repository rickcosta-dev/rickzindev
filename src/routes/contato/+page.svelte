<script lang="ts">
	import { fly } from 'svelte/transition';
	import { db } from '$lib/firebaseConfig';
	import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
	import { lang, t } from '$lib/i18n';

	let name = $state('');
	let email = $state('');
	let message = $state('');
	let loading = $state(false);
	let success = $state(false);
	let error = $state('');

	async function handleSubmit(e: Event) {
		e.preventDefault();
		loading = true;
		error = '';

		try {
			await addDoc(collection(db, 'contacts'), {
				name,
				email,
				message,
				created_at: serverTimestamp()
			});

			success = true;
			name = '';
			email = '';
			message = '';
		} catch (err) {
			error = err instanceof Error ? err.message : t('contact.sendError', $lang);
		} finally {
			loading = false;
		}
	}
</script>

<svelte:head>
	<title>{t('contact.pageTitle', $lang)} | RickZin</title>
	<meta name="description" content={t('contact.pageDescription', $lang)} />
</svelte:head>

<div class="min-h-screen py-24">
	<div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
		<!-- Header -->
		<div class="text-center mb-12">
			<h1 class="text-4xl sm:text-5xl font-bold mb-4">
				{t('contact.headerTitleA', $lang)} <span class="gradient-text">{t('contact.headerTitleB', $lang)}</span>
			</h1>
			<p class="text-slate-400 text-lg">
				{t('contact.headerSubtitle', $lang)}
			</p>
		</div>

		<div class="grid grid-cols-1 lg:grid-cols-2 gap-12">
			<!-- Contact Info -->
			<div in:fly={{ x: -20, duration: 400 }}>
				<h2 class="text-2xl font-bold mb-6">{t('contact.infoTitle', $lang)}</h2>
				
				<div class="space-y-6">
					<div class="flex items-start gap-4">
						<div class="w-12 h-12 rounded-xl bg-accent-primary/10 flex items-center justify-center flex-shrink-0">
							<svg class="w-6 h-6 text-accent-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
							</svg>
						</div>
						<div>
							<h3 class="font-semibold mb-1">Email</h3>
							<a href="mailto:rickdev0021@gmail.com" class="text-slate-400 hover:text-accent-primary transition-colors">
								rickdev0021@gmail.com
							</a>
						</div>
					</div>

					<div class="flex items-start gap-4">
						<div class="w-12 h-12 rounded-xl bg-accent-primary/10 flex items-center justify-center flex-shrink-0">
							<svg class="w-6 h-6 text-accent-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
							</svg>
						</div>
						<div>
							<h3 class="font-semibold mb-1">Discord</h3>
							<span class="text-slate-400">rickzin021</span>
						</div>
					</div>

					<div class="flex items-start gap-4">
						<div class="w-12 h-12 rounded-xl bg-accent-primary/10 flex items-center justify-center flex-shrink-0">
							<svg class="w-6 h-6 text-accent-primary" fill="currentColor" viewBox="0 0 24 24">
								<path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
							</svg>
						</div>
						<div>
							<h3 class="font-semibold mb-1">GitHub</h3>
							<a href="https://github.com/rickcosta-dev/" target="_blank" rel="noopener" class="text-slate-400 hover:text-accent-primary transition-colors">
								rickcosta-dev
							</a>
						</div>
					</div>

					<div class="flex items-start gap-4">
						<div class="w-12 h-12 rounded-xl bg-accent-primary/10 flex items-center justify-center flex-shrink-0">
							<svg class="w-6 h-6 text-accent-primary" fill="currentColor" viewBox="0 0 24 24">
								<path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
							</svg>
						</div>
						<div>
							<h3 class="font-semibold mb-1">YouTube</h3>
							<a href="https://www.youtube.com/@rickplays021" target="_blank" rel="noopener" class="text-slate-400 hover:text-accent-primary transition-colors">
								@rickplays021
							</a>
						</div>
					</div>
				</div>

				<div class="mt-8 p-6 bg-background-secondary rounded-xl border border-border-color">
					<h3 class="font-semibold mb-2">{t('contact.availabilityTitle', $lang)}</h3>
					<p class="text-slate-400 text-sm">
						{t('contact.availabilityText', $lang)}
						{t('contact.responseTime', $lang)}
					</p>
				</div>
			</div>

			<!-- Contact Form -->
			<div in:fly={{ x: 20, duration: 400, delay: 100 }}>
				{#if success}
					<div class="card text-center py-12">
						<div class="w-16 h-16 mx-auto mb-4 rounded-full bg-green-500/10 flex items-center justify-center">
							<svg class="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
							</svg>
						</div>
						<h3 class="text-xl font-bold mb-2">{t('contact.successTitle', $lang)}</h3>
						<p class="text-slate-400 mb-6">{t('contact.successBody', $lang)}</p>
						<button 
							onclick={() => success = false}
							class="btn-outline"
						>
							{t('contact.sendAnother', $lang)}
						</button>
					</div>
				{:else}
					<form onsubmit={handleSubmit} class="card">
						{#if error}
							<div class="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">
								{error}
							</div>
						{/if}

						<div class="mb-4">
							<label for="name" class="block text-sm font-medium mb-2">{t('contact.labelName', $lang)}</label>
							<input
								type="text"
								id="name"
								bind:value={name}
								required
								class="input"
								placeholder={t('contact.placeholderName', $lang)}
							/>
						</div>

						<div class="mb-4">
							<label for="email" class="block text-sm font-medium mb-2">{t('contact.labelEmail', $lang)}</label>
							<input
								type="email"
								id="email"
								bind:value={email}
								required
								class="input"
								placeholder={t('contact.placeholderEmail', $lang)}
							/>
						</div>

						<div class="mb-6">
							<label for="message" class="block text-sm font-medium mb-2">{t('contact.labelMessage', $lang)}</label>
							<textarea
								id="message"
								bind:value={message}
								required
								rows="5"
								class="input resize-none"
								placeholder={t('contact.placeholderMessage', $lang)}
							></textarea>
						</div>

						<button
							type="submit"
							disabled={loading}
							class="btn-primary w-full py-3"
						>
							{#if loading}
								<span class="inline-flex items-center gap-2">
									<svg class="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
										<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
										<path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
									</svg>
									{t('contact.sending', $lang)}
								</span>
							{:else}
								{t('contact.sendMessage', $lang)}
							{/if}
						</button>
					</form>
				{/if}
			</div>
		</div>
	</div>
</div>
