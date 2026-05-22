<template>
  <div class="template-wrapper">
    <div class="form-section">
      <div class="form-group">
        <label>玩家昵称</label>
        <input v-model="playerName" type="text" class="text-input" placeholder="你的游戏ID" />
      </div>

      <div class="form-group">
        <label>成就等级</label>
        <div class="star-rating">
          <span v-for="s in 5" :key="s" :class="['star', { filled: s <= level }]" @click="level = s">★</span>
          <span class="rating-text">{{ levelText }}</span>
        </div>
      </div>

      <div class="form-group">
        <label>我的成就 ({{ achievements.length }})</label>
        <div class="achievement-editor">
          <div v-for="(ach, idx) in achievements" :key="idx" class="ach-edit-card" :class="'rarity-' + ach.rarity">
            <div class="ach-edit-header">
              <div class="ach-icon-picker">
                <select v-model="ach.icon" class="icon-select">
                  <option v-for="icon in iconOptions" :key="icon" :value="icon">{{ icon }}</option>
                </select>
                <span class="ach-icon-preview">{{ ach.icon }}</span>
              </div>
              <select v-model="ach.rarity" class="rarity-select">
                <option value="common">普通</option>
                <option value="rare">稀有</option>
                <option value="epic">史诗</option>
                <option value="legendary">传说</option>
              </select>
              <button class="btn-icon" @click="removeAchievement(idx)">✕</button>
            </div>
            <input v-model="ach.name" type="text" class="text-input-sm" placeholder="成就名称" />
            <input v-model="ach.desc" type="text" class="text-input-sm" placeholder="成就描述" />
            <input v-model="ach.date" type="text" class="text-input-sm" placeholder="解锁日期，如：2025.03.15 解锁" />
          </div>
          <button class="add-ach-btn" @click="addAchievement">+ 添加成就</button>
        </div>
      </div>

      <div class="form-group">
        <label>预设成就库（点击添加）</label>
        <div class="preset-grid">
          <div
            v-for="preset in presetAchievements"
            :key="preset.name"
            class="preset-item"
            @click="addPreset(preset)"
          >
            <span class="preset-icon">{{ preset.icon }}</span>
            <div class="preset-info">
              <span class="preset-name">{{ preset.name }}</span>
              <span class="preset-desc">{{ preset.desc }}</span>
            </div>
            <span class="preset-rarity" :class="'rarity-tag-' + preset.rarity">{{ rarityLabel[preset.rarity] }}</span>
          </div>
        </div>
      </div>
    </div>

    <div class="preview-section">
      <h3 class="preview-title">预览</h3>
      <div class="card-wrapper" ref="cardRef">
        <div class="achievement-card">
          <div class="ach-card-header">
            <div class="ach-avatar">{{ (playerName || '玩家')[0] }}</div>
            <div class="ach-player-info">
              <span class="ach-player-name">{{ playerName || '冒险者' }}</span>
              <div class="ach-stars">
                <span v-for="s in 5" :key="s" :class="['star-sm', { filled: s <= level }]">★</span>
              </div>
            </div>
            <div class="ach-badge">{{ levelText }}</div>
          </div>

          <div class="ach-stats-bar">
            <div class="stats-text">
              <span>📊 成就统计</span>
              <span class="stats-count">已解锁 {{ achievements.length }} 项</span>
            </div>
            <div class="stats-progress">
              <div class="progress-bg">
                <div class="progress-fill" :style="{ width: progressPercent + '%' }"></div>
              </div>
              <span class="progress-num">{{ progressPercent }}%</span>
            </div>
          </div>

          <div class="ach-list">
            <div v-for="(ach, idx) in achievements" :key="idx" class="ach-item" :class="'ach-rarity-' + ach.rarity">
              <div class="ach-item-icon">{{ ach.icon }}</div>
              <div class="ach-item-body">
                <div class="ach-item-name">{{ ach.name || '未命名成就' }}</div>
                <div class="ach-item-desc">{{ ach.desc || '成就描述' }}</div>
                <div class="ach-item-meta">
                  <span class="ach-item-rarity" :class="'rarity-label-' + ach.rarity">{{ rarityLabel[ach.rarity] }}</span>
                  <span class="ach-item-date" v-if="ach.date">{{ ach.date }}</span>
                </div>
              </div>
            </div>
          </div>

          <div class="ach-card-footer">
            <span>🎮 地球Online · 成就展板</span>
            <span>#地球Online</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useLocalStorage } from '../composables/useLocalStorage.js'

