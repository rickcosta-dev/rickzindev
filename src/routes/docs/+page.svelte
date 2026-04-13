<script lang="ts">
	import { fly } from 'svelte/transition';
	import { lang, t } from '$lib/i18n';

	type DocTopic = {
		id: string;
		title: string;
		level: 'Básico' | 'Intermediário' | 'Avançado';
		category: 'Front-end' | 'Back-end' | 'Banco de Dados' | 'Ferramentas';
		description: string;
		codeLabel: string;
		code: string;
		imageLabel: string;
		svgPath: string;
	};

	const topics: DocTopic[] = [
		{
			id: 'sveltekit',
			title: 'SvelteKit',
			level: 'Intermediário',
			category: 'Front-end',
			description: 'Framework fullstack para criar aplicações rápidas, com rotas por arquivo, SSR e ótima DX.',
			codeLabel: 'Exemplo: página com $state',
			code: `// src/routes/+page.svelte
let count = $state(0);

function inc() {
  count++;
}

<button onclick={inc}>Clicks: {count}</button>`,
			imageLabel: 'Rota por arquivo',
			svgPath: 'M4 6h16M4 12h16M4 18h16M7 9h10M7 15h10'
		},
		{
			id: 'typescript',
			title: 'TypeScript',
			level: 'Intermediário',
			category: 'Front-end',
			description: 'Tipagem estática para JavaScript, ajudando a reduzir bugs e melhorar a manutenção.',
			codeLabel: 'Exemplo: tipos e função',
			code: `type Project = {
  id: string;
  title: string;
  tech: string[];
};

function formatTitle(p: Project): string {
  return p.title.toUpperCase();
}`,
			imageLabel: 'Tipagem',
			svgPath: 'M7 7h10v10H7zM9 9h6M9 12h6M9 15h4'
		},
		{
			id: 'tailwind',
			title: 'TailwindCSS',
			level: 'Intermediário',
			category: 'Front-end',
			description: 'Utility-first CSS para construir layouts responsivos rapidamente sem sair do HTML.',
			codeLabel: 'Exemplo: card responsivo',
			code: `<div class="rounded-xl border border-zinc-800 bg-background-secondary p-6">
  <h3 class="text-xl font-semibold">Card</h3>
  <p class="text-slate-400 mt-2">Texto</p>
  <button class="btn-primary mt-4">Ação</button>
</div>`,
			imageLabel: 'Utilities',
			svgPath: 'M4 8h16M4 12h16M4 16h16M7 8v8M12 8v8M17 8v8'
		},
		{
			id: 'node',
			title: 'Node.js + Express',
			level: 'Intermediário',
			category: 'Back-end',
			description: 'Back-end com APIs REST, rotas, validação e integrações.',
			codeLabel: 'Exemplo: endpoint REST',
			code: `import express from 'express';

const app = express();
app.use(express.json());

app.get('/health', (_req, res) => res.json({ ok: true }));
app.listen(3000);`,
			imageLabel: 'API',
			svgPath: 'M4 6h16M4 10h16M4 14h10M4 18h8'
		},
		{
			id: 'firebase',
			title: 'Firebase (Firestore + Auth)',
			level: 'Intermediário',
			category: 'Back-end',
			description: 'Banco NoSQL, autenticação e integrações para apps web, com SDK oficial e boa escalabilidade.',
			codeLabel: 'Exemplo: leitura do Firestore',
			code: `import { collection, getDocs } from 'firebase/firestore';
import { db } from '$lib/firebaseConfig';

const snap = await getDocs(collection(db, 'projects'));
const projects = snap.docs.map(d => ({ id: d.id, ...d.data() }));`,
			imageLabel: 'Coleções',
			svgPath: 'M7 7h10v4H7zM7 13h10v4H7z'
		},
		{
			id: 'postgres',
			title: 'PostgreSQL',
			level: 'Intermediário',
			category: 'Banco de Dados',
			description: 'Banco relacional robusto, ótimo para dados estruturados, consultas SQL e consistência.',
			codeLabel: 'Exemplo: consulta SQL',
			code: `SELECT id, title, created_at
FROM projects
WHERE featured = true
ORDER BY featured_order ASC, created_at DESC
LIMIT 3;`,
			imageLabel: 'SQL',
			svgPath: 'M6 8c0-2 12-2 12 0s-12 2-12 0zm0 0v8c0 2 12 2 12 0V8'
		},
		{
			id: 'git',
			title: 'Git',
			level: 'Intermediário',
			category: 'Ferramentas',
			description: 'Versionamento, branches, PRs e manutenção de histórico do projeto.',
			codeLabel: 'Exemplo: workflow básico',
			code: `git checkout -b feature/docs
git add .
git commit -m "Add docs page"
git push origin feature/docs`,
			imageLabel: 'Branches',
			svgPath:
				'M7 7a2 2 0 104 0 2 2 0 10-4 0zm0 10a2 2 0 104 0 2 2 0 10-4 0zm6-10v6a3 3 0 003 3h2'
		},
		{
			id: 'docker',
			title: 'Docker',
			level: 'Básico',
			category: 'Ferramentas',
			description: 'Containers para padronizar ambiente, facilitar deploy e reduzir “funciona na minha máquina”.',
			codeLabel: 'Exemplo: Dockerfile simples',
			code: `FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build
CMD ["npm","run","preview","--","--host","0.0.0.0"]`,
			imageLabel: 'Container',
			svgPath: 'M4 10h16M6 10v8M10 10v8M14 10v8M18 10v8M7 6h10v4H7z'
		}
	];

	const levelColors: Record<DocTopic['level'], string> = {
		'Básico': 'bg-slate-500/20 text-slate-300',
		'Intermediário': 'bg-blue-500/20 text-blue-300',
		'Avançado': 'bg-violet-500/20 text-violet-300'
	};

	const categoryColors: Record<DocTopic['category'], string> = {
		'Front-end': 'bg-accent-primary/10 text-accent-primary',
		'Back-end': 'bg-green-500/10 text-green-400',
		'Banco de Dados': 'bg-yellow-500/10 text-yellow-300',
		'Ferramentas': 'bg-red-500/10 text-red-300'
	};

	const projectPatternCode = `type MediaItem = { url: string; type: 'image' | 'video' };

type Project = {
  id: string;
  title: string;
  album: MediaItem[] | null;
  featured?: boolean | null;
  featured_order?: number | null;
};

function isFeatured(p: Project): boolean {
  return Boolean(p.featured);
}`;
</script>

