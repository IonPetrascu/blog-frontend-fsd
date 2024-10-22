<script lang="ts" setup>
import type { ChatType } from '@/shared/types';
import BaseIcon from '@/shared/ui/BaseIcon.vue';
defineProps<{
  activeChat: ChatType
}>();

</script>
<template>
  <div class="chat-header">
    <img v-if="activeChat.user_img" class="chat-img-user"
      :src="`http://localhost:3000/upload/images/${activeChat.user_img}`" alt="default user img" />
    <img v-else class="chat-img-user" src="@/assets/images/default-user-img.jpg" alt="default image" />

    <div class="chat-info">
      <router-link :to="`/profile/${activeChat.user_id}`">
        <h3 v-if="activeChat.user_name" class="user-name">
          {{ activeChat.user_name }}
        </h3>
      </router-link>

      <span v-if="activeChat.last_message_sent_at" class="latest-online">last seen {{
        activeChat.last_message_sent_at.slice(11, 16) }}</span>
    </div>
    <button class="chat-settings">
      <BaseIcon width="24px" height="24px" name="chat_settings" />
    </button>
  </div>
</template>
<style scoped>
.chat-header {
  display: flex;
  align-items: center;
  padding: 8px 16px;
  gap: 16px;
}

.chat-img-user {
  width: 40px;
  aspect-ratio: 1/1;
  object-fit: cover;
  border-radius: 50%;
}

.chat-info {
  flex-grow: 1;
}

.user-name {
  font-weight: 600;
  font-size: 16px;
  line-height: 125%;
}

.latest-online {
  font-weight: 400;
  font-size: 14px;
  line-height: 129%;
  opacity: 0.5;
}

.chat-settings {
  margin-left: auto;
  cursor: pointer;
  transition: transform 0.3s ease;
}

.chat-settings:hover {
  transform: rotate(90deg);
}
</style>
