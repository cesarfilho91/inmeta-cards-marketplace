import { ref } from 'vue'

export function useFormValidation() {
    const error = ref<string | null>(null)

    function reset() {
        error.value = null
    }

    function required(value: string, message: string): boolean {
        if (!value.trim()) {
            error.value = message
            return false
        }
        return true
    }

    function email(value: string): boolean {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

        if (!regex.test(value)) {
            error.value = 'Digite um email válido'
            return false
        }

        return true
    }

    function minLength(value: string, length: number): boolean {
        if (value.length < length) {
            error.value = `Deve ter no mínimo ${length} caracteres`
            return false
        }

        return true
    }

    function match(value: string, compare: string, message: string): boolean {
        if (value !== compare) {
            error.value = message
            return false
        }

        return true
    }

    return {
        error,
        reset,
        required,
        email,
        minLength,
        match
    }
}