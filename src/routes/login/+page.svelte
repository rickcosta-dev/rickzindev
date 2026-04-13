<script lang="ts">
	import { goto } from '$app/navigation';
	import { fly } from 'svelte/transition';
	import { supabase } from '$lib/supabaseClient';

	let email = $state('');
	let password = $state('');
	let loading = $state(false);
	let error = $state('');

	async function handleSubmit(e: Event) {
		e.preventDefault();
		loading = true;
		error = '';

		try {
			const { data, error: authError } = await supabase.auth.signInWithPassword({
				email,
				password
			});

			if (authError) {
				throw new Error(authError.message);
			}

			if (data.user) {
				goto('/dashboard');
			}
		} catch (err) {
			error = err instanceof Error ? err.message : 'Erro ao fazer login';
		} finally {
			loading = false;
		}
	}
</script>

<svelte:head>
	<title>Login | Rick Gonzalez</title>
</svelte:head>

<div class="min-h-screen flex items-center justify-center py-24">
	<div class="w-full max-w-md px-4">
		<div class="text-center mb-8">
			<h1 class="text-3xl font-bold mb-2">
				<span class="gradient-text">Dashboard</span>
			</h1>
			<p class="text-slate-400">Faça login para gerenciar o portfólio</p>
		</div>

		<div class="card" in:fly={{ y: 20, duration: 400 }}>
			{#if error}
				<div class="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">
					{error}
				</div>
			{/if}

			<form onsubmit={handleSubmit} class="space-y-4">
				<div>
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

				<div>
					<label for="password" class="block text-sm font-medium mb-2">Senha</label>
					<input
						type="password"
						id="password"
						bind:value={password}
						required
						class="input"
						placeholder="••••••••"
					/>
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
							Entrando...
						</span>
					{:else}
						Entrar
					{/if}
				</button>
			</form>

			<div class="mt-6 text-center">
				<a href="/" class="text-sm text-slate-400 hover:text-accent-primary">
					← Voltar ao início
				</a>
			</div>
		</div>
	</div>
</div>