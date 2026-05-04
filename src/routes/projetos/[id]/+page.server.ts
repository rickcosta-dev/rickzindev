import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { initializeApp, getApps } from 'firebase/app';
import { getFirestore, collection, doc, getDoc, query, orderBy, getDocs } from 'firebase/firestore';
import type { Project } from '$lib/firebaseConfig';
import {
	VITE_FIREBASE_API_KEY,
	VITE_FIREBASE_AUTH_DOMAIN,
	VITE_FIREBASE_PROJECT_ID,
	VITE_FIREBASE_STORAGE_BUCKET,
	VITE_FIREBASE_MESSAGING_SENDER_ID,
	VITE_FIREBASE_APP_ID
} from '$env/static/private';

function getDb() {
	const config = {
		apiKey: VITE_FIREBASE_API_KEY,
		authDomain: VITE_FIREBASE_AUTH_DOMAIN,
		projectId: VITE_FIREBASE_PROJECT_ID,
		storageBucket: VITE_FIREBASE_STORAGE_BUCKET,
		messagingSenderId: VITE_FIREBASE_MESSAGING_SENDER_ID,
		appId: VITE_FIREBASE_APP_ID
	};
	const app = getApps().length ? getApps()[0] : initializeApp(config, 'server-project');
	return getFirestore(app);
}

/** Converte qualquer Timestamp do Firestore ou Date para ISO string serializável */
function serializeDate(value: unknown): string | null {
	if (!value) return null;
	if (typeof (value as any).toDate === 'function') return (value as any).toDate().toISOString();
	if (value instanceof Date) return value.toISOString();
	if (typeof value === 'string') return value;
	return null;
}

/** Garante que o projeto retornado seja um POJO serializável pelo SvelteKit */
function serializeProject(raw: Record<string, unknown>): Project {
	return {
		...(raw as Project),
		created_at: serializeDate(raw.created_at),
		updated_at: serializeDate(raw.updated_at)
	};
}

export const load: PageServerLoad = async ({ params }) => {
	const db = getDb();
	const projectRef = doc(db, 'projects', params.id);
	const projectSnap = await getDoc(projectRef);

	if (!projectSnap.exists()) {
		throw error(404, 'Projeto não encontrado');
	}

	const project = serializeProject({ id: projectSnap.id, ...projectSnap.data() });

	// Buscar projetos adjacentes para navegação
	const q = query(collection(db, 'projects'), orderBy('created_at', 'desc'));
	const allSnap = await getDocs(q);
	const allProjects = allSnap.docs.map((d) =>
		serializeProject({ id: d.id, ...d.data() })
	);

	const currentIndex = allProjects.findIndex((p) => p.id === params.id);
	const prevProject = currentIndex > 0 ? allProjects[currentIndex - 1] : null;
	const nextProject = currentIndex < allProjects.length - 1 ? allProjects[currentIndex + 1] : null;

	return { project, prevProject, nextProject };
};
