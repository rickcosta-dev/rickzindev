<script lang="ts">
	import { page } from '$app/stores';
</script>

<svelte:head>
	<title>{$page.status} | RickZin</title>
</svelte:head>

<div class="min-h-screen flex items-center justify-center px-4">
	<div class="text-center max-w-md">
		<div class="relative inline-block mb-8">
			<div class="absolute inset-0 bg-accent-primary/20 rounded-full blur-3xl"></div>
			<span class="relative text-8xl font-extrabold gradient-text">{$page.status}</span>
		</div>

		<h1 class="text-2xl sm:text-3xl font-bold mb-3">
			{#if $page.status === 404}
				Página não encontrada
			{:else if $page.status === 403}
				Acesso negado
			{:else}
				Algo deu errado
			{/if}
		</h1>

		<p class="text-slate-400 mb-8 leading-relaxed">
			{#if $page.status === 404}
				A página que você está procurando não existe ou foi removida.
			{:else if $page.status === 403}
				Você não tem permissão para acessar este recurso.
			{:else}
				{$page.error?.message ?? 'Ocorreu um erro inesperado. Tente novamente.'}
			{/if}
		</p>

		<div class="flex flex-col sm:flex-row gap-3 justify-center">
			<a href="/" class="btn-primary">
				Voltar ao início
			</a>
			<a href="/projetos" class="btn-outline">
				Ver projetos
			</a>
		</div>
	</div>
</div>