const iconOptions = [
  '🏆', '🎖️', '🥇', '⭐', '💎', '🔥', '👑', '🎯',
  '🚀', '🌈', '🛡️', '⚔️', '🗝️', '🎓', '💼', '💰',
  '✈️', '🏠', '👶', '🏃', '📚', '🎮', '🎨', '🎵',
  '🍳', '🌍', '💪', '🧠', '❤️', '🤝', '🦸', '🔮'
]

const rarityLabel = { common: '普通', rare: '稀有', epic: '史诗', legendary: '传说' }

const presetAchievements = [
  { icon: '🔓', name: '新手教程毕业', desc: '成功活过18岁', rarity: 'common', date: '' },
  { icon: '💼', name: '副本达人', desc: '完成100次面试副本', rarity: 'rare', date: '' },
  { icon: '🎓', name: '知识就是力量', desc: '获得学士/硕士/博士学位', rarity: 'epic', date: '' },
  { icon: '💰', name: '氪金玩家', desc: '累计收入突破10万金币', rarity: 'rare', date: '' },
  { icon: '✈️', name: '地图探索者', desc: '踏足10个以上城市', rarity: 'rare', date: '' },
  { icon: '🏠', name: '领地建造', desc: '购买属于自己的房产', rarity: 'epic', date: '' },
  { icon: '👶', name: '师徒系统', desc: '拥有后代NPC', rarity: 'legendary', date: '' },
  { icon: '🏃', name: '耐力训练', desc: '累计跑步1000公里', rarity: 'rare', date: '' },
  { icon: '📚', name: '阅读者', desc: '阅读100本书籍', rarity: 'epic', date: '' },
  { icon: '🎮', name: '全服排名', desc: '在某领域达到前1%', rarity: 'legendary', date: '' },
  { icon: '💪', name: '健身达人', desc: '连续健身365天', rarity: 'epic', date: '' },
  { icon: '🤝', name: '社交大师', desc: '结交100位好友', rarity: 'rare', date: '' },
]

const persisted = useLocalStorage('eo_achievement_data', {
  playerName: '',
  level: 1,
  achievements: [
    { icon: '🎓', name: '知识就是力量', desc: '获得学士学位', rarity: 'epic', date: '2021.06 解锁' },
    { icon: '💼', name: '副本达人', desc: '完成100次面试副本', rarity: 'rare', date: '2024.03 解锁' },
  ]
})

const playerName = ref(persisted.value.playerName)
const level = ref(persisted.value.level)
const achievements = ref(persisted.value.achievements.map(a => ({ ...a })))

import { watch } from 'vue'
watch([playerName, level, achievements], () => {
  persisted.value = {
    playerName: playerName.value,
    level: level.value,
    achievements: JSON.parse(JSON.stringify(achievements.value))
  }
}, { deep: true })

const levelText = computed(() => {
  const texts = ['', '新手玩家', '进阶玩家', '高手玩家', '大师玩家', '传说玩家']
  return texts[level.value]
})

const progressPercent = computed(() => {
  const total = Math.max(achievements.value.length, 10)
  return Math.min(Math.round((achievements.value.length / total) * 100), 100)
})

const cardRef = ref(null)

function addAchievement() {
  achievements.value.push({
    icon: '🏆',
    name: '',
    desc: '',
    date: '',
    rarity: 'common'
  })
}

function removeAchievement(idx) {
  achievements.value.splice(idx, 1)
}

