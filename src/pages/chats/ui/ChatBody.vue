<script lang="ts" setup>
import { useUsersStore } from '@/stores/userStore';
import { ref, computed } from 'vue';
import type { ChatType } from '@/shared/types';
import type { Ref } from 'vue';

const props = defineProps<{
  messages: any[]
  activeChat: ChatType
  activeChatId: any
}>();

const userStore = useUsersStore()
const showPopup: Ref<boolean> = ref(true);
const newMessage: Ref<string> = ref('')

const closeWelcomePopup = (): void => { showPopup.value = false }

const isNewChat = computed<boolean>(() => !props.messages?.length);

const handlesubmit = () => {
  emit('sendMessage', newMessage.value)
  newMessage.value = ''
}

const sendWelcomeMessage = (): void => {
  newMessage.value = "Hello!";
  emit('sendMessage', newMessage.value)
  closeWelcomePopup();
};

const emit = defineEmits<{
  (e: 'sendMessage', newMessage: string): void
}>()

</script>
<template>
  <div class="chat-body">
    <ul class="messages-list">
      <li class="message-wrapper animation" v-for="msg in messages" :key="msg.id">
        <div class="message" v-if="msg.user_id !== userStore.user?.id">
          <div>
            <img v-if="activeChat.user_img" class="user-img"
              :src="`http://localhost:3000/uploads/images/${activeChat.user_img}`" alt="" />
            <img v-else class="user-img" src="@/assets/images/default-user-img.jpg" alt="deafult image" />
          </div>
          <p class="message-text">{{ msg.content }}</p>
          <span class="time">{{ msg.sent_at.slice(11, 16) }}</span>
        </div>
        <div v-else class="message user-msg">
          <span class="time">{{ msg.sent_at.slice(11, 16) }}</span>
          <p class="message-text">{{ msg.content }}</p>
          <div>
            <img v-if="userStore.user?.img" class="user-img"
              :src="`http://localhost:3000/upload/images/${userStore.user.img}`" alt="" />
            <img v-else class="user-img" src="@/assets/images/default-user-img.jpg" alt="deafult image" />
          </div>
        </div>
      </li>
    </ul>
    <div class="chat-footer">
      <input @keyup.enter="handlesubmit" v-model="newMessage" placeholder="Message" type="text" />
      <button @click="handlesubmit" class="submit-msg" type="submit">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M12.815 12.197L5.28299 13.453C5.19639 13.4675 5.11513 13.5045 5.04737 13.5603C4.97961 13.6161 4.92775 13.6888 4.89699 13.771L2.29999 20.728C2.05199 21.368 2.72099 21.978 3.33499 21.671L21.335 12.671C21.4597 12.6088 21.5645 12.513 21.6378 12.3945C21.7111 12.276 21.7499 12.1394 21.7499 12C21.7499 11.8607 21.7111 11.7241 21.6378 11.6055C21.5645 11.487 21.4597 11.3913 21.335 11.329L3.33499 2.32901C2.72099 2.02201 2.05199 2.63301 2.29999 3.27201L4.89799 10.229C4.9286 10.3114 4.98041 10.3843 5.04818 10.4403C5.11594 10.4963 5.19728 10.5335 5.28399 10.548L12.816 11.803C12.8623 11.8111 12.9043 11.8353 12.9346 11.8714C12.9649 11.9074 12.9815 11.9529 12.9815 12C12.9815 12.0471 12.9649 12.0926 12.9346 12.1287C12.9043 12.1647 12.8623 12.1889 12.816 12.197H12.815Z"
            fill="#a594f9" />
        </svg>
      </button>
      <div class="welcome-popup" :class="{ show: isNewChat && showPopup }">
        <p class="welcome-text">
          This chat is currently empty. Be the first to post a message!
        </p>
        <div class="welcome-btns">
          <button @click="closeWelcomePopup" class="welcome-btn close-btn">
            Close
          </button>
          <button @click="sendWelcomeMessage" class="welcome-btn send-btn">
            Send
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped>
.chat-body {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  padding-inline: 20px;
  background: rgb(255, 235, 235);
  padding-bottom: 20px;
  height: calc(100% - 56px);
}

.messages-list {
  list-style-type: none;
  display: flex;
  flex-direction: column;
  gap: 20px;
  flex-grow: 1;
  margin-bottom: 40px;
  overflow: auto;
  padding: 10px 10px 0;
}

.message-wrapper {
  display: flex;
}

.message {
  display: flex;
  align-items: center;
  gap: 10px;
  max-width: 700px;
}

.user-msg {
  margin-left: auto;
}

.message-text {
  background: rgb(223, 222, 222);
  padding: 10px 5px;
  border-radius: 10px;
  max-width: 700px;
  word-wrap: break-word;
}

.user-msg>.message-text {
  background: rgb(193, 251, 255);
}

.user-img {
  width: 30px;
  aspect-ratio: 1/1;
  object-fit: cover;
  border-radius: 50%;
}

.time {
  align-self: flex-end;
  font-size: 12px;
}

.chat-footer {
  padding: 16px;
  display: flex;
  gap: 16px;
  background: var(--white);
  border-radius: 20px;
  position: relative;
}

.chat-footer input {
  flex-grow: 1;
  line-height: 125%;
  border: none;
  outline: none;
}

.submit-msg {
  transition: scale 0.3s ease;
}

.submit-msg:hover {
  scale: 1.2;
}

.welcome-popup {
  position: absolute;
  top: -90px;
  left: 50%;
  transform: translateX(-50%);
  padding: 10px;
  background: white;
  border-radius: 10px;
  opacity: 0;
}

.welcome-popup.show {
  opacity: 1;
}

.welcome-text {
  margin-bottom: 5px;
}

.welcome-btns {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 20px;
}

.animation {
  animation: scale-in-hor-center 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94) both;
}

@keyframes scale-in-hor-center {
  0% {
    transform: scaleX(0);
    opacity: 1;
  }

  100% {
    transform: scaleX(1);
    opacity: 1;
  }
}
</style>
