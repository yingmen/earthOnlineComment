<template>
  <div class="theme-switcher">
    <button class="switcher-toggle" @click="open = !open">
      <span class="toggle-icon">{{ currentIcon }}</span>
    </button>
    <transition name="panel">
      <div v-if="open" class="switcher-panel">
        <div class="panel-title">切换主题</div>
        <div class="theme-list">
          <button
            v-for="t in themes"
            :key="t.id"
            :class="['theme-option', { active: currentTheme === t.id }]"
            @click="selectTheme(t.id)"
          >
            <span class="theme-swatch" :class="'swatch-' + t.id"></span>
            <span class="theme-label">{{ t.icon }} {{ t.label }}</span>
          </button>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useTheme, themes } from '../composables/useTheme.js'

const { currentTheme, setTheme } = useTheme()
const open = ref(false)

const currentIcon = computed(() => {
  return themes.find(t => t.id === currentTheme.value)?.icon || '🌙'
})

function selectTheme(id) {
  setTheme(id)
  open.value = false
}
</script>

<style scoped>
.theme-switcher {
  position: fixed;
  bottom: 28px;
  right: 28px;
  z-index: 900;
}

.switcher-toggle {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  border: 1px solid var(--surface-border);
  background: var(--surface-bg);
  backdrop-filter: blur(12px);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s;
  box-shadow: 0 4px 16px var(--card-shadow);
}

.switcher-toggle:hover {
  transform: scale(1.1);
  border-color: var(--accent-primary);
}

.toggle-icon {
  font-size: 1.4rem;
}

.switcher-panel {
  position: absolute;
  bottom: 58px;
  right: 0;
  background: var(--surface-bg);
  backdrop-filter: blur(16px);
  border: 1px solid var(--surface-border);
  border-radius: 14px;
  padding: 14px;
  min-width: 160px;
  box-shadow: 0 8px 32px var(--card-shadow);
}

.panel-title {
  font-size: 0.75rem;
  color: var(--text-muted);
  margin-bottom: 10px;
  letter-spacing: 1px;
  text-transform: uppercase;
}

.theme-list {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.theme-option {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 12px;
  border-radius: 10px;
  border: 1px solid transparent;
  background: transparent;
  color: var(--text-secondary);
  cursor: pointer;
  transition: all 0.2s;
  font-size: 0.85rem;
}

.theme-option:hover {
  background: var(--surface-hover);
  border-color: var(--surface-border);
}

.theme-option.active {
  background: var(--nav-active-bg);
  border-color: var(--nav-active-border);
  color: var(--text-primary);
  font-weight: 600;
}

.theme-swatch {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  flex-shrink: 0;
  border: 2px solid rgba(255,255,255,0.15);
}

.swatch-night { background: linear-gradient(135deg, #0f0c29, #302b63); }
.swatch-dawn { background: linear-gradient(135deg, #fef5e7, #f8d5b0); }
.swatch-forest { background: linear-gradient(135deg, #0a1f0a, #1a3a1a); }
.swatch-sakura { background: linear-gradient(135deg, #2d1b2e, #e91e8f); }

.panel-enter-active,
.panel-leave-active {
  transition: all 0.25s ease;
}
.panel-enter-from,
.panel-leave-to {
  opacity: 0;
  transform: translateY(10px) scale(0.95);
}
</style>