function addPreset(preset) {
  achievements.value.push({ ...preset })
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

.star-rating { display: flex; align-items: center; gap: 4px; }
.star { font-size: 2rem; cursor: pointer; color: var(--review-star-empty); transition: all 0.15s; }
.star.filled { color: var(--star-color); text-shadow: 0 0 10px rgba(255,193,7,0.4); }
.star:hover { transform: scale(1.2); }
.rating-text { margin-left: 12px; font-size: 0.95rem; color: var(--star-color); font-weight: 600; }

.achievement-editor { display: flex; flex-direction: column; gap: 10px; }
.ach-edit-card {
  padding: 12px; border-radius: 10px;
  background: var(--card-inner-bg);
  border: 1px solid var(--surface-border);
  display: flex; flex-direction: column; gap: 8px;
}
.ach-edit-card.rarity-rare { border-left: 3px solid #2196f3; }
.ach-edit-card.rarity-epic { border-left: 3px solid #9c27b0; }
.ach-edit-card.rarity-legendary { border-left: 3px solid #ffc107; }
.ach-edit-card.rarity-common { border-left: 3px solid var(--icon-btn-color); }

.ach-edit-header { display: flex; align-items: center; gap: 8px; }

.ach-icon-picker { display: flex; align-items: center; gap: 6px; }
.icon-select { width: 48px; padding: 4px; border-radius: 6px; border: 1px solid var(--input-border); background: var(--input-bg); color: var(--text-primary); font-size: 0.75rem; }
.ach-icon-preview { font-size: 1.3rem; }

.rarity-select {
  flex: 1; padding: 6px 10px; border-radius: 8px;
  border: 1px solid var(--input-border);
  background: var(--input-bg);
  color: var(--text-primary); font-size: 0.8rem; outline: none;
}

.text-input-sm {
  width: 100%; padding: 8px 12px; border-radius: 8px;
  border: 1px solid var(--input-border); background: var(--input-bg);
  color: var(--text-primary); font-size: 0.8rem; outline: none; transition: border-color 0.2s;
}
.text-input-sm:focus { border-color: var(--input-focus); }
.text-input-sm::placeholder { color: var(--input-placeholder); }

.btn-icon { width: 28px; height: 28px; border-radius: 6px; border: 1px solid var(--icon-btn-border); background: transparent; color: var(--icon-btn-color); cursor: pointer; font-size: 0.75rem; flex-shrink: 0; }
.btn-icon:hover { color: #f44336; border-color: var(--difficulty-glow); }

.add-ach-btn { padding: 10px; border: 1px dashed var(--dashed-border); border-radius: 10px; background: transparent; color: var(--text-muted); cursor: pointer; font-size: 0.85rem; transition: all 0.2s; }
.add-ach-btn:hover { border-color: var(--accent-primary); color: var(--accent-secondary); }

.preset-grid { display: flex; flex-direction: column; gap: 6px; max-height: 260px; overflow-y: auto; }
.preset-grid::-webkit-scrollbar { width: 4px; }
.preset-grid::-webkit-scrollbar-thumb { background: var(--input-border); border-radius: 2px; }
.preset-item {
  display: flex; align-items: center; gap: 10px;
  padding: 8px 12px; border-radius: 8px;
  background: var(--card-inner-bg);
  border: 1px solid var(--card-inner-border);
  cursor: pointer; transition: all 0.2s;
}
.preset-item:hover { background: var(--tag-bg); border-color: var(--tag-border); }
.preset-icon { font-size: 1.3rem; flex-shrink: 0; }
.preset-info { flex: 1; display: flex; flex-direction: column; }
.preset-name { font-size: 0.8rem; color: var(--text-secondary); font-weight: 500; }
.preset-desc { font-size: 0.7rem; color: var(--text-muted); }
.preset-rarity { font-size: 0.65rem; padding: 2px 8px; border-radius: 10px; font-weight: 600; }
.rarity-tag-common { background: var(--rarity-common-bg); color: var(--text-muted); }
.rarity-tag-rare { background: var(--rarity-rare-bg); color: var(--rarity-rare); }
.rarity-tag-epic { background: var(--rarity-epic-bg); color: var(--rarity-epic); }
.rarity-tag-legendary { background: var(--rarity-legendary-bg); color: var(--rarity-legendary); }

.card-wrapper { display: inline-block; }
.achievement-card {
  width: 400px;
  background: linear-gradient(160deg, var(--ach-card-from), var(--ach-card-to));
  border-radius: 14px;
  overflow: hidden;
  border: 1px solid var(--surface-border);
  box-shadow: 0 8px 32px var(--card-shadow);
}

.ach-card-header {
  display: flex; align-items: center; gap: 10px;
  padding: 14px 16px;
  background: var(--card-inner-bg);
  border-bottom: 1px solid var(--card-inner-border);
}
.ach-avatar {
  width: 40px; height: 40px; border-radius: 50%;
  background: linear-gradient(135deg, var(--ach-avatar-from), var(--ach-avatar-to));
  display: flex; align-items: center; justify-content: center;
  font-size: 1.1rem; font-weight: 700; color: white;
}
.ach-player-info { display: flex; flex-direction: column; flex: 1; }
.ach-player-name { font-size: 0.95rem; color: var(--text-primary); font-weight: 600; }
.ach-stars { display: flex; gap: 2px; margin-top: 2px; }
.star-sm { font-size: 0.75rem; color: var(--review-star-empty); }
.star-sm.filled { color: var(--star-color); }
.ach-badge {
  padding: 4px 12px; border-radius: 12px;
  background: linear-gradient(135deg, var(--ach-badge-from), var(--ach-badge-to));
  color: var(--gold-color); font-size: 0.7rem; font-weight: 700;
  border: 1px solid var(--ach-badge-border);
}

.ach-stats-bar {
  padding: 12px 16px;
  border-bottom: 1px solid var(--footer-border);
}
.stats-text { display: flex; justify-content: space-between; font-size: 0.75rem; color: var(--text-muted); margin-bottom: 6px; }
.stats-count { color: var(--tag-color); }
.stats-progress { display: flex; align-items: center; gap: 10px; }
.progress-bg { flex: 1; height: 8px; background: var(--bar-bg); border-radius: 4px; overflow: hidden; }
.progress-fill { height: 100%; border-radius: 4px; background: linear-gradient(90deg, var(--progress-from), var(--progress-to)); transition: width 0.3s; }
.progress-num { font-size: 0.7rem; color: var(--accent-secondary); font-weight: 600; }

.ach-list { padding: 12px 16px; display: flex; flex-direction: column; gap: 8px; }

.ach-item {
  display: flex; align-items: center; gap: 10px;
  padding: 10px 12px; border-radius: 10px;
  background: var(--card-inner-bg);
  border: 1px solid var(--card-inner-border);
}
.ach-item.ach-rarity-rare { border-color: var(--rarity-rare-border); background: rgba(33,150,243,0.06); }
.ach-item.ach-rarity-epic { border-color: var(--rarity-epic-border); background: rgba(156,39,176,0.06); }
.ach-item.ach-rarity-legendary { border-color: var(--rarity-legendary-border); background: rgba(255,193,7,0.06); }

.ach-item-icon { font-size: 1.6rem; flex-shrink: 0; width: 38px; text-align: center; }
.ach-item-body { flex: 1; display: flex; flex-direction: column; gap: 2px; }
.ach-item-name { font-size: 0.85rem; color: var(--text-primary); font-weight: 600; }
.ach-item-desc { font-size: 0.72rem; color: var(--text-muted); }
.ach-item-meta { display: flex; align-items: center; gap: 8px; margin-top: 2px; }
.ach-item-rarity { font-size: 0.6rem; padding: 1px 8px; border-radius: 8px; font-weight: 600; }
.rarity-label-common { background: var(--rarity-common-bg); color: var(--text-muted); }
.rarity-label-rare { background: var(--rarity-rare-bg); color: var(--rarity-rare); }
.rarity-label-epic { background: var(--rarity-epic-bg); color: var(--rarity-epic); }
.rarity-label-legendary { background: var(--rarity-legendary-bg); color: var(--rarity-legendary); }
.ach-item-date { font-size: 0.65rem; color: var(--text-dim); }

.ach-card-footer {
  display: flex; align-items: center; justify-content: space-between;
  padding: 10px 16px; font-size: 0.65rem; color: var(--footer-text);
  border-top: 1px solid var(--footer-border);
}

@media (max-width: 900px) {
  .template-wrapper { flex-direction: column; }
  .achievement-card { width: 100%; }
}
</style>
