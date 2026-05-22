<template>
  <div class="upload-area" @click="triggerUpload" @dragover.prevent @drop.prevent="handleDrop">
    <template v-if="!modelValue">
      <div class="upload-placeholder">
        <span class="upload-icon">📷</span>
        <p>点击或拖拽上传图片</p>
      </div>
    </template>
    <template v-else>
      <img :src="modelValue" class="preview-image" />
      <div class="remove-btn" @click.stop="removeImage">✕</div>
    </template>
  </div>
  <input ref="fileInput" type="file" accept="image/*" class="hidden-input" @change="handleFileChange" />
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({ modelValue: String })
const emit = defineEmits(['update:modelValue'])
const fileInput = ref(null)

function triggerUpload() { fileInput.value.click() }

function handleFileChange(e) {
  const file = e.target.files[0]
  if (file) processFile(file)
}

function handleDrop(e) {
  const file = e.dataTransfer.files[0]
  if (file) processFile(file)
}

function processFile(file) {
  if (!file.type.startsWith('image/')) return
  const reader = new FileReader()
  reader.onload = (e) => emit('update:modelValue', e.target.result)
  reader.readAsDataURL(file)
}

function removeImage() {
  emit('update:modelValue', null)
  if (fileInput.value) fileInput.value.value = ''
}
</script>

<style scoped>
.upload-area {
  width: 100%;
  min-height: 120px;
  border: 2px dashed rgba(255,255,255,0.15);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
  position: relative;
  overflow: hidden;
}
.upload-area:hover { border-color: #3a7bd5; background: rgba(58,123,213,0.05); }
.upload-placeholder { text-align: center; color: #666; }
.upload-icon { font-size: 2rem; display: block; margin-bottom: 8px; }
.preview-image { max-width: 100%; max-height: 180px; border-radius: 8px; object-fit: contain; }
.remove-btn {
  position: absolute;
  top: 8px;
  right: 8px;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: rgba(0,0,0,0.6);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 0.75rem;
}
.hidden-input { display: none; }
</style>
