import type { AxiosError } from 'axios'

export function getFriendlyError(error: unknown): string {
    const fallback = 'Erro inesperado. Tente novamente.'

    if (!error) return fallback

    if ((error as AxiosError).isAxiosError) {
        const axiosError = error as AxiosError<any>

        const backendMessage =
            axiosError.response?.data?.message ||
            axiosError.response?.data?.error ||
            axiosError.message

        return mapBackendMessage(backendMessage)
    }

    if (typeof error === 'string') {
        return mapBackendMessage(error)
    }

    if (error instanceof Error) {
        return mapBackendMessage(error.message)
    }

    return fallback
}

function mapBackendMessage(message?: string): string {
    if (!message) return 'Erro inesperado. Tente novamente.'

    const map: Record<string, string> = {
        'User already exists': 'Usuário já cadastrado',
        'Invalid credentials': 'Email ou senha inválidos',
        'Incorrect password/email': 'Email ou senha incorretos',
    }

    return map[message] || message
}