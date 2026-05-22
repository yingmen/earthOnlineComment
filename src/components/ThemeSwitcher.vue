<template>
  <div class="theme-switcher">
    <button class="switcher-toggle" @click="open = !open" :aria-label="'切换主题: ' + currentIcon">
      <span class="toggle-icon" :key="currentTheme">{{ currentIcon }}</span>
    </button>
    <transition name="panel">
      <div v-if="open" class="switcher-panel">
        <div class="panel-title">
          <span class="panel-dot"></span>
          主题切换
        </div>
        <div class="theme-list">
          <button
            v-for="t in themes"
            :key="t.id"
            :class="['theme-option', { active: currentTheme === t.id }]"
            @click="selectTheme(t.id)"
          >
            <span class="theme-swatch" :class="'swatch-' + t.id"></span>
            <div class="theme-info">
              <span class="theme-icon">{{ t.icon }}</span>
              <span class="theme-label">{{ t.label }}</span>
            </div>
            <span v-if="currentTheme === t.id" class="theme-check">◆</span>
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
  bottom: 32px;
  right: 32px;
  z-index: 900;
}

.switcher-toggle {
  width: 50px;
  height: 50px;
  border-radius: 16px;
  border: 1px solid var(--surface-border);
  background: var(--surface-glass);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: var(--card-shadow);
}

.switcher-toggle:hover {
  transform: scale(1.08);
  border-color: var(--accent-primary);
  box-shadow: var(--card-shadow), 0 0 20px var(--accent-glow);
}

.switcher-toggle:active {
  transform: scale(0.95);
}

.toggle-icon {
  font-size: 1.4rem;
  transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.switcher-toggle:active .toggle-icon {
  transform: rotate(-15deg) scale(0.9);
}

.switcher-panel {
  position: absolute;
  bottom: 62px;
  right: 0;
  background: var(--surface-glass);
  backdrop-filter: blur(24px);
  -webkit-backdrop-filter: blur(24px);
  border: 1px solid var(--surface-border);
  border-radius: 18px;
  padding: 18px;
  min-width: 180px;
  box-shadow: var(--card-shadow-strong);
}

.panel-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-family: var(--font-display);
  font-size: 0.65rem;
  font-weight: 600;
  color: var(--text-muted);
  margin-bottom: 14px;
  letter-spacing: 0.15em;
  text-transform: uppercase;
}

.panel-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--accent-primary);
  box-shadow: 0 0 6px var(--accent-glow);
  animation: dotPulse 2s ease-in-out infinite;
}

@keyframes dotPulse {
  0%, 100% { opacity: 0.6; }
  50% { opacity: 1; }
}

.theme-list {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.theme-option {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 14px;
  border-radius: 12px;
  border: 1px solid transparent;
  background: transparent;
  color: var(--text-secondary);
  cursor: pointer;
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  font-size: 0.85rem;
  font-family: var(--font-body);
}

.theme-option:hover {
  background: var(--surface-raised);
  border-color: var(--surface-border);
}

.theme-option.active {
  background: var(--nav-active-bg);
  border-color: var(--nav-active-border);
  color: var(--text-primary);
  box-shadow: var(--nav-active-glow);
}

.theme-swatch {
  width: 22px;
  height: 22px;
  border-radius: 8px;
  flex-shrink: 0;
  border: 2px solid rgba(255,255,255,0.12);
  transition: all 0.25s;
}

.theme-option.active .theme-swatch {
  border-color: var(--accent-primary);
  box-shadow: 0 0 10px var(--accent-glow);
}

.swatch-night { background: linear-gradient(135deg, #06060a, #0d0b1e, #38bdf8); }
.swatch-dawn { background: linear-gradient(135deg, #1c1408, #2d1f0d, #f59e0b); }
.swatch-forest { background: linear-gradient(135deg, #040d06, #0a200a, #22c55e); }
.swatch-sakura { background: linear-gradient(135deg, #0d0410, #1a0a20, #ec4899); }

.theme-info {
  display: flex;
  align-items: center;
  gap: 6px;
  flex: 1;
}

.theme-icon {
  font-size: 0.9rem;
}

.theme-label {
  font-size: 0.8rem;
  font-weight: 500;
}

.theme-check {
  font-size: 0.5rem;
  color: var(--accent-primary);
  filter: drop-shadow(0 0 4px var(--accent-glow));
}

.panel-enter-active {
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.panel-leave-active {
  transition: all 0.2s ease-in;
}

.panel-enter-from {
  opacity: 0;
  transform: translateY(14px) scale(0.92);
}

.panel-leave-to {
  opacity: 0;
  transform: translateY(8px) scale(0.96);
}

@media (max-width: 900px) {
  .theme-switcher {
    bottom: 20px;
    right: 20px;
  }
  .switcher-toggle {
    width: 44px;
    height: 44px;
    border-radius: 14px;
  }
}
</style>
