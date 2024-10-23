<script lang="ts" setup>
import { useUsersStore } from '@/stores/userStore';
import { onMounted, ref, onUnmounted, watch, computed } from "vue";
import { useChatsStore } from '@/stores/chatStore';
import WelcomeWidget from './ui/WelcomeWidget.vue';
import SideWidget from './ui/SideWidget.vue';
import ChatHeader from './ui/ChatHeader.vue';
import ChatBody from './ui/ChatBody.vue';
import ChatSettings from './ui/ChatSettings.vue';
import type { ChatType, MessageType } from '@/shared/types'
import type { Ref } from 'vue';
import BaseIcon from '@/shared/ui/BaseIcon.vue';

const chats: Ref<ChatType[]> = ref([]);
const messages: Ref<MessageType[]> = ref([]);
const activeChatId: Ref<number | null> = ref(null);
const socket = ref<any>(null);
const connected: Ref<boolean> = ref(false);
const activeSettings: Ref<boolean> = ref(false);
const showNewUsers: Ref<boolean> = ref(false);
const store = useChatsStore();
const userStore = useUsersStore();

const activeChat = computed<ChatType | null>(() => {
  if (!activeChatId.value || !chats.value.length) return null;
  return chats.value.find((chat) => chat.chat_id === activeChatId.value) ?? null
});


function connect() {
  socket.value = new WebSocket("ws://localhost:3001");

  socket.value.onopen = () => {
    connected.value = true;
    const user_id = userStore.user?.id;

    if (!activeChatId.value || !user_id) return

    const message = {
      event: "connection",
      user_id,
      id: activeChatId.value,
    };


    socket.value.send(JSON.stringify(message));

    requestChatHistory(activeChatId.value, user_id);
  };

  socket.value.onmessage = (event: any): void => {
    const message = JSON.parse(event.data);

    if (!activeChat.value) return

    if (message.event === "message") {
      activeChat.value.last_message_content = message.content;
      activeChat.value.last_message_sent_at = message.sent_at;
      messages.value.push(message);
    } else if (message.event === "history") {
      messages.value = message.messages;
    }
  };

  /*  socket.value.onclose = () => {
     console.log("Socket closed");
   }; */

  socket.value.onerror = (): void => {
    console.error("Socket error");
  };
}

const sendMessage = async (newMessage: string) => {
  const user_id = userStore.user?.id;

  const message = {
    chat_id: activeChatId.value,
    user_id,
    message: newMessage,
    event: "message",
  };

  if (message.chat_id && message.message && user_id) {
    socket.value.send(JSON.stringify(message));
  }
};

function requestChatHistory(chat_id: number, user_id: number) {
  const request = {
    event: "history",
    chat_id,
    user_id,
  };
  socket.value.send(JSON.stringify(request));
}

const setActiveChat = (id: number): void => {
  socket.value.close();
  activeChatId.value = id;
  const user_id = userStore.user?.id;
  showNewUsers.value = false
  activeSettings.value = false

  if (user_id && id) {
    connect();
  }
};

const handleSettings = (): void => {
  activeSettings.value = !activeSettings.value
}

const deleteChat = async (): Promise<void> => {
  const confirmDelete = confirm('you want tot delete?')
  if (!activeChatId.value || !confirmDelete) return
  const id = await store.deleteChat(activeChatId.value)
  chats.value = chats.value.filter((chat) => chat.chat_id !== id)
}

const handleNewUsers = async (): Promise<void> => {
  await userStore.getUsers()
  showNewUsers.value = !showNewUsers.value
}

const createChat = async (id: number): Promise<void> => {
  const data = await store.createChat(id, 'New chat')
  if (data.success) {
    chats.value = [...chats.value, data.chat.chat]
    showNewUsers.value = false
    setActiveChat(data.chat.chat.chat_id)
  }

  if (data.message === "Chat already exists") {
    showNewUsers.value = false
    setActiveChat(data.chat.id)
  }
}

onMounted(async () => {
  chats.value = await store.getMyChats();
});

watch(
  () => userStore.user,
  (newUserInfo) => {
    if (newUserInfo?.id) {
      connect();
    }
  },
  { immediate: true }
);

onUnmounted(() => {
  if (socket.value) {
    socket.value.close();
  }
});
</script>
<template>
  <div class="main-chat">
    <SideWidget @handleNewUsers="handleNewUsers" :chats="chats" @set-active-chat="setActiveChat"
      :activeChatId="activeChatId" />
    <div class="users-list" v-if="showNewUsers">
      <div class="user-block" v-for="user in userStore.users" :key="user.id">
        <div class="user-img">
          <img v-if="user.img" :src="`http://localhost:3000/upload/images/${user.img}`" :alt="user.u_name">
          <img v-else :src="`/src/assets/images/default-user-img.jpg`" :alt="user.u_name">
        </div>
        <router-link :to="`/profile/${user.id}`">{{ user.u_name }}</router-link>
        <button @click="createChat(user.id)" class="message-btn">
          <BaseIcon width="24px" height="24px" name="message" />
        </button>
      </div>
    </div>
    <div class="chat-wrapper" v-else-if="activeChatId && activeChat">
      <ChatHeader :activeSettings="activeSettings" @handle-settings="handleSettings" :activeChat="activeChat" />
      <ChatBody v-if="!activeSettings" :activeChatId="activeChatId" :messages="messages" :activeChat="activeChat"
        @send-message="sendMessage" />
      <ChatSettings @deleteChat="deleteChat" v-else />
    </div>
    <WelcomeWidget v-else />
  </div>
</template>
<style scoped>
.users-list {
  display: flex;
  flex-wrap: wrap;
  align-content: start;
  gap: 10px;
  padding: 10px;
  flex-grow: 1;
  height: 100%;
}

.user-block {
  padding: 10px;
  border: 1px solid var(--c-4);
  border-radius: 5px;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.message-btn {
  width: min-content;
}

.message-btn:hover {
  transform: scale(1.04);
}

.user-img {
  width: 50px;
  height: 50px;
}

.user-img img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.main-chat {
  display: flex;
  border: 1px solid var(--c-1);
  height: calc(100% - 80px);
}

.chat-wrapper {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  height: 100%;
}

.chat-header {
  display: flex;
  align-items: center;
  padding: 8px 16px;
  gap: 16px;
  border-bottom: 1px solid var(--c-1);
}

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

.time {
  align-self: flex-end;
  font-size: 12px;
}

.messages-list::-webkit-scrollbar {
  width: 10px;
}

.messages-list::-webkit-scrollbar-track {
  background: var(--c-1);
}

.messages-list::-webkit-scrollbar-thumb {
  background: var(--c-4);
  border-radius: 10px;
  cursor: pointer;
}
</style>
