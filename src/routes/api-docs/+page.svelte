<script lang="ts">
	import { fly } from 'svelte/transition';

	const endpoints = [
		{
			method: 'GET',
			path: '/api/projects',
			description: 'Retorna todos os projetos cadastrados',
			body: null,
			response: `[
  {
    "id": "uuid",
    "title": "Projeto Exemplo",
    "description": "Descrição do projeto",
    "tech": ["Svelte", "TypeScript"],
    "image_url": "https://...",
    "github_url": "https://github.com/...",
    "live_url": "https://...",
    "created_at": "2024-01-01T00:00:00.000Z"
  }
]`
		},
		{
			method: 'POST',
			path: '/api/projects',
			description: 'Cria um novo projeto',
			body: `{
  "title": "Novo Projeto",
  "description": "Descrição",
  "tech": ["Svelte", "TypeScript"],
  "image_url": "https://...",
  "github_url": "https://github.com/...",
  "live_url": "https://..."
}`,
			response: `{
  "id": "uuid",
  "title": "Novo Projeto",
  "description": "Descrição",
  "tech": ["Svelte", "TypeScript"],
  "image_url": "https://...",
  "github_url": "https://github.com/...",
  "live_url": "https://...",
  "created_at": "2024-01-01T00:00:00.000Z"
}`
		},
		{
			method: 'PUT',
			path: '/api/projects',
			description: 'Atualiza um projeto existente',
			body: `{
  "id": "uuid",
  "title": "Projeto Atualizado",
  "description": "Nova descrição",
  "tech": ["Svelte", "TypeScript", "Supabase"],
  "image_url": "https://...",
  "github_url": "https://github.com/...",
  "live_url": "https://..."
}`,
			response: `{
  "id": "uuid",
  "title": "Projeto Atualizado",
  "description": "Nova descrição",
  "tech": ["Svelte", "TypeScript", "Supabase"],
  "image_url": "https://...",
  "github_url": "https://github.com/...",
  "live_url": "https://...",
  "created_at": "2024-01-01T00:00:00.000Z"
}`
		},
		{
			method: 'DELETE',
			path: '/api/projects?id={id}',
			description: 'Deleta um projeto pelo ID',
			body: null,
			response: `{ "success": true }`
		},
		{
			method: 'POST',
			path: '/api/contact',
			description: 'Envia uma mensagem de contato',
			body: `{
  "name": "João Silva",
  "email": "joao@email.com",
  "message": "Olá, gostaria de desenvolver um projeto..."
}`,
			response: `{ "success": true, "id": "uuid" }`
		}
	];

	const methodColors: Record<string, string> = {
		GET: 'bg-green-500/20 text-green-400',
		POST: 'bg-blue-500/20 text-blue-400',
		PUT: 'bg-yellow-500/20 text-yellow-400',
		DELETE: 'bg-red-500/20 text-red-400'
	};
</script>

<svelte:head>
	<title>API Docs | Rick Gonzalez</title>
	<meta name="description" content="Documentação da API do portfólio de Rick Gonzalez" />
</svelte:head>

<div class="min-h-screen py-24">
	<div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
		<!-- Header -->
		<div class="text-center mb-12">
			<h1 class="text-4xl sm:text-5xl font-bold mb-4">
				API <span class="gradient-text">Documentation</span>
			</h1>
			<p class="text-slate-400 text-lg">
				Endpoints da API para integração com o portfólio
			</p>
		</div>

		<!-- Base URL -->
		<div class="card mb-8">
			<h2 class="text-lg font-semibold mb-2">Base URL</h2>
			<code class="text-accent-primary">https://SEU-DOMINIO.vercel.app</code>
		</div>

		<!-- Endpoints -->
		<div class="space-y-6">
			{#each endpoints as endpoint, i}
				<div class="card" in:fly={{ y: 20, duration: 400, delay: i * 50 }}>
					<!-- Method & Path -->
					<div class="flex items-center gap-3 mb-4">
						<span class="px-3 py-1 rounded-lg font-mono font-bold text-sm {methodColors[endpoint.method]}">
							{endpoint.method}
						</span>
						<code class="text-slate-300">{endpoint.path}</code>
					</div>

					<!-- Description -->
					<p class="text-slate-400 mb-4">{endpoint.description}</p>

					<!-- Request Body -->
					{#if endpoint.body}
						<div class="mb-4">
							<h3 class="text-sm font-semibold text-slate-500 mb-2">Request Body</h3>
							<pre class="p-4 bg-background-primary rounded-lg overflow-x-auto text-sm"><code class="text-slate-300">{endpoint.body}</code></pre>
						</div>
					{/if}

					<!-- Response -->
					<div>
						<h3 class="text-sm font-semibold text-slate-500 mb-2">Response</h3>
						<pre class="p-4 bg-background-primary rounded-lg overflow-x-auto text-sm"><code class="text-slate-300">{endpoint.response}</code></pre>
					</div>
				</div>
			{/each}
		</div>

		<!-- Usage Example -->
		<div class="mt-12 card">
			<h2 class="text-xl font-bold mb-4">Exemplo de Uso</h2>
			<p class="text-slate-400 mb-4">Veja como usar a API com fetch:</p>
			
			<pre class="p-4 bg-background-primary rounded-lg overflow-x-auto text-sm"><code class="text-slate-300">// Buscar projetos
const response = await fetch('/api/projects');
const projects = await response.json();

// Criar projeto
const response = await fetch('/api/projects', &#123;
  method: 'POST',
  headers: &#123; 'Content-Type': 'application/json' &#125;,
  body: JSON.stringify(&#123;
    title: 'Novo Projeto',
    description: 'Descrição',
    tech: ['Svelte', 'TypeScript']
  &#125;)
&#125;);</code></pre>
		</div>

		<!-- Footer Info -->
		<div class="mt-8 text-center text-slate-500 text-sm">
			<p>Esta API está públicamente disponível para integração.</p>
			<p class="mt-2">© {new Date().getFullYear()} Rick Gonzalez</p>
		</div>
	</div>
</div>