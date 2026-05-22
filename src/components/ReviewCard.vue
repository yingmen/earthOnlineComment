<template>
  <div class="template-wrapper">
    <div class="form-section">
      <div class="form-group">
        <label>选择热梗标签</label>
        <div class="tag-manager">
          <div class="tag-input-row">
            <input v-model="newTagInput" type="text" class="tag-input" placeholder="输入自定义标签" @keyup.enter="addTag" />
            <button class="tag-add-btn" @click="addTag">添加</button>
          </div>
          <div class="tag-list">
            <span v-for="(tag, index) in hotTags" :key="tag" :class="['tag-item', { active: selectedTags.includes(tag) }]" @click="toggleTag(tag)">
              #{{ tag }}
              <span class="tag-remove" @click.stop="removeTag(index)">×</span>
            </span>
          </div>
        </div>
      </div>

      <div class="form-group">
        <label>评分</label>
        <div class="star-rating">
          <span v-for="star in 5" :key="star" :class="['star', { filled: star <= rating }]" @click="rating = star">★</span>
          <span class="rating-text">{{ ratingText }}</span>
        </div>
      </div>

      <div class="form-group">
        <label>游戏时长</label>
        <input v-model="playTime" type="text" class="text-input" placeholder="例：已游玩 9125 天" />
      </div>

      <div class="form-group">
        <label>评价内容</label>
        <textarea v-model="reviewText" class="text-area" rows="4" placeholder="写下你对地球Online的评价..." maxlength="200"></textarea>
        <span class="char-count">{{ reviewText.length }}/200</span>
      </div>

      <div class="form-group">
        <label>上传插图</label>
        <ImageUploader v-model="uploadedImage" />
      </div>

      <div class="form-group">
        <label>昵称</label>
        <input v-model="nickname" type="text" class="text-input" placeholder="输入你的昵称" />
      </div>
    </div>

    <div class="preview-section">
      <h3 class="preview-title">预览</h3>
      <div class="card-wrapper" ref="cardRef">
        <div class="review-card">
          <div class="card-header">
            <div class="game-icon">🌍</div>
            <div class="game-info">
              <h2>地球Online</h2>
              <div class="card-stars">
                <span v-for="star in 5" :key="star" :class="['star-sm', { filled: star <= rating }]">★</span>
              </div>
            </div>
            <div class="card-tags" v-if="selectedTags.length">
              <span class="card-tag" v-for="tag in selectedTags" :key="tag">#{{ tag }}</span>
            </div>
          </div>

          <div class="card-body">
            <p class="review-content">{{ reviewText || '这位玩家还没有写下评价...' }}</p>
            <div class="card-image" v-if="uploadedImage">
              <img :src="uploadedImage" />
            </div>
          </div>

          <div class="card-footer">
            <div class="player-info">
              <div class="avatar">{{ (nickname || '匿名')[0] }}</div>
              <div class="player-detail">
                <span class="player-name">{{ nickname || '匿名玩家' }}</span>
                <span class="play-time">{{ playTime || '已游玩 9125 天' }}</span>
              </div>
            </div>
            <!-- <div class="platform-badge">
              <span>🎮 硬核模式</span>
            </div> -->
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import ImageUploader from './ImageUploader.vue'

const hotTags = ref([
  '强制登录', '不能存档', '零氪生存', '随机出生点', '无新手教程',
  '物理引擎拉满', 'NPC太真实', '剧情太长', '不能退出', '全服PVP',
  '画风写实', '社交系统复杂', '昼夜循环', '天气系统', '赛季更新'
])

const newTagInput = ref('')
const selectedTags = ref(['强制登录'])
const rating = ref(3)
const reviewText = ref('')
const playTime = ref('已游玩 9125 天')
const nickname = ref('')
const uploadedImage = ref(null)
const cardRef = ref(null)

function toggleTag(tag) {
  const index = selectedTags.value.indexOf(tag)
  if (index === -1) {
    selectedTags.value.push(tag)
  } else {
    selectedTags.value.splice(index, 1)
  }
}

function addTag() {
  const tag = newTagInput.value.trim()
  if (tag && !hotTags.value.includes(tag)) {
    hotTags.value.push(tag)
    selectedTags.value.push(tag)
    newTagInput.value = ''
  }
}

function removeTag(index) {
  const removed = hotTags.value[index]
  hotTags.value.splice(index, 1)
  const idx = selectedTags.value.indexOf(removed)
  if (idx !== -1) {
    selectedTags.value.splice(idx, 1)
  }
}

const ratingText = computed(() => {
  const texts = ['', '差评', '一般', '还行', '好评', '神作']
  return texts[rating.value]
})

defineExpose({ cardRef })
</script>

