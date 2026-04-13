import { error } from '@sveltejs/kit';
import { supabase } from '$lib/supabaseClient';

export async function load({ params }: { params: { id: string } }) {
	const { data: project, error: fetchError } = await supabase
		.from('projects')
		.select('*')
		.eq('id', params.id)
		.single();

	if (fetchError || !project) {
		error(404, 'Projeto não encontrado');
	}

	const { data: allProjects } = await supabase
		.from('projects')
		.select('id, title')
		.order('created_at', { ascending: false });

	const projectIndex = allProjects?.findIndex(p => p.id === params.id) ?? -1;
	const prevProject = projectIndex > 0 ? allProjects?.[projectIndex - 1] : null;
	const nextProject = projectIndex < (allProjects?.length ?? 0) - 1 ? allProjects?.[projectIndex + 1] : null;

	return {
		project,
		prevProject,
		nextProject
	};
}