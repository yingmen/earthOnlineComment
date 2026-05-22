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
  </div>
</template>

<script setup>
import { ref, computed, nextTick } from 'vue'
import ReviewCard from './components/ReviewCard.vue'
import SystemNotice from './components/SystemNotice.vue'
import PlayerLog from './components/PlayerLog.vue'
import GuideTemplate from './components/GuideTemplate.vue'

const templates = [
  { id: 'review', icon: '⭐', label: '评价卡片', desc: '五星打分·热梗评价' },
  { id: 'notice', icon: '📢', label: '系统公告', desc: '热点通报·副本速报' },
  { id: 'log', icon: '📋', label: '玩家日志', desc: '日常记录·状态面板' },
  { id: 'guide', icon: '📖', label: '新手攻略', desc: '步骤攻略·奖励清单' },
]

const activeTemplate = ref('review')
const reviewRef = ref(null)
const noticeRef = ref(null)
const logRef = ref(null)
const guideRef = ref(null)
const previewUrl = ref(null)

function getActiveComponent() {
  const map = { review: reviewRef, notice: noticeRef, log: logRef, guide: guideRef }
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
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans SC', sans-serif;
  background: linear-gradient(135deg, #0f0c29, #302b63, #24243e);
  min-height: 100vh;
  color: #e0e0e0;
}

.app {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.app-header {
  text-align: center;
  padding: 24px 0 16px;
}

.header-top h1 {
  font-size: 2.8rem;
  background: linear-gradient(135deg, #00d2ff, #3a7bd5, #8e2de2);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 4px;
}

.header-subtitle {
  color: #666;
  font-size: 0.85rem;
  letter-spacing: 4px;
  text-transform: uppercase;
  margin-bottom: 20px;
}

.template-nav {
  display: flex;
  gap: 10px;
  justify-content: center;
  flex-wrap: wrap;
}

.nav-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  padding: 14px 24px;
  border-radius: 14px;
  border: 1px solid rgba(255,255,255,0.08);
  background: rgba(255,255,255,0.04);
  color: #888;
  cursor: pointer;
  transition: all 0.25s;
  min-width: 130px;
}

.nav-btn:hover {
  background: rgba(255,255,255,0.08);
  border-color: rgba(255,255,255,0.15);
  color: #ccc;
  transform: translateY(-2px);
}

.nav-btn.active {
  background: linear-gradient(135deg, rgba(58,123,213,0.2), rgba(0,210,255,0.1));
  border-color: #3a7bd5;
  color: #e0e0e0;
  box-shadow: 0 4px 20px rgba(58,123,213,0.15);
}

.nav-icon {
  font-size: 1.5rem;
}

.nav-label {
  font-size: 0.95rem;
  font-weight: 600;
}

.nav-desc {
  font-size: 0.65rem;
  color: inherit;
  opacity: 0.6;
}

.main-container {
  background: rgba(255,255,255,0.03);
  border-radius: 18px;
  padding: 28px;
  margin-top: 20px;
  border: 1px solid rgba(255,255,255,0.06);
  min-height: 400px;
}

.action-bar {
  display: flex;
  gap: 12px;
  justify-content: center;
  margin-top: 24px;
  padding-bottom: 40px;
}

.generate-btn, .preview-btn {
  padding: 14px 36px;
  border: none;
  border-radius: 12px;
  font-size: 1.05rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
}

.generate-btn {
  background: linear-gradient(135deg, #3a7bd5, #00d2ff);
  color: white;
}

.generate-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(58,123,213,0.4);
}

.preview-btn {
  background: rgba(255,255,255,0.06);
  color: #aaa;
  border: 1px solid rgba(255,255,255,0.1);
}

.preview-btn:hover {
  background: rgba(255,255,255,0.1);
  color: #e0e0e0;
}

.modal-overlay {
  position: fixed;
  top: 0; left: 0; width: 100%; height: 100%;
  background: rgba(0,0,0,0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  backdrop-filter: blur(4px);
}

.modal-content {
  position: relative;
  max-width: 90vw;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}

.modal-close {
  position: absolute;
  top: -40px;
  right: -40px;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: none;
  background: rgba(255,255,255,0.1);
  color: white;
  font-size: 1.1rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-image {
  max-width: 100%;
  max-height: 80vh;
  border-radius: 12px;
  box-shadow: 0 8px 40px rgba(0,0,0,0.5);
}

.download-link {
  padding: 10px 28px;
  border-radius: 10px;
  background: linear-gradient(135deg, #3a7bd5, #00d2ff);
  color: white;
  text-decoration: none;
  font-weight: 600;
  font-size: 0.95rem;
  transition: all 0.3s;
}

.download-link:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(58,123,213,0.4);
}

@media (max-width: 900px) {
  .header-top h1 { font-size: 2rem; }
  .nav-btn { min-width: 80px; padding: 10px 14px; }
  .nav-desc { display: none; }
  .action-bar { flex-direction: column; align-items: center; }
  .generate-btn, .preview-btn { width: 100%; max-width: 300px; }
  .modal-close { right: 0; top: -40px; }
}
</style>
