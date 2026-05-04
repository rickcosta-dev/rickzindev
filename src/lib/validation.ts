export type FormErrors = {
	name?: string;
	email?: string;
	message?: string;
};

export function validateContactForm(
	name: string,
	email: string,
	message: string
): FormErrors {
	const errors: FormErrors = {};

	if (!name.trim()) {
		errors.name = 'Nome é obrigatório.';
	} else if (name.trim().length < 2) {
		errors.name = 'Nome deve ter pelo menos 2 caracteres.';
	}

	if (!email.trim()) {
		errors.email = 'Email é obrigatório.';
	} else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
		errors.email = 'Email inválido.';
	}

	if (!message.trim()) {
		errors.message = 'Mensagem é obrigatória.';
	} else if (message.trim().length < 10) {
		errors.message = 'Mensagem deve ter pelo menos 10 caracteres.';
	} else if (message.trim().length > 2000) {
		errors.message = 'Mensagem não pode ultrapassar 2000 caracteres.';
	}

	return errors;
}

export function hasErrors(errors: FormErrors): boolean {
	return Object.keys(errors).length > 0;
}
