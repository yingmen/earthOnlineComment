<template>
  <div class="app">
    <header class="app-header">
      <div class="header-top">
        <h1>🌍 地球Online</h1>
        <div class="header-subtitle">内容创作工具</div>
      </div>
      <nav class="template-nav">
        <button
          v-for="tpl in templates"
          :key="tpl.id"
          :class="['nav-btn', { active: activeTemplate === tpl.id }]"
          @click="activeTemplate = tpl.id"
        >
          <span class="nav-icon">{{ tpl.icon }}</span>
          <span class="nav-label">{{ tpl.label }}</span>
          <span class="nav-desc">{{ tpl.desc }}</span>
        </button>
      </nav>
    </header>

    <div class="main-container">
      <ReviewCard v-if="activeTemplate === 'review'" ref="reviewRef" />
      <SystemNotice v-else-if="activeTemplate === 'notice'" ref="noticeRef" />
      <PlayerLog v-else-if="activeTemplate === 'log'" ref="logRef" />
      <GuideTemplate v-else-if="activeTemplate === 'guide'" ref="guideRef" />
      <AchievementBoard v-else-if="activeTemplate === 'achievement'" ref="achievementRef" />
    </div>

    <div class="action-bar">
      <button class="generate-btn" @click="generateImage">
        🎨 生成图片
      </button>
      <button class="preview-btn" @click="previewImage">
        👁️ 预览大图
      </button>
    </div>

    <div v-if="previewUrl" class="modal-overlay" @click="previewUrl = null">
        <div class="modal-content" @click.stop>
          <button class="modal-close" @click="previewUrl = null">✕</button>
          <img :src="previewUrl" class="modal-image" />
          <a :href="previewUrl" :download="getDownloadFilename()" class="download-link">📥 下载图片</a>
        </div>
      </div>
    <ThemeSwitcher />
  </div>
</template>

<script setup>
import { ref, computed, nextTick } from 'vue'
import ReviewCard from './components/ReviewCard.vue'
import SystemNotice from './components/SystemNotice.vue'
import PlayerLog from './components/PlayerLog.vue'
import GuideTemplate from './components/GuideTemplate.vue'
import AchievementBoard from './components/AchievementBoard.vue'
import ThemeSwitcher from './components/ThemeSwitcher.vue'

const templates = [
  { id: 'review', icon: '⭐', label: '评价卡片', desc: '五星打分·热梗评价' },
  { id: 'notice', icon: '📢', label: '系统公告', desc: '热点通报·副本速报' },
  { id: 'log', icon: '📋', label: '玩家日志', desc: '日常记录·状态面板' },
  { id: 'guide', icon: '📖', label: '新手攻略', desc: '步骤攻略·奖励清单' },
  { id: 'achievement', icon: '🏆', label: '成就展板', desc: '成就徽章·里程碑' },
]

const activeTemplate = ref('review')
const reviewRef = ref(null)
const noticeRef = ref(null)
const logRef = ref(null)
const guideRef = ref(null)
const achievementRef = ref(null)
const previewUrl = ref(null)

function getActiveComponent() {
  const map = { review: reviewRef, notice: noticeRef, log: logRef, guide: guideRef, achievement: achievementRef }
  return map[activeTemplate.value]
}

function formatTimestamp() {
  const d = new Date()
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  const h = String(d.getHours()).padStart(2, '0')
  const min = String(d.getMinutes()).padStart(2, '0')
  const s = String(d.getSeconds()).padStart(2, '0')
  return `${y}_${m}_${day}_${h}${min}${s}`
}

const templateLabelMap = {
  review: '评价卡片',
  notice: '系统公告',
  log: '玩家日志',
  guide: '新手攻略',
  achievement: '成就展板',
}

function getDownloadFilename() {
  const label = templateLabelMap[activeTemplate.value] || activeTemplate.value
  return `【${label}】_${formatTimestamp()}.png`
}

async function generateImage() {
  const comp = getActiveComponent()
  if (!comp?.value?.cardRef) return
  const el = comp.value.cardRef
  if (!el) return

  const html2canvas = (await import('html2canvas')).default
  const canvas = await html2canvas(el, {
    scale: 2,
    useCORS: true,
    backgroundColor: null,
    logging: false,
  })
  const link = document.createElement('a')
  link.download = getDownloadFilename()
  link.href = canvas.toDataURL('image/png')
  link.click()
}

