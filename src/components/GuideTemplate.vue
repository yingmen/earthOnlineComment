<template>
  <div class="template-wrapper">
    <div class="form-section">
      <div class="form-group">
        <label>攻略标题</label>
        <input v-model="guideTitle" type="text" class="text-input" placeholder="如：租房副本通关攻略" />
      </div>

      <div class="form-group">
        <label>难度评级</label>
        <div class="star-rating">
          <span v-for="s in 5" :key="s" :class="['star', { filled: s <= difficulty }]" @click="difficulty = s">★</span>
          <span class="rating-text">{{ ['', 'E级', 'D级', 'C级', 'B级', 'S级'][difficulty] }}</span>
        </div>
      </div>

      <div class="form-group">
        <label>攻略步骤</label>
        <div class="steps-editor">
          <div v-for="(step, idx) in steps" :key="idx" class="step-card">
            <div class="step-header">
              <span class="step-num">第{{ idx + 1 }}步</span>
              <button class="btn-icon" @click="removeStep(idx)" :disabled="steps.length <= 1">✕</button>
            </div>
            <textarea v-model="step.text" class="text-area step-textarea" :placeholder="`步骤 ${idx + 1} 描述`" rows="2"></textarea>
            <div class="step-meta-row">
              <div class="step-meta">
                <span class="meta-label">⚡ 技能消耗</span>
                <input v-model="step.cost" type="text" class="text-input-sm" placeholder="如：精力-30" />
              </div>
              <div class="step-meta">
                <span class="meta-label">✨ 经验奖励</span>
                <input v-model="step.reward" type="text" class="text-input-sm" placeholder="如：EXP+500" />
              </div>
            </div>
          </div>
          <button class="add-step-btn" @click="addStep">+ 添加步骤</button>
        </div>
      </div>

      <div class="form-group">
        <label>领取奖励</label>
        <div class="rewards-grid">
          <div class="reward-item">
            <span class="reward-icon">⭐</span>
            <input v-model="totalExp" type="text" class="text-input-sm" placeholder="总经验值" />
          </div>
          <div class="reward-item">
            <span class="reward-icon">🪙</span>
            <input v-model="totalGold" type="text" class="text-input-sm" placeholder="总金币" />
          </div>
          <div class="reward-item">
            <span class="reward-icon">🎁</span>
            <input v-model="totalItems" type="text" class="text-input-sm" placeholder="额外奖励" />
          </div>
        </div>
      </div>

      <div class="form-group">
        <label>上传配图</label>
        <ImageUploader v-model="uploadedImage" />
      </div>

      <div class="form-group">
        <label>温馨提示</label>
        <input v-model="tip" type="text" class="text-input" placeholder="给新手的建议..." />
      </div>
    </div>

    <div class="preview-section">
      <h3 class="preview-title">预览</h3>
      <div class="card-wrapper" ref="cardRef">
        <div class="guide-card">
          <div class="guide-header">
            <div class="guide-badge">📖 新手攻略</div>
            <div class="guide-diff">
              <span v-for="s in 5" :key="s" :class="['g-star', { filled: s <= difficulty }]">★</span>
              <span class="g-diff-text">{{ ['', 'E级', 'D级', 'C级', 'B级', 'S级'][difficulty] }}</span>
            </div>
          </div>

          <div class="guide-body">
            <h2 class="guide-title">{{ guideTitle || '攻略标题' }}</h2>

            <div class="steps-display">
              <div v-for="(step, idx) in steps" :key="idx" class="step-display-item">
                <div class="step-display-num">{{ idx + 1 }}</div>
                <div class="step-display-content">
                  <p class="step-display-text">{{ step.text || `步骤 ${idx + 1}` }}</p>
                  <div class="step-display-meta">
                    <span class="meta-cost" v-if="step.cost">⚡ {{ step.cost }}</span>
                    <span class="meta-reward" v-if="step.reward">✨ {{ step.reward }}</span>
                  </div>
                </div>
              </div>
            </div>

            <div class="total-rewards" v-if="totalExp || totalGold || totalItems">
              <div class="rewards-title">🎯 任务奖励</div>
              <div class="rewards-list">
                <span v-if="totalExp" class="reward-badge exp">⭐ {{ totalExp }}</span>
                <span v-if="totalGold" class="reward-badge gold">🪙 {{ totalGold }}</span>
                <span v-if="totalItems" class="reward-badge item">🎁 {{ totalItems }}</span>
              </div>
            </div>

            <div class="guide-image" v-if="uploadedImage">
              <img :src="uploadedImage" />
            </div>

            <div class="guide-tip" v-if="tip">
              <span class="tip-icon">💡</span>
              <span class="tip-text">{{ tip }}</span>
            </div>
          </div>

          <div class="guide-footer">
            <span>🌍 地球Online · 新手村任务</span>
            <span>#地球Online</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import ImageUploader from './ImageUploader.vue'

const guideTitle = ref('')
const difficulty = ref(3)
const steps = ref([
  { text: '确认房源信息，查看产权证明', cost: '精力-20', reward: 'EXP+200' },
  { text: '实地考察房屋状况及周边环境', cost: '精力-30', reward: 'EXP+300' },
  { text: '仔细阅读合同条款，注意隐藏费用', cost: '精力-50', reward: 'EXP+500' },
])
const totalExp = ref('EXP+1500')
const totalGold = ref('金币-3000')
const totalItems = ref('租房合同×1')
const uploadedImage = ref(null)
const tip = ref('建议组队前往，可提升谈判成功率')
const cardRef = ref(null)

function addStep() {
  steps.value.push({ text: '', cost: '', reward: '' })
}

