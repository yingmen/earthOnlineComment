<template>
  <div class="template-wrapper">
    <div class="form-section">
      <div class="form-group">
        <label>公告类型</label>
        <div class="radio-group">
          <label class="radio-label"><input type="radio" v-model="noticeType" value="system" /> 系统公告</label>
          <label class="radio-label"><input type="radio" v-model="noticeType" value="dungeon" /> 副本速报</label>
        </div>
      </div>

      <div class="form-group">
        <label>公告标题</label>
        <input v-model="title" type="text" class="text-input" placeholder="如：日本宫城服务器触发地震副本" />
      </div>

      <div class="form-group">
        <label>公告时间</label>
        <input v-model="noticeTime" type="text" class="text-input" placeholder="如：2025-03-15 14:30" />
      </div>

      <div class="form-group" v-if="noticeType === 'dungeon'">
        <label>副本/事件难度</label>
        <div class="star-rating">
          <span v-for="s in 5" :key="s" :class="['star', { filled: s <= difficulty }]" @click="difficulty = s">★</span>
          <span class="rating-text">{{ ['', '简单', '普通', '困难', '噩梦', '地狱'][difficulty] }}</span>
        </div>
      </div>

      <div class="row">
        <div class="form-group flex-1">
          <label>影响范围</label>
          <input v-model="scope" type="text" class="text-input" placeholder="如：3座城市" />
        </div>
        <div class="form-group flex-1">
          <label>影响玩家数</label>
          <input v-model="affectedPlayers" type="text" class="text-input" placeholder="如：1200万" />
        </div>
      </div>

      <div class="form-group">
        <label>公告内容</label>
        <textarea v-model="content" class="text-area" rows="4" placeholder="详细描述事件内容..." maxlength="300"></textarea>
        <span class="char-count">{{ content.length }}/300</span>
      </div>

      <div class="form-group">
        <label>上传配图 (新闻截图/实拍图)</label>
        <ImageUploader v-model="uploadedImage" />
      </div>

      <div class="form-group">
        <label>发布者</label>
        <input v-model="publisher" type="text" class="text-input" placeholder="地球Online系统" />
      </div>
    </div>

    <div class="preview-section">
      <h3 class="preview-title">预览</h3>
      <div class="card-wrapper" ref="cardRef">
        <div class="notice-card">
          <div class="notice-header" :class="noticeType">
            <div class="notice-badge">
              <span>{{ noticeType === 'system' ? '📢' : '⚔️' }}</span>
              <span class="badge-text">{{ noticeType === 'system' ? '系统公告' : '副本速报' }}</span>
            </div>
            <div class="notice-time">{{ noticeTime }}</div>
          </div>

          <div class="notice-body">
            <h2 class="notice-title">{{ title || '事件标题' }}</h2>

            <div class="difficulty-bar" v-if="noticeType === 'dungeon'">
              <span class="diff-label">副本难度</span>
              <div class="diff-stars">
                <span v-for="s in 5" :key="s" :class="['diff-star', { filled: s <= difficulty }]">★</span>
              </div>
              <span class="diff-text">{{ ['', '简单', '普通', '困难', '噩梦', '地狱'][difficulty] }}</span>
            </div>

            <div class="data-panel" v-if="scope || affectedPlayers">
              <div class="data-item">
                <span class="data-label">影响范围</span>
                <span class="data-value">{{ scope || '—' }}</span>
              </div>
              <div class="data-item">
                <span class="data-label">涉及玩家</span>
                <span class="data-value">{{ affectedPlayers || '—' }}</span>
              </div>
            </div>

            <p class="notice-content">{{ content || '暂无详细公告内容...' }}</p>

            <div class="notice-image" v-if="uploadedImage">
              <img :src="uploadedImage" />
            </div>
          </div>

          <div class="notice-footer">
            <div class="notice-source">
              <span class="source-icon">🔔</span>
              <span>{{ publisher || '地球Online系统' }}</span>
            </div>
            <div class="notice-tag">#地球Online</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import ImageUploader from './ImageUploader.vue'

const noticeType = ref('system')
const title = ref('')
const noticeTime = ref('2026-05-20 14:30')
const difficulty = ref(3)
const scope = ref('')
const affectedPlayers = ref('')
const content = ref('')
const uploadedImage = ref(null)
const publisher = ref('地球Online系统')
const cardRef = ref(null)

defineExpose({ cardRef })
</script>

