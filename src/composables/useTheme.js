import { ref, watch } from 'vue'

export const themes = [
  { id: 'night', icon: '🌙', label: '暗夜' },
  { id: 'dawn', icon: '☀️', label: '晨曦' },
  { id: 'forest', icon: '🌿', label: '森林' },
  { id: 'sakura', icon: '🌸', label: '樱落' },
]

let stored = 'night'
try {
  const raw = localStorage.getItem('eo_theme')
  if (raw && themes.some(t => t.id === raw)) stored = raw
} catch {}

const currentTheme = ref(stored)

watch(currentTheme, (val) => {
  document.body.dataset.theme = val
  try { localStorage.setItem('eo_theme', val) } catch {}
}, { immediate: true })

export function useTheme() {
  function setTheme(id) {
    currentTheme.value = id
  }

  return { currentTheme, setTheme, themes }
}
