<script lang="ts">
	import { fly } from 'svelte/transition';
	import { db } from '$lib/firebaseConfig';
	import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

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
			error = err instanceof Error ? err.message : 'Erro ao enviar mensagem';
		} finally {
			loading = false;
		}
	}
</script>

<svelte:head>
	<title>Contato | Rick Gonzalez</title>
	<meta name="description" content="Entre em contato com Rick Gonzalez - Fullstack Developer" />
</svelte:head>

<div class="min-h-screen py-24">
	<div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
		<!-- Header -->
		<div class="text-center mb-12">
			<h1 class="text-4xl sm:text-5xl font-bold mb-4">
				Fale <span class="gradient-text">Comigo</span>
			</h1>
			<p class="text-slate-400 text-lg">
				Tem um projeto em mente? Vamos conversar.
			</p>
		</div>

		<div class="grid grid-cols-1 lg:grid-cols-2 gap-12">
			<!-- Contact Info -->
			<div in:fly={{ x: -20, duration: 400 }}>
				<h2 class="text-2xl font-bold mb-6">Informações de Contato</h2>
				
				<div class="space-y-6">
					<div class="flex items-start gap-4">
						<div class="w-12 h-12 rounded-xl bg-accent-primary/10 flex items-center justify-center flex-shrink-0">
							<svg class="w-6 h-6 text-accent-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
							</svg>
						</div>
						<div>
							<h3 class="font-semibold mb-1">Email</h3>
							<a href="mailto:rick@example.com" class="text-slate-400 hover:text-accent-primary transition-colors">
								rick@example.com
							</a>
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
							<a href="https://github.com" target="_blank" rel="noopener" class="text-slate-400 hover:text-accent-primary transition-colors">
								github.com/rick
							</a>
						</div>
					</div>

					<div class="flex items-start gap-4">
						<div class="w-12 h-12 rounded-xl bg-accent-primary/10 flex items-center justify-center flex-shrink-0">
							<svg class="w-6 h-6 text-accent-primary" fill="currentColor" viewBox="0 0 24 24">
								<path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.731v20.538C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.731C24 .774 23.2 0 22.222 0h.003z"/>
							</svg>
						</div>
						<div>
							<h3 class="font-semibold mb-1">LinkedIn</h3>
							<a href="https://linkedin.com" target="_blank" rel="noopener" class="text-slate-400 hover:text-accent-primary transition-colors">
								linkedin.com/in/rick
							</a>
						</div>
					</div>
				</div>

				<div class="mt-8 p-6 bg-background-secondary rounded-xl border border-border-color">
					<h3 class="font-semibold mb-2">Disponibilidade</h3>
					<p class="text-slate-400 text-sm">
						Estoy disponible para proyectos freelance y oportunidades full-time. 
						Tiempo de respuesta: 24-48 horas.
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
						<h3 class="text-xl font-bold mb-2">Mensagem Enviada!</h3>
						<p class="text-slate-400 mb-6">Obrigado pelo contato. Responderei em breve.</p>
						<button 
							onclick={() => success = false}
							class="btn-outline"
						>
							Enviar nova mensagem
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
							<label for="name" class="block text-sm font-medium mb-2">Nome</label>
							<input
								type="text"
								id="name"
								bind:value={name}
								required
								class="input"
								placeholder="Seu nome"
							/>
						</div>

						<div class="mb-4">
							<label for="email" class="block text-sm font-medium mb-2">Email</label>
							<input
								type="email"
								id="email"
								bind:value={email}
								required
								class="input"
								placeholder="seu@email.com"
							/>
						</div>

						<div class="mb-6">
							<label for="message" class="block text-sm font-medium mb-2">Mensagem</label>
							<textarea
								id="message"
								bind:value={message}
								required
								rows="5"
								class="input resize-none"
								placeholder="Conte-me sobre seu projeto..."
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
									Enviando...
								</span>
							{:else}
								Enviar Mensagem
							{/if}
						</button>
					</form>
				{/if}
			</div>
		</div>
	</div>
</div>