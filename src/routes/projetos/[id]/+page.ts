import { error } from '@sveltejs/kit';
import { db } from '$lib/firebaseConfig';
import { doc, getDoc, collection, query, orderBy, getDocs } from 'firebase/firestore';

export async function load({ params }: { params: { id: string } }) {
	let project;
	try {
		const projectRef = doc(db, 'projects', params.id);
		const projectSnap = await getDoc(projectRef);
		
		if (!projectSnap.exists()) {
			error(404, 'Projeto não encontrado');
		}
		project = { id: projectSnap.id, ...projectSnap.data() };
	} catch (e) {
		error(404, 'Projeto não encontrado');
	}

	const q = query(collection(db, 'projects'), orderBy('created_at', 'desc'));
	const querySnapshot = await getDocs(q);
	const allProjects = querySnapshot.docs.map(d => ({ id: d.id, title: d.get('title') }));

	const projectIndex = allProjects.findIndex(p => p.id === params.id);
	const prevProject = projectIndex > 0 ? allProjects[projectIndex - 1] : null;
	const nextProject = projectIndex < allProjects.length - 1 ? allProjects[projectIndex + 1] : null;

	return {
		project,
		prevProject,
		nextProject
	};
}