async function previewImage() {
  const comp = getActiveComponent()
  if (!comp?.value?.cardRef) return
  const el = comp.value.cardRef
  if (!el) return

  const html2canvas = (await import('html2canvas')).default
  const canvas = await html2canvas(el, {
    scale: 2,
    useCORS: true,
    backgroundColor: null,
    logging: false,
  })
  previewUrl.value = canvas.toDataURL('image/png')
}
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: var(--font-body);
  background:
    var(--bg-glow),
    linear-gradient(160deg, var(--bg-body), var(--bg-body-mid), var(--bg-body-end));
  background-attachment: fixed;
  min-height: 100vh;
  color: var(--text-primary);
  position: relative;
}

body::before {
  content: '';
  position: fixed;
  inset: 0;
  background: var(--bg-grid);
  pointer-events: none;
  z-index: 0;
  opacity: 0.6;
}

.app {
  position: relative;
  z-index: 1;
  max-width: 1240px;
  margin: 0 auto;
  padding: 28px 24px 16px;
}

.app-header {
  text-align: center;
  padding: 16px 0 8px;
}

.header-top {
  position: relative;
  display: inline-block;
}

.header-top h1 {
  font-family: var(--font-display);
  font-size: 2.6rem;
  font-weight: 800;
  letter-spacing: 0.06em;
  background: linear-gradient(135deg, var(--title-from), var(--title-mid), var(--title-to));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 6px;
  filter: drop-shadow(var(--title-glow));
  animation: titlePulse 4s ease-in-out infinite;
}

@keyframes titlePulse {
  0%, 100% { filter: drop-shadow(var(--title-glow)); }
  50% { filter: drop-shadow(var(--title-glow)) brightness(1.15); }
}

.header-subtitle {
  font-family: var(--font-display);
  font-size: 0.72rem;
  font-weight: 500;
  letter-spacing: 0.4em;
  text-transform: uppercase;
  color: var(--text-muted);
  margin-bottom: 24px;
  position: relative;
}

.header-subtitle::before,
.header-subtitle::after {
  content: '';
  position: absolute;
  top: 50%;
  width: 40px;
  height: 1px;
  background: linear-gradient(90deg, transparent, var(--accent-primary), transparent);
}

.header-subtitle::before { right: calc(100% + 12px); }
.header-subtitle::after { left: calc(100% + 12px); }

.template-nav {
  display: flex;
  gap: 8px;
  justify-content: center;
  flex-wrap: wrap;
}

.nav-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  padding: 16px 22px;
  border-radius: 16px;
  border: 1px solid var(--surface-border);
  background: var(--surface-bg);
  color: var(--text-muted);
  cursor: pointer;
  transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1);
  min-width: 130px;
  position: relative;
  overflow: hidden;
  opacity: 0;
  animation: navEnter 0.5s ease-out forwards;
}

.nav-btn:nth-child(1) { animation-delay: 0.05s; }
.nav-btn:nth-child(2) { animation-delay: 0.1s; }
.nav-btn:nth-child(3) { animation-delay: 0.15s; }
.nav-btn:nth-child(4) { animation-delay: 0.2s; }
.nav-btn:nth-child(5) { animation-delay: 0.25s; }

@keyframes navEnter {
  from { opacity: 0; transform: translateY(16px); }
  to { opacity: 1; transform: translateY(0); }
}

.nav-btn::after {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, transparent 0%, var(--scanline-color) 100%);
  pointer-events: none;
  opacity: 0;
  transition: opacity 0.3s;
}

.nav-btn:hover { border-color: var(--accent-primary); }
.nav-btn:hover::after { opacity: 1; }
.nav-btn:hover {
  background: var(--surface-raised);
  border-color: var(--input-border);
  color: var(--text-secondary);
  transform: translateY(-3px);
  box-shadow: var(--card-shadow);
}

.nav-btn.active {
  background: var(--nav-active-bg);
  border-color: var(--nav-active-border);
  color: var(--text-primary);
  box-shadow: var(--nav-active-glow), 0 4px 20px var(--nav-active-shadow);
}

.nav-btn.active::after { opacity: 0.5; }

.nav-icon {
  font-size: 1.5rem;
  width: 40px;
  height: 40px;
  border-radius: 10px;
  background: var(--nav-icon-bg);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s;
}

.nav-btn:hover .nav-icon,
.nav-btn.active .nav-icon {
  transform: scale(1.05);
  background: var(--accent-glow);
}

.nav-label {
  font-family: var(--font-display);
  font-size: 0.82rem;
  font-weight: 600;
  letter-spacing: 0.04em;
}

