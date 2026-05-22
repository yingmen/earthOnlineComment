<template>
  <div class="template-wrapper">
    <div class="form-section">
      <div class="form-group">
        <label>自定义头像</label>
        <AvatarUploader v-model="avatarImage" />
      </div>

      <div class="form-group">
        <label>玩家昵称</label>
        <input v-model="playerName" type="text" class="text-input" placeholder="你的游戏ID" />
      </div>

      <div class="form-group">
        <label>等级</label>
        <input v-model="level" type="text" class="text-input" placeholder="如：Lv.25" />
      </div>

      <div class="form-group">
        <label class="slider-label">
          <span class="slider-label-text">HP 生命值</span>
          <div class="stepper">
            <button class="stepper-btn" @click="adjustHp(-1)" :disabled="hp <= 0">−</button>
            <input type="number" v-model.number="hp" min="0" max="100" class="number-input" />
            <button class="stepper-btn" @click="adjustHp(1)" :disabled="hp >= 100">+</button>
          </div>
          <span class="slider-value" :style="{ color: hp > 50 ? '#4caf50' : hp > 25 ? '#ff9800' : '#f44336' }">{{ hp }}/100</span>
        </label>
      </div>

      <div class="form-group">
        <label class="slider-label">
          <span class="slider-label-text">心情值</span>
          <div class="stepper">
            <button class="stepper-btn" @click="adjustMood(-1)" :disabled="mood <= 0">−</button>
            <input type="number" v-model.number="mood" min="0" max="100" class="number-input" />
            <button class="stepper-btn" @click="adjustMood(1)" :disabled="mood >= 100">+</button>
          </div>
          <span class="slider-value" :style="{ color: mood > 50 ? '#4caf50' : mood > 25 ? '#ff9800' : '#f44336' }">{{ mood }}/100</span>
        </label>
      </div>

      <div class="form-group">
        <label>金币余额</label>
        <input v-model="gold" type="text" class="text-input" placeholder="如：🪙 1,234" />
      </div>

      <div class="form-group">
        <label>今日任务清单</label>
        <div class="task-list-editor">
          <div v-for="(task, idx) in tasks" :key="idx" class="task-row">
            <input type="checkbox" v-model="task.done" class="task-checkbox" />
            <input v-model="task.text" type="text" class="text-input task-input" :placeholder="`任务 ${idx + 1}`" />
            <button class="btn-icon" @click="removeTask(idx)" :disabled="tasks.length <= 1">✕</button>
          </div>
          <button class="add-task-btn" @click="addTask">+ 添加任务</button>
        </div>
      </div>

      <div class="form-group">
        <label>上传场景图</label>
        <ImageUploader v-model="uploadedImage" />
      </div>

      <div class="form-group">
        <label>日志附言</label>
        <textarea v-model="logNote" class="text-area" rows="3" placeholder="今天的冒险小结..." maxlength="200"></textarea>
        <span class="char-count">{{ logNote.length }}/200</span>
      </div>
    </div>

    <div class="preview-section">
      <h3 class="preview-title">预览</h3>
      <div class="card-wrapper" ref="cardRef">
        <div class="log-card">
          <div class="log-header">
            <div class="log-avatar" v-if="avatarImage">
              <img :src="avatarImage" class="log-avatar-img" />
            </div>
            <div class="log-avatar" v-else>{{ (playerName || '玩家')[0] }}</div>
            <div class="log-player-info">
              <span class="log-player-name">{{ playerName || '冒险者' }}</span>
              <span class="log-level">{{ level || 'Lv.1' }}</span>
            </div>
            <div class="log-date">{{ today }}</div>
          </div>

          <div class="log-body">
            <div class="status-panel">
              <div class="status-row">
                <span class="status-icon">❤️</span>
                <div class="bar-wrapper">
                  <div class="bar-bg">
                    <div class="bar-fill hp-fill" :style="{ width: hp + '%' }"></div>
                  </div>
                </div>
                <span class="status-num">{{ hp }}/100</span>
              </div>
              <div class="status-row">
                <span class="status-icon">😊</span>
                <div class="bar-wrapper">
                  <div class="bar-bg">
                    <div class="bar-fill mood-fill" :style="{ width: mood + '%' }"></div>
                  </div>
                </div>
                <span class="status-num">{{ mood }}/100</span>
              </div>
              <div class="gold-row">
                <span class="status-icon">🪙</span>
                <span class="gold-value">{{ gold || '0' }}</span>
              </div>
            </div>

            <div class="task-panel">
              <div class="task-panel-header">
                <span>📋 今日任务</span>
                <span class="task-progress">{{ doneCount }}/{{ tasks.length }}</span>
              </div>
              <div v-for="(task, idx) in tasks" :key="idx" :class="['task-item', { done: task.done }]">
                <span class="task-check">{{ task.done ? '✅' : '⬜' }}</span>
                <span class="task-text">{{ task.text || `任务 ${idx + 1}` }}</span>
              </div>
            </div>

            <p class="log-note" v-if="logNote">{{ logNote }}</p>

            <div class="log-image" v-if="uploadedImage">
              <img :src="uploadedImage" />
            </div>
          </div>

          <div class="log-footer">
            <span>🎮 地球Online · 玩家日志</span>
            <span>#地球Online</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import ImageUploader from './ImageUploader.vue'
