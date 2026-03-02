import { onUnmounted } from 'vue'

let lockCount = 0

export function useScrollLock() {
    const lock = () => {
        const container = document.getElementById('dashboard-scroll-container')

        if (lockCount === 0) {
            if (container) {
                container.style.overflow = 'hidden'
            } else {
                document.body.style.overflow = 'hidden'
            }
        }

        lockCount++
    }

    const unlock = () => {
        lockCount--

        if (lockCount <= 0) {
            const container = document.getElementById('dashboard-scroll-container')

            if (container) {
                container.style.overflow = ''
            } else {
                document.body.style.overflow = ''
            }

            lockCount = 0
        }
    }

    onUnmounted(() => {
        lockCount = 0
        const container = document.getElementById('dashboard-scroll-container')

        if (container) {
            container.style.overflow = ''
        } else {
            document.body.style.overflow = ''
        }
    })

    return { lock, unlock }
}