import { ref, watch } from 'vue'

export function useLocalStorage(key, defaultValue) {
  let stored
  try {
    const raw = localStorage.getItem(key)
    stored = raw ? JSON.parse(raw) : null
  } catch {
    stored = null
  }

  const data = ref(stored !== null ? stored : defaultValue)

  let timer = null
  watch(
    data,
    (val) => {
      clearTimeout(timer)
      timer = setTimeout(() => {
        try {
          localStorage.setItem(key, JSON.stringify(val))
        } catch { /* quota exceeded or private browsing */ }
      }, 300)
    },
    { deep: true }
  )

  return data
}