import AvatarUploader from './AvatarUploader.vue'

const playerName = ref('')
const level = ref('Lv.25')
const hp = ref(72)
const mood = ref(45)
const gold = ref('🪙 1,234')
const tasks = ref([
  { text: '早高峰地铁副本', done: true },
  { text: '工作会议BOSS战', done: true },
  { text: '月末绩效评估', done: false },
  { text: '超市补给采购', done: false },
])
const uploadedImage = ref(null)
const logNote = ref('')
const cardRef = ref(null)
const avatarImage = ref(null)

const today = computed(() => {
  const d = new Date()
  return `${d.getFullYear()}.${String(d.getMonth()+1).padStart(2,'0')}.${String(d.getDate()).padStart(2,'0')}`
})

const doneCount = computed(() => tasks.value.filter(t => t.done).length)

function addTask() {
  tasks.value.push({ text: '', done: false })
}

function removeTask(idx) {
  if (tasks.value.length > 1) tasks.value.splice(idx, 1)
}

function adjustHp(delta) {
  hp.value = Math.min(100, Math.max(0, hp.value + delta))
}

function adjustMood(delta) {
  mood.value = Math.min(100, Math.max(0, mood.value + delta))
}

defineExpose({ cardRef })
</script>

<style scoped>
.template-wrapper { display: flex; gap: 30px; }
.form-section, .preview-section { flex: 1; }
.preview-title { margin-bottom: 16px; color: var(--text-secondary); font-size: 0.9rem; text-transform: uppercase; letter-spacing: 2px; }
.form-group { margin-bottom: 20px; }
.form-group label { display: block; margin-bottom: 8px; font-size: 0.9rem; color: var(--text-secondary); font-weight: 500; }
.text-input {
  width: 100%; padding: 10px 14px; border-radius: 10px;
  border: 1px solid var(--input-border); background: var(--input-bg);
  color: var(--text-primary); font-size: 0.9rem; outline: none; transition: border-color 0.2s;
}
.text-input:focus { border-color: var(--input-focus); }
.text-area {
  width: 100%; padding: 10px 14px; border-radius: 10px;
  border: 1px solid var(--input-border); background: var(--input-bg);
  color: var(--text-primary); font-size: 0.9rem; outline: none; resize: vertical;
  font-family: inherit; transition: border-color 0.2s;
}
.text-area:focus { border-color: var(--input-focus); }
.char-count { display: block; text-align: right; font-size: 0.75rem; color: var(--char-count-color); margin-top: 4px; }

.slider-label {
  display: flex !important;
  align-items: center;
  gap: 12px;
  flex-wrap: nowrap;
}
.slider-label-text {
  font-size: 0.9rem;
  color: var(--text-secondary);
  font-weight: 500;
  white-space: nowrap;
  flex-shrink: 0;
}
.slider-label .slider-value {
  font-size: 0.85rem;
  font-weight: 700;
  min-width: 45px;
  text-align: right;
  flex-shrink: 0;
}
.stepper {
  display: flex;
  align-items: center;
  flex-shrink: 0;
}
.stepper .number-input {
  width: 48px;
  border-radius: 0;
  border-left: none;
  border-right: none;
  padding: 4px 2px;
}
.stepper-btn {
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid var(--input-border);
  background: var(--input-bg);
  color: var(--text-primary);
  font-size: 1rem;
  cursor: pointer;
  transition: border-color 0.2s, background 0.2s;
  flex-shrink: 0;
  padding: 0;
  line-height: 1;
}
.stepper-btn:first-child { border-radius: 6px 0 0 6px; }
.stepper-btn:last-child { border-radius: 0 6px 6px 0; }
.stepper-btn:hover { background: var(--card-inner-bg); }
.stepper-btn:active { background: var(--bar-bg); }
.stepper-btn:disabled { opacity: 0.35; cursor: not-allowed; }

.number-input {
  width: 56px;
  padding: 4px 6px;
  border-radius: 6px;
  border: 1px solid var(--input-border);
  background: var(--input-bg);
  color: var(--text-primary);
  font-size: 0.8rem;
  text-align: center;
  outline: none;
  transition: border-color 0.2s;
  flex-shrink: 0;
  -moz-appearance: textfield;
}
.number-input::-webkit-inner-spin-button,
.number-input::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
.number-input:focus { border-color: var(--input-focus); }

.slider {
  flex: 1;
  max-width: 220px;
  -webkit-appearance: none;
  appearance: none;
  background: transparent;
  outline: none;
  cursor: pointer;
  margin: 0;
}
.slider::-webkit-slider-runnable-track {
  height: 6px;
  border-radius: 3px;
  cursor: pointer;
}
.slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: white;
  cursor: pointer;
  border: 2px solid var(--accent-primary);
  margin-top: -5px;
}
.slider::-moz-range-track {
  height: 6px;
  border-radius: 3px;
  cursor: pointer;
}
.slider::-moz-range-thumb {
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: white;
  cursor: pointer;
  border: 2px solid var(--accent-primary);
}