function removeStep(idx) {
  if (steps.value.length > 1) steps.value.splice(idx, 1)
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
.text-input-sm {
  width: 100%; padding: 6px 10px; border-radius: 6px;
  border: 1px solid var(--input-border); background: var(--input-bg);
  color: var(--text-primary); font-size: 0.8rem; outline: none; transition: border-color 0.2s;
}
.text-input-sm:focus { border-color: var(--input-focus); }
.text-area {
  width: 100%; padding: 10px 14px; border-radius: 10px;
  border: 1px solid var(--input-border); background: var(--input-bg);
  color: var(--text-primary); font-size: 0.9rem; outline: none; resize: vertical;
  font-family: inherit; transition: border-color 0.2s;
}
.text-area:focus { border-color: var(--input-focus); }

.star-rating { display: flex; align-items: center; gap: 4px; }
.star { font-size: 1.5rem; cursor: pointer; color: var(--guide-star-empty); transition: all 0.15s; }
.star.filled { color: var(--star-color); text-shadow: 0 0 8px rgba(255,152,0,0.4); }
.star:hover { transform: scale(1.2); }
.rating-text { margin-left: 12px; font-size: 0.85rem; color: var(--star-color); font-weight: 600; }

.steps-editor { display: flex; flex-direction: column; gap: 12px; }
.step-card { background: var(--card-inner-bg); border-radius: 10px; padding: 12px; border: 1px solid var(--card-inner-border); }
.step-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; }
.step-num { font-size: 0.75rem; color: var(--accent-primary); font-weight: 600; }
.step-textarea { font-size: 0.85rem; }
.step-meta-row { display: flex; gap: 12px; margin-top: 8px; }
.step-meta { flex: 1; display: flex; flex-direction: column; gap: 4px; }
.meta-label { font-size: 0.7rem; color: var(--char-count-color); }
.btn-icon { width: 24px; height: 24px; border-radius: 4px; border: none; background: transparent; color: var(--text-muted); cursor: pointer; font-size: 0.7rem; }
.add-step-btn { padding: 10px; border: 1px dashed var(--dashed-border); border-radius: 8px; background: transparent; color: var(--text-muted); cursor: pointer; font-size: 0.8rem; }
.rewards-grid { display: flex; gap: 12px; }
.reward-item { flex: 1; display: flex; align-items: center; gap: 6px; }
.reward-icon { font-size: 1rem; }

.card-wrapper { display: inline-block; }
.guide-card {
  width: 380px;
  background: linear-gradient(160deg, var(--guide-card-from), var(--guide-card-to));
  border-radius: 14px;
  overflow: hidden;
  border: 1px solid var(--surface-border);
  box-shadow: 0 8px 32px var(--card-shadow);
}
.guide-header {
  display: flex; align-items: center; justify-content: space-between;
  padding: 12px 16px;
  background: linear-gradient(90deg, var(--guide-header-from), var(--guide-header-to));
}
.guide-badge { color: white; font-weight: 700; font-size: 0.85rem; letter-spacing: 1px; }
.guide-diff { display: flex; align-items: center; gap: 3px; }
.g-star { font-size: 0.8rem; color: var(--guide-star-empty); }
.g-star.filled { color: var(--star-color); }
.g-diff-text { font-size: 0.7rem; color: var(--star-color); font-weight: 600; margin-left: 4px; }
.guide-body { padding: 16px; }
.guide-title { font-size: 1.1rem; color: var(--text-primary); margin-bottom: 16px; }
.steps-display { display: flex; flex-direction: column; gap: 10px; margin-bottom: 16px; }
.step-display-item { display: flex; gap: 12px; }
.step-display-num {
  width: 26px; height: 26px; border-radius: 50%;
  background: linear-gradient(135deg, var(--guide-step-from), var(--guide-step-to));
  display: flex; align-items: center; justify-content: center;
  font-size: 0.75rem; font-weight: 700; color: white; flex-shrink: 0; margin-top: 2px;
}
.step-display-content { flex: 1; }
.step-display-text { font-size: 0.85rem; color: var(--text-secondary); line-height: 1.4; }
.step-display-meta { display: flex; gap: 12px; margin-top: 4px; }
.meta-cost { font-size: 0.7rem; color: var(--cost-color); }
.meta-reward { font-size: 0.7rem; color: var(--exp-color); }
.total-rewards { background: var(--card-inner-bg); border-radius: 10px; padding: 12px; margin-bottom: 12px; border: 1px solid var(--gold-bg); }
.rewards-title { font-size: 0.8rem; color: var(--gold-color); font-weight: 600; margin-bottom: 8px; }
.rewards-list { display: flex; flex-wrap: wrap; gap: 8px; }
.reward-badge { padding: 4px 10px; border-radius: 6px; font-size: 0.75rem; font-weight: 600; }
.reward-badge.exp { background: var(--exp-bg); color: var(--exp-color); }
.reward-badge.gold { background: var(--gold-bg); color: var(--gold-color); }
.reward-badge.item { background: var(--item-bg); color: var(--item-color); }
.guide-image { margin-bottom: 12px; border-radius: 8px; overflow: hidden; }
.guide-image img { width: 100%; display: block; }
.guide-tip { display: flex; align-items: flex-start; gap: 8px; padding: 10px 12px; background: var(--tip-bg); border-radius: 8px; border: 1px solid var(--tip-border); }
.tip-icon { font-size: 0.9rem; }
.tip-text { font-size: 0.8rem; color: var(--tip-color); line-height: 1.4; }
.guide-footer {
  display: flex; align-items: center; justify-content: space-between;
  padding: 10px 16px; font-size: 0.65rem; color: var(--footer-text);
  border-top: 1px solid var(--footer-border);
}

@media (max-width: 900px) {
  .template-wrapper { flex-direction: column; }
  .guide-card { width: 100%; }
}
</style>
