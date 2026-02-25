export function getFriendlyError(error?: string | null): string {
    if (!error) return 'Erro inesperado. Tente novamente.'

    const map: Record<string, string> = {
        'User already exists': 'Usuário já cadastrado',
        'Invalid credentials': 'Email ou senha inválidos',
    }

    return map[error] || 'Erro inesperado. Tente novamente.'
}