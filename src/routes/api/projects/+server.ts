import { json } from '@sveltejs/kit';
import { supabase } from '$lib/supabaseClient';

export async function GET() {
	try {
		const { data, error } = await supabase
			.from('projects')
			.select('*')
			.order('created_at', { ascending: false });

		if (error) {
			console.error('Supabase error:', error);
			return json({ error: 'Erro ao buscar projetos' }, { status: 500 });
		}

		return json(data || []);
	} catch (err) {
		console.error('Projects API error:', err);
		return json({ error: 'Erro interno do servidor' }, { status: 500 });
	}
}

export async function POST({ request }: { request: Request }) {
	try {
		const { title, description, tech, image_url, github_url, live_url } = await request.json();

		if (!title) {
			return json({ error: 'Título é obrigatório' }, { status: 400 });
		}

		const { data, error } = await supabase
			.from('projects')
			.insert([{ 
				title, 
				description, 
				tech: tech || [], 
				image_url, 
				github_url, 
				live_url 
			}])
			.select()
			.single();

		if (error) {
			console.error('Supabase error:', error);
			return json({ error: 'Erro ao criar projeto' }, { status: 500 });
		}

		return json(data);
	} catch (err) {
		console.error('Projects API error:', err);
		return json({ error: 'Erro interno do servidor' }, { status: 500 });
	}
}

export async function PUT({ request }: { request: Request }) {
	try {
		const { id, title, description, tech, image_url, github_url, live_url } = await request.json();

		if (!id || !title) {
			return json({ error: 'ID e título são obrigatórios' }, { status: 400 });
		}

		const { data, error } = await supabase
			.from('projects')
			.update({ 
				title, 
				description, 
				tech: tech || [], 
				image_url, 
				github_url, 
				live_url 
			})
			.eq('id', id)
			.select()
			.single();

		if (error) {
			console.error('Supabase error:', error);
			return json({ error: 'Erro ao atualizar projeto' }, { status: 500 });
		}

		return json(data);
	} catch (err) {
		console.error('Projects API error:', err);
		return json({ error: 'Erro interno do servidor' }, { status: 500 });
	}
}

export async function DELETE({ url }: { url: URL }) {
	try {
		const id = url.searchParams.get('id');

		if (!id) {
			return json({ error: 'ID é obrigatório' }, { status: 400 });
		}

		const { error } = await supabase
			.from('projects')
			.delete()
			.eq('id', id);

		if (error) {
			console.error('Supabase error:', error);
			return json({ error: 'Erro ao deletar projeto' }, { status: 500 });
		}

		return json({ success: true });
	} catch (err) {
		console.error('Projects API error:', err);
		return json({ error: 'Erro interno do servidor' }, { status: 500 });
	}
}