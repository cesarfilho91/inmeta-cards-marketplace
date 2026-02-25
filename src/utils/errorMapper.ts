export function getFriendlyError(error?: string | null): string {
    if (!error) return 'Erro inesperado. Tente novamente.'

    const map: Record<string, string> = {
        'User already exists': 'Usuário já cadastrado',
        'Invalid credentials': 'Email ou senha inválidos',
        'Incorrect password/email': 'Email ou senha incorretos',
    }

    return map[error] || 'Erro inesperado. Tente novamente.'
}