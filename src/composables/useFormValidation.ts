import { ref } from 'vue'

export function useFormValidation() {
    const error = ref('')

    function validateEmail(email: string): boolean {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!regex.test(email)) {
            error.value = 'Digite um email válido'
            return false
        }
        return true
    }

    function validatePassword(password: string): boolean {
        if (password.length < 6) {
            error.value = 'A senha deve ter no mínimo 6 caracteres'
            return false
        }
        return true
    }

    function resetError() {
        error.value = ''
    }

    return {
        error,
        validateEmail,
        validatePassword,
        resetError
    }
}