<svelte:head>
	<title>{t('docs.title', $lang)} | RickZin</title>
	<meta name="description" content={t('docs.subtitle', $lang)} />
</svelte:head>

<div class="min-h-screen py-24">
	<div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
		<div class="text-center mb-12">
			<h1 class="text-4xl sm:text-5xl font-bold mb-4">
				<span class="gradient-text">{t('docs.title', $lang)}</span>
			</h1>
			<p class="text-slate-400 text-lg">
				{t('docs.subtitle', $lang)}
			</p>
		</div>

		<div class="card mb-8">
			<div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
				<div>
					<h2 class="text-lg font-semibold mb-1">{t('docs.stackTitle', $lang)}</h2>
					<p class="text-slate-400 text-sm">
						{t('docs.stackDesc', $lang)}
					</p>
				</div>
				<div class="flex gap-2">
					<span class="px-3 py-1 rounded-lg text-xs font-semibold bg-white/5 border border-white/10 text-slate-300">
						{t('docs.chipExamples', $lang)}
					</span>
					<span class="px-3 py-1 rounded-lg text-xs font-semibold bg-white/5 border border-white/10 text-slate-300">
						{t('docs.chipSnippets', $lang)}
					</span>
				</div>
			</div>
		</div>

		<div class="space-y-6">
			{#each topics as topic, i}
				<div class="card" in:fly={{ y: 20, duration: 400, delay: i * 50 }}>
					<div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
						<div class="flex items-center gap-3">
							<div class="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
								<svg class="w-6 h-6 text-slate-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d={topic.svgPath} />
								</svg>
							</div>
							<div>
								<h2 class="text-lg font-semibold leading-tight">{topic.title}</h2>
								<div class="flex flex-wrap gap-2 mt-2">
									<span class="px-3 py-1 rounded-lg text-xs font-semibold {categoryColors[topic.category]}">
										{topic.category}
									</span>
									<span class="px-3 py-1 rounded-lg text-xs font-semibold {levelColors[topic.level]}">
										{topic.level}
									</span>
								</div>
							</div>
						</div>
						<a href={"#" + topic.id} class="text-sm text-slate-400 hover:text-white transition-colors">
							{t('docs.viewSection', $lang)}
						</a>
					</div>

					<p class="text-slate-400 mb-4" id={topic.id}>{topic.description}</p>

					<div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
						<div>
							<h3 class="text-sm font-semibold text-slate-500 mb-2">{topic.codeLabel}</h3>
							<pre class="p-4 bg-background-primary rounded-lg overflow-x-auto text-sm"><code class="text-slate-300">{topic.code}</code></pre>
						</div>
						<div class="h-full">
							<h3 class="text-sm font-semibold text-slate-500 mb-2">{topic.imageLabel}</h3>
							<div class="p-4 bg-background-primary rounded-lg border border-white/5 h-[220px] flex items-center justify-center">
								<svg class="w-24 h-24 text-white/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d={topic.svgPath} />
								</svg>
							</div>
						</div>
					</div>
				</div>
			{/each}
		</div>

		<div class="mt-12 card">
			<h2 class="text-xl font-bold mb-4">{t('docs.exampleTitle', $lang)}</h2>
			<p class="text-slate-400 mb-4">{t('docs.exampleDesc', $lang)}</p>

			<pre class="p-4 bg-background-primary rounded-lg overflow-x-auto text-sm"><code class="text-slate-300">{projectPatternCode}</code></pre>
		</div>

		<div class="mt-8 text-center text-slate-500 text-sm">
			<p>{t('docs.footerText', $lang)}</p>
			<p class="mt-2">© {new Date().getFullYear()} RickZin</p>
		</div>
	</div>
</div>