.nav-desc {
  font-size: 0.6rem;
  color: inherit;
  opacity: 0.5;
  letter-spacing: 0.02em;
}

.main-container {
  position: relative;
  background: var(--surface-bg);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-radius: 20px;
  padding: 32px 28px;
  margin-top: 24px;
  border: 1px solid var(--surface-border);
  min-height: 440px;
  box-shadow: var(--card-shadow);
  overflow: hidden;
  animation: containerEnter 0.5s 0.15s ease-out both;
}

@keyframes containerEnter {
  from { opacity: 0; transform: translateY(24px) scale(0.98); }
  to { opacity: 1; transform: translateY(0) scale(1); }
}

.main-container::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 1px;
  background: linear-gradient(90deg, transparent, var(--accent-primary), transparent);
  opacity: 0.5;
}

.main-container::after {
  content: '';
  position: absolute;
  inset: 0;
  background: var(--bg-grid);
  opacity: 0.25;
  pointer-events: none;
}

.action-bar {
  display: flex;
  gap: 14px;
  justify-content: center;
  margin-top: 28px;
  padding-bottom: 48px;
}

.generate-btn, .preview-btn {
  padding: 15px 40px;
  border: none;
  border-radius: 14px;
  font-family: var(--font-display);
  font-size: 0.9rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  cursor: pointer;
  transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
}

.generate-btn {
  background: linear-gradient(135deg, var(--btn-primary-from), var(--btn-primary-to));
  color: var(--text-on-accent);
  box-shadow: 0 4px 20px var(--btn-primary-glow);
}

.generate-btn::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, transparent 0%, rgba(255,255,255,0.15) 50%, transparent 100%);
  transform: translateX(-100%);
  transition: transform 0.6s;
}

.generate-btn:hover::before { transform: translateX(100%); }
.generate-btn:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 30px var(--btn-primary-glow);
}

.generate-btn:active { transform: translateY(-1px); }

.preview-btn {
  background: var(--btn-secondary-bg);
  color: var(--btn-secondary-color);
  border: 1px solid var(--btn-secondary-border);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
}

.preview-btn:hover {
  background: var(--surface-hover);
  color: var(--text-primary);
  border-color: var(--accent-primary);
  transform: translateY(-3px);
  box-shadow: var(--card-shadow);
}

.modal-overlay {
  position: fixed;
  top: 0; left: 0; width: 100%; height: 100%;
  background: var(--overlay-bg);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  animation: fadeIn 0.25s ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.modal-content {
  position: relative;
  max-width: 90vw;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  animation: modalEnter 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
}

@keyframes modalEnter {
  from { opacity: 0; transform: scale(0.9) translateY(20px); }
  to { opacity: 1; transform: scale(1) translateY(0); }
}

.modal-close {
  position: absolute;
  top: -44px;
  right: -44px;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 1px solid rgba(255,255,255,0.15);
  background: var(--surface-glass);
  backdrop-filter: blur(12px);
  color: var(--text-primary);
  font-size: 1.2rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.25s;
}

.modal-close:hover {
  background: rgba(255,80,80,0.25);
  border-color: rgba(255,80,80,0.5);
  transform: rotate(90deg);
}

.modal-image {
  max-width: 100%;
  max-height: 80vh;
  border-radius: 16px;
  box-shadow: var(--card-shadow-strong);
}

.download-link {
  padding: 12px 32px;
  border-radius: 12px;
  font-family: var(--font-display);
  background: linear-gradient(135deg, var(--btn-primary-from), var(--btn-primary-to));
  color: var(--text-on-accent);
  text-decoration: none;
  font-weight: 700;
  font-size: 0.9rem;
  letter-spacing: 0.06em;
  transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 20px var(--btn-primary-glow);
}

.download-link:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 30px var(--btn-primary-glow);
}

@media (max-width: 900px) {
  .header-top h1 { font-size: 1.9rem; }
  .header-subtitle::before,
  .header-subtitle::after { width: 20px; }
  .nav-btn { min-width: 80px; padding: 12px 14px; }
  .nav-desc { display: none; }
  .nav-icon { width: 34px; height: 34px; font-size: 1.2rem; }
  .nav-label { font-size: 0.7rem; }
  .main-container { margin-top: 16px; padding: 20px 16px; }
  .action-bar { flex-direction: column; align-items: center; }
  .generate-btn, .preview-btn { width: 100%; max-width: 320px; }
  .modal-close { right: 0; top: -44px; }
}
</style>
