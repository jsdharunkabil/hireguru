import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface ThemeState {
  isDark: boolean
  toggle: () => void
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      isDark: false, // ← changed from true to false
      toggle: () => {
        const next = !get().isDark
        set({ isDark: next })
        document.documentElement.setAttribute('data-theme', next ? 'dark' : 'light')
        document.body.style.background = next ? 'var(--bg)' : '#f4f4f8'
      },
    }),
    { name: 'hireguru-theme' }
  )
)