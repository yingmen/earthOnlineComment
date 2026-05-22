<template>
  <div class="avatar-upload" @click="triggerUpload">
    <div class="avatar-upload-preview" v-if="modelValue">
      <img :src="modelValue" class="avatar-upload-img" />
      <span class="avatar-upload-overlay">更换</span>
    </div>
    <div class="avatar-upload-placeholder" v-else>
      <span class="avatar-upload-icon">📷</span>
      <span>上传头像</span>
    </div>
  </div>
  <button v-if="modelValue" class="avatar-remove-btn" @click.stop="removeAvatar">移除头像</button>
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
  if (!file || !file.type.startsWith('image/')) return
  const reader = new FileReader()
  reader.onload = (ev) => { emit('update:modelValue', ev.target.result) }
  reader.readAsDataURL(file)
}

function removeAvatar() {
  emit('update:modelValue', null)
  if (fileInput.value) fileInput.value.value = ''
}
</script>

<style scoped>
.avatar-upload {
  width: 72px;
  height: 72px;
  border-radius: 50%;
  border: 2px dashed var(--input-border);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  overflow: hidden;
  transition: border-color 0.2s;
  position: relative;
  margin-bottom: 8px;
}
.avatar-upload:hover { border-color: var(--accent-primary); }
.avatar-upload-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  font-size: 0.65rem;
  color: var(--text-muted);
}
.avatar-upload-icon { font-size: 1.4rem; }
.avatar-upload-preview {
  position: relative;
  width: 100%;
  height: 100%;
}
.avatar-upload-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.avatar-upload-overlay {
  position: absolute;
  inset: 0;
  background: rgba(0,0,0,0.55);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 0.7rem;
  opacity: 0;
  transition: opacity 0.2s;
}
.avatar-upload:hover .avatar-upload-overlay { opacity: 1; }
.avatar-remove-btn {
  padding: 4px 12px;
  border-radius: 6px;
  border: 1px solid var(--input-border);
  background: transparent;
  color: var(--text-muted);
  font-size: 0.75rem;
  cursor: pointer;
  transition: border-color 0.2s, color 0.2s;
}
.avatar-remove-btn:hover { border-color: #f44336; color: #f44336; }
.hidden-input { display: none; }
</style>