<style scoped>
.template-wrapper { display: flex; gap: 30px; }
.form-section, .preview-section { flex: 1; }
.preview-title { margin-bottom: 16px; color: #aaa; font-size: 0.9rem; text-transform: uppercase; letter-spacing: 2px; }
.form-group { margin-bottom: 20px; }
.form-group label { display: block; margin-bottom: 8px; font-size: 0.9rem; color: #aaa; font-weight: 500; }
.row { display: flex; gap: 12px; }
.flex-1 { flex: 1; }
.radio-group { display: flex; gap: 20px; }
.radio-label { display: flex; align-items: center; gap: 6px; color: #ccc; cursor: pointer; font-size: 0.9rem; }
.radio-label input { accent-color: #3a7bd5; }
.text-input {
  width: 100%; padding: 10px 14px; border-radius: 10px;
  border: 1px solid rgba(255,255,255,0.1); background: rgba(255,255,255,0.05);
  color: #e0e0e0; font-size: 0.9rem; outline: none; transition: border-color 0.2s;
}
.text-input:focus { border-color: #3a7bd5; }
.text-area {
  width: 100%; padding: 10px 14px; border-radius: 10px;
  border: 1px solid rgba(255,255,255,0.1); background: rgba(255,255,255,0.05);
  color: #e0e0e0; font-size: 0.9rem; outline: none; resize: vertical;
  font-family: inherit; transition: border-color 0.2s;
}
.text-area:focus { border-color: #3a7bd5; }
.char-count { display: block; text-align: right; font-size: 0.75rem; color: #666; margin-top: 4px; }
.star-rating { display: flex; align-items: center; gap: 4px; }
.star { font-size: 1.5rem; cursor: pointer; color: #333; transition: all 0.15s; }
.star.filled { color: #ff4444; text-shadow: 0 0 8px rgba(255,68,68,0.4); }
.star:hover { transform: scale(1.2); }
.rating-text { margin-left: 12px; font-size: 0.85rem; color: #ff4444; font-weight: 600; }

.card-wrapper { display: inline-block; }
.notice-card {
  width: 380px;
  background: #0d0d1a;
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid rgba(255,255,255,0.08);
  box-shadow: 0 8px 32px rgba(0,0,0,0.4);
}
.notice-header {
  display: flex; align-items: center; justify-content: space-between;
  padding: 12px 16px;
}
.notice-header.system { background: linear-gradient(90deg, #8b0000, #cc0000); }
.notice-header.dungeon { background: linear-gradient(90deg, #4a0030, #8b0050); }
.notice-badge { display: flex; align-items: center; gap: 6px; font-size: 0.9rem; color: white; font-weight: 700; }
.badge-text { font-size: 0.95rem; letter-spacing: 2px; }
.notice-time { font-size: 0.7rem; color: rgba(255,255,255,0.7); }
.notice-body { padding: 16px; }
.notice-title { font-size: 1.1rem; color: #e0e0e0; margin-bottom: 12px; }
.difficulty-bar { display: flex; align-items: center; gap: 8px; margin-bottom: 12px; padding: 8px 12px; background: rgba(255,255,255,0.03); border-radius: 8px; }
.diff-label { font-size: 0.75rem; color: #888; }
.diff-stars { display: flex; gap: 2px; }
.diff-star { font-size: 0.9rem; color: #333; }
.diff-star.filled { color: #ff4444; }
.diff-text { font-size: 0.8rem; color: #ff4444; font-weight: 600; margin-left: 4px; }
.data-panel { display: flex; gap: 12px; margin-bottom: 12px; }
.data-item { flex: 1; padding: 8px 12px; background: rgba(255,255,255,0.03); border-radius: 8px; display: flex; flex-direction: column; gap: 4px; }
.data-label { font-size: 0.65rem; color: #666; text-transform: uppercase; letter-spacing: 1px; }
.data-value { font-size: 0.9rem; color: #e0e0e0; font-weight: 600; }
.notice-content { font-size: 0.85rem; line-height: 1.6; color: #aaa; }
.notice-image { margin-top: 12px; border-radius: 8px; overflow: hidden; border: 1px solid rgba(255,255,255,0.06); }
.notice-image img { width: 100%; display: block; }
.notice-footer {
  display: flex; align-items: center; justify-content: space-between;
  padding: 12px 16px; background: rgba(255,255,255,0.02); border-top: 1px solid rgba(255,255,255,0.05);
}
.notice-source { display: flex; align-items: center; gap: 6px; font-size: 0.75rem; color: #888; }
.source-icon { font-size: 0.8rem; }
.notice-tag { font-size: 0.65rem; color: #6cb4ee; padding: 3px 8px; background: rgba(58,123,213,0.15); border-radius: 6px; }

@media (max-width: 900px) {
  .template-wrapper { flex-direction: column; }
  .notice-card { width: 100%; }
}
</style>
