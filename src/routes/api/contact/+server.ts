import { json } from '@sveltejs/kit';
import { supabase } from '$lib/supabaseClient';

export async function POST({ request }: { request: Request }) {
	try {
		const { name, email, message } = await request.json();

		if (!name || !email || !message) {
			return json({ error: 'Preencha todos os campos' }, { status: 400 });
		}

		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!emailRegex.test(email)) {
			return json({ error: 'Email inválido' }, { status: 400 });
		}

		const { data, error } = await supabase
			.from('contacts')
			.insert([{ name, email, message }])
			.select()
			.single();

		if (error) {
			console.error('Supabase error:', error);
			return json({ error: 'Erro ao salvar mensagem' }, { status: 500 });
		}

		return json({ success: true, id: data.id });
	} catch (err) {
		console.error('Contact API error:', err);
		return json({ error: 'Erro interno do servidor' }, { status: 500 });
	}
}