<style scoped>
.template-wrapper {
  display: flex;
  gap: 30px;
}
.form-section { flex: 1; }
.preview-section { flex: 1; }
.preview-title {
  margin-bottom: 16px;
  color: #aaa;
  font-size: 0.9rem;
  text-transform: uppercase;
  letter-spacing: 2px;
}
.form-group { margin-bottom: 20px; }
.form-group label {
  display: block;
  margin-bottom: 8px;
  font-size: 0.9rem;
  color: #aaa;
  font-weight: 500;
}
.tag-manager {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.tag-input-row {
  display: flex;
  gap: 8px;
}
.tag-input {
  flex: 1;
  padding: 8px 12px;
  border-radius: 8px;
  border: 1px solid rgba(255,255,255,0.1);
  background: rgba(255,255,255,0.05);
  color: #e0e0e0;
  font-size: 0.85rem;
  outline: none;
  transition: border-color 0.2s;
}
.tag-input:focus { border-color: #3a7bd5; }
.tag-input::placeholder { color: #666; }
.tag-add-btn {
  padding: 8px 16px;
  border-radius: 8px;
  border: none;
  background: linear-gradient(135deg, #3a7bd5, #00d2ff);
  color: white;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  white-space: nowrap;
  transition: opacity 0.2s;
}
.tag-add-btn:hover { opacity: 0.85; }
.tag-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
.tag-item {
  padding: 6px 14px;
  border-radius: 20px;
  font-size: 0.8rem;
  cursor: pointer;
  background: rgba(255,255,255,0.06);
  border: 1px solid rgba(255,255,255,0.1);
  transition: all 0.2s;
  user-select: none;
  display: inline-flex;
  align-items: center;
  gap: 6px;
}
.tag-item:hover { background: rgba(58,123,213,0.2); border-color: rgba(58,123,213,0.4); }
.tag-item.active {
  background: linear-gradient(135deg, #3a7bd5, #00d2ff);
  border-color: transparent;
  color: white;
  font-weight: 600;
}
.tag-remove {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  font-size: 0.75rem;
  line-height: 1;
  color: rgba(255,255,255,0.4);
  transition: all 0.2s;
}
.tag-remove:hover {
  background: rgba(255,80,80,0.6);
  color: white;
}
.star-rating { display: flex; align-items: center; gap: 4px; }
.star {
  font-size: 2rem;
  cursor: pointer;
  color: #333;
  transition: all 0.15s;
}
.star.filled { color: #ffc107; text-shadow: 0 0 10px rgba(255,193,7,0.4); }
.star:hover { transform: scale(1.2); }
.rating-text { margin-left: 12px; font-size: 0.95rem; color: #ffc107; font-weight: 600; }
.text-input {
  width: 100%;
  padding: 10px 14px;
  border-radius: 10px;
  border: 1px solid rgba(255,255,255,0.1);
  background: rgba(255,255,255,0.05);
  color: #e0e0e0;
  font-size: 0.9rem;
  outline: none;
  transition: border-color 0.2s;
}
.text-input:focus { border-color: #3a7bd5; }
.text-area {
  width: 100%;
  padding: 10px 14px;
  border-radius: 10px;
  border: 1px solid rgba(255,255,255,0.1);
  background: rgba(255,255,255,0.05);
  color: #e0e0e0;
  font-size: 0.9rem;
  outline: none;
  resize: vertical;
  font-family: inherit;
  transition: border-color 0.2s;
}
.text-area:focus { border-color: #3a7bd5; }
.char-count {
  display: block;
  text-align: right;
  font-size: 0.75rem;
  color: #666;
  margin-top: 4px;
}
.card-wrapper { display: inline-block; }
.review-card {
  width: 380px;
  background: linear-gradient(145deg, #1a1a2e, #16213e);
  border-radius: 16px;
  overflow: hidden;
  border: 1px solid rgba(255,255,255,0.08);
  box-shadow: 0 8px 32px rgba(0,0,0,0.3);
}
.card-header {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  background: rgba(255,255,255,0.03);
  border-bottom: 1px solid rgba(255,255,255,0.06);
}
.game-icon {
  font-size: 2.2rem;
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255,255,255,0.05);
  border-radius: 12px;
}
.game-info { flex: 1; }
.game-info h2 { font-size: 1rem; color: #e0e0e0; margin-bottom: 2px; }
.card-stars { display: flex; gap: 2px; }
.star-sm { font-size: 0.9rem; color: #333; }
.star-sm.filled { color: #ffc107; }
.card-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}
.card-tag {
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 0.7rem;
  background: rgba(58,123,213,0.2);
  color: #6cb4ee;
  border: 1px solid rgba(58,123,213,0.3);
}
.card-body { padding: 16px; }
.review-content {
  font-size: 0.9rem;
  line-height: 1.6;
  color: #ccc;
  min-height: 40px;
  word-break: break-all;
}
.card-image { margin-top: 12px; border-radius: 10px; overflow: hidden; }
.card-image img { width: 100%; display: block; border-radius: 10px; }
.card-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  background: rgba(255,255,255,0.03);
  border-top: 1px solid rgba(255,255,255,0.06);
}
.player-info { display: flex; align-items: center; gap: 10px; }
.avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: linear-gradient(135deg, #3a7bd5, #00d2ff);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.85rem;
  font-weight: 600;
  color: white;
}
.player-detail { display: flex; flex-direction: column; }
.player-name { font-size: 0.8rem; color: #e0e0e0; font-weight: 500; }
.play-time { font-size: 0.7rem; color: #666; }
.platform-badge { font-size: 0.7rem; color: #888; background: rgba(255,255,255,0.05); padding: 4px 10px; border-radius: 8px; }

@media (max-width: 900px) {
  .template-wrapper { flex-direction: column; }
  .review-card { width: 100%; }
}
</style>
