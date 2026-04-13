import { browser } from '$app/environment';
import { writable } from 'svelte/store';

export type Lang = 'pt' | 'en' | 'es';

export const languages: { code: Lang; label: string }[] = [
	{ code: 'pt', label: 'PT' },
	{ code: 'en', label: 'EN' },
	{ code: 'es', label: 'ES' }
];

const DICT = {
	pt: {
		nav: {
			home: 'Início',
			projects: 'Projetos',
			contact: 'Contato',
			docs: 'Docs',
			login: 'Login',
			dashboard: 'Dashboard'
		},
		footer: {
			nav: 'Navegação',
			connect: 'Conecte-se',
			brandDesc: 'Transformo café em código limpo e entrega de verdade — com performance, UX e responsabilidade.'
		},
		contact: {
			availabilityTitle: 'Disponibilidade',
			availabilityText: 'Estou disponível para projetos freelance e oportunidades full-time.',
			responseTime: 'Tempo de resposta: 24–48 horas.',
			pageTitle: 'Contato',
			pageDescription: 'Entre em contato com RickZin - Fullstack Developer',
			headerTitleA: 'Fale',
			headerTitleB: 'Comigo',
			headerSubtitle: 'Tem um projeto em mente? Vamos conversar.',
			infoTitle: 'Informações de Contato',
			successTitle: 'Mensagem Enviada!',
			successBody: 'Obrigado pelo contato. Responderei em breve.',
			sendAnother: 'Enviar nova mensagem',
			labelName: 'Nome',
			placeholderName: 'Seu nome',
			labelEmail: 'Email',
			placeholderEmail: 'seu@email.com',
			labelMessage: 'Mensagem',
			placeholderMessage: 'Conte-me sobre seu projeto...',
			sending: 'Enviando...',
			sendMessage: 'Enviar Mensagem',
			sendError: 'Erro ao enviar mensagem'
		},
		docs: {
			title: 'Docs',
			subtitle: 'Linguagens e tecnologias que uso no dia a dia, com exemplos práticos',
			stackTitle: 'Como eu organizo meu stack',
			stackDesc: 'Front-end, back-end, banco de dados e ferramentas — tudo separado e objetivo.',
			chipExamples: 'Exemplos',
			chipSnippets: 'Snippets',
			viewSection: 'Ver seção →',
			exampleTitle: 'Exemplo: padrão de projeto',
			exampleDesc: 'Uma forma simples de organizar um projeto web: UI → serviços → dados.',
			footerText: 'Conteúdo em constante evolução conforme novos projetos são publicados.'
		}
	},
	en: {
		nav: {
			home: 'Home',
			projects: 'Projects',
			contact: 'Contact',
			docs: 'Docs',
			login: 'Login',
			dashboard: 'Dashboard'
		},
		footer: {
			nav: 'Navigation',
			connect: 'Connect',
			brandDesc: 'I turn coffee into clean code and real deliveries — with performance, UX, and responsibility.'
		},
		contact: {
			availabilityTitle: 'Availability',
			availabilityText: 'I’m available for freelance projects and full-time opportunities.',
			responseTime: 'Response time: 24–48 hours.',
			pageTitle: 'Contact',
			pageDescription: 'Get in touch with RickZin - Fullstack Developer',
			headerTitleA: 'Let’s',
			headerTitleB: 'Talk',
			headerSubtitle: 'Have a project in mind? Let’s chat.',
			infoTitle: 'Contact Info',
			successTitle: 'Message Sent!',
			successBody: 'Thanks for reaching out. I’ll reply soon.',
			sendAnother: 'Send another message',
			labelName: 'Name',
			placeholderName: 'Your name',
			labelEmail: 'Email',
			placeholderEmail: 'your@email.com',
			labelMessage: 'Message',
			placeholderMessage: 'Tell me about your project...',
			sending: 'Sending...',
			sendMessage: 'Send Message',
			sendError: 'Failed to send message'
		},
		docs: {
			title: 'Docs',
			subtitle: 'Languages and technologies I use daily, with practical examples',
			stackTitle: 'How I organize my stack',
			stackDesc: 'Front-end, back-end, databases and tools — organized and objective.',
			chipExamples: 'Examples',
			chipSnippets: 'Snippets',
			viewSection: 'View section →',
			exampleTitle: 'Example: project pattern',
			exampleDesc: 'A simple way to organize a web project: UI → services → data.',
			footerText: 'Content evolves as new projects are published.'
		}
	},
	es: {
		nav: {
			home: 'Inicio',
			projects: 'Proyectos',
			contact: 'Contacto',
			docs: 'Docs',
			login: 'Login',
			dashboard: 'Dashboard'
		},
		footer: {
			nav: 'Navegación',
			connect: 'Conectar',
			brandDesc: 'Convierto café en código limpio y entregas reales — con rendimiento, UX y responsabilidad.'
		},
		contact: {
			availabilityTitle: 'Disponibilidad',
			availabilityText: 'Estoy disponible para proyectos freelance y oportunidades full-time.',
			responseTime: 'Tiempo de respuesta: 24–48 horas.',
			pageTitle: 'Contacto',
			pageDescription: 'Ponte en contacto con RickZin - Fullstack Developer',
			headerTitleA: 'Hablemos',
			headerTitleB: 'Juntos',
			headerSubtitle: '¿Tienes un proyecto en mente? Conversemos.',
			infoTitle: 'Información de Contacto',
			successTitle: '¡Mensaje enviado!',
			successBody: 'Gracias por el contacto. Te responderé pronto.',
			sendAnother: 'Enviar otro mensaje',
			labelName: 'Nombre',
			placeholderName: 'Tu nombre',
			labelEmail: 'Email',
			placeholderEmail: 'tu@email.com',
			labelMessage: 'Mensaje',
			placeholderMessage: 'Cuéntame sobre tu proyecto...',
			sending: 'Enviando...',
			sendMessage: 'Enviar mensaje',
			sendError: 'Error al enviar el mensaje'
		},
		docs: {
			title: 'Docs',
			subtitle: 'Lenguajes y tecnologías que uso a diario, con ejemplos prácticos',
			stackTitle: 'Cómo organizo mi stack',
			stackDesc: 'Front-end, back-end, bases de datos y herramientas — organizado y directo.',
			chipExamples: 'Ejemplos',
			chipSnippets: 'Snippets',
			viewSection: 'Ver sección →',
			exampleTitle: 'Ejemplo: patrón de proyecto',
			exampleDesc: 'Una forma simple de organizar un proyecto web: UI → servicios → datos.',
			footerText: 'El contenido evoluciona a medida que se publican nuevos proyectos.'
		}
	}
} as const;

function detectBrowserLang(): Lang {
	if (!browser) return 'pt';
	const raw = (navigator.language || 'pt').toLowerCase();
	if (raw.startsWith('pt')) return 'pt';
	if (raw.startsWith('es')) return 'es';
	return 'en';
}

function getInitialLang(): Lang {
	if (!browser) return 'pt';
	const saved = localStorage.getItem('lang');
	if (saved === 'pt' || saved === 'en' || saved === 'es') return saved;
	return detectBrowserLang();
}

export const lang = writable<Lang>(getInitialLang());

lang.subscribe((value) => {
	if (!browser) return;
	localStorage.setItem('lang', value);
	document.documentElement.lang = value;
});

export function setLang(value: Lang) {
	lang.set(value);
}

export function t(key: string, currentLang: Lang): string {
	const parts = key.split('.');
	let node: any = DICT[currentLang];
	for (const p of parts) {
		node = node?.[p];
	}
	return typeof node === 'string' ? node : key;
}
