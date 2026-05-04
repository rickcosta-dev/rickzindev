import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { rateLimit } from '$lib/rateLimit';
import { validateContactForm, hasErrors } from '$lib/validation';
import { initializeApp, getApps } from 'firebase/app';
import { getFirestore, collection, addDoc, serverTimestamp } from 'firebase/firestore';
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
	const app = getApps().length ? getApps()[0] : initializeApp(config, 'server');
	return getFirestore(app);
}

export const POST: RequestHandler = async ({ request, getClientAddress }) => {
	const ip = getClientAddress();
	const { allowed, retryAfterMs } = rateLimit(ip, 3, 60_000);

	if (!allowed) {
		const seconds = Math.ceil(retryAfterMs / 1000);
		return json(
			{ error: `Muitas tentativas. Tente novamente em ${seconds}s.` },
			{
				status: 429,
				headers: { 'Retry-After': String(seconds) }
			}
		);
	}

	let body: { name?: string; email?: string; message?: string };
	try {
		body = await request.json();
	} catch {
		return json({ error: 'Corpo da requisição inválido.' }, { status: 400 });
	}

	const { name = '', email = '', message = '' } = body;
	const errors = validateContactForm(name, email, message);

	if (hasErrors(errors)) {
		return json({ errors }, { status: 422 });
	}

	try {
		const db = getDb();
		const ref = await addDoc(collection(db, 'contacts'), {
			name: name.trim(),
			email: email.trim().toLowerCase(),
			message: message.trim(),
			created_at: serverTimestamp()
		});
		return json({ success: true, id: ref.id }, { status: 201 });
	} catch (err) {
		console.error('[contact] Firestore error:', err);
		return json({ error: 'Erro interno. Tente novamente mais tarde.' }, { status: 500 });
	}
};