.hp-slider {
  height: 24px;
}
.hp-slider::-webkit-slider-runnable-track {
  background: linear-gradient(90deg, var(--hp-from), var(--hp-to));
  margin-top: 9px;
}
.hp-slider::-moz-range-track { background: linear-gradient(90deg, var(--hp-from), var(--hp-to)); }

.mood-slider {
  height: 20px;
}
.mood-slider::-webkit-slider-runnable-track {
  background: linear-gradient(90deg, var(--mood-from), var(--star-color), var(--mood-to));
  margin-top: 7px;
}
.mood-slider::-moz-range-track { background: linear-gradient(90deg, var(--mood-from), var(--star-color), var(--mood-to)); }
.slider-value { font-size: 0.85rem; font-weight: 700; }

.task-list-editor { display: flex; flex-direction: column; gap: 8px; }
.task-row { display: flex; align-items: center; gap: 8px; }
.task-row .task-input { flex: 1; }
.task-checkbox { width: 18px; height: 18px; accent-color: var(--hp-to); }
.btn-icon { width: 28px; height: 28px; border-radius: 6px; border: 1px solid var(--input-border); background: transparent; color: var(--text-muted); cursor: pointer; font-size: 0.75rem; }
.add-task-btn { padding: 8px; border: 1px dashed var(--dashed-border); border-radius: 8px; background: transparent; color: var(--text-muted); cursor: pointer; font-size: 0.8rem; }

.card-wrapper { display: inline-block; }
.log-card {
  width: 380px;
  background: linear-gradient(160deg, var(--log-card-from), var(--log-card-to));
  border-radius: 14px;
  overflow: hidden;
  border: 1px solid var(--surface-border);
  box-shadow: 0 8px 32px var(--card-shadow);
}
.log-header {
  display: flex; align-items: center; gap: 10px;
  padding: 14px 16px;
  background: var(--card-inner-bg);
  border-bottom: 1px solid var(--card-inner-border);
}
.log-avatar {
  width: 38px; height: 38px; border-radius: 50%;
  background: linear-gradient(135deg, var(--log-avatar-from), var(--log-avatar-to));
  display: flex; align-items: center; justify-content: center;
  font-size: 1rem; font-weight: 700; color: white;
  overflow: hidden;
  flex-shrink: 0;
}
.log-avatar-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.log-player-info { display: flex; flex-direction: column; flex: 1; }
.log-player-name { font-size: 0.9rem; color: var(--text-primary); font-weight: 600; }
.log-level { font-size: 0.7rem; color: var(--text-muted); }
.log-date { font-size: 0.7rem; color: var(--text-dim); }
.log-body { padding: 16px; }
.status-panel { display: flex; flex-direction: column; gap: 8px; margin-bottom: 14px; }
.status-row { display: flex; align-items: center; gap: 8px; }
.status-icon { font-size: 0.9rem; width: 24px; }
.bar-wrapper { flex: 1; }
.bar-bg { height: 10px; background: var(--bar-bg); border-radius: 5px; overflow: hidden; }
.bar-fill { height: 100%; border-radius: 5px; transition: width 0.3s; }
.hp-fill { background: linear-gradient(90deg, var(--hp-from), var(--hp-to)); }
.mood-fill { background: linear-gradient(90deg, var(--mood-from), var(--star-color), var(--mood-to)); }
.status-num { font-size: 0.7rem; color: var(--text-muted); min-width: 35px; text-align: right; font-weight: 600; }
.gold-row { display: flex; align-items: center; gap: 8px; padding-top: 4px; }
.gold-value { font-size: 0.85rem; color: var(--gold-color); font-weight: 700; }

.task-panel {
  background: var(--card-inner-bg);
  border-radius: 10px;
  padding: 12px;
  margin-bottom: 12px;
}
.task-panel-header { display: flex; justify-content: space-between; font-size: 0.75rem; color: var(--text-muted); margin-bottom: 8px; }
.task-progress { color: var(--accent-primary); font-weight: 600; }
.task-item { display: flex; align-items: center; gap: 8px; padding: 4px 0; font-size: 0.8rem; }
.task-item.done .task-text { color: var(--text-dim); text-decoration: line-through; }
.task-check { font-size: 0.75rem; }
.task-text { color: var(--text-secondary); }
.log-note { font-size: 0.85rem; color: var(--text-secondary); line-height: 1.5; margin-bottom: 12px; }
.log-image { border-radius: 8px; overflow: hidden; }
.log-image img { width: 100%; display: block; }
.log-footer {
  display: flex; align-items: center; justify-content: space-between;
  padding: 10px 16px; font-size: 0.65rem; color: var(--footer-text);
  border-top: 1px solid var(--footer-border);
}

@media (max-width: 900px) {
  .template-wrapper { flex-direction: column; }
  .card-wrapper { width: 100%; }
  .log-card { width: 100%; }
  .slider-label { flex-wrap: wrap; gap: 8px; }
  .slider-label-text { min-width: 60px; }
}
</style>
