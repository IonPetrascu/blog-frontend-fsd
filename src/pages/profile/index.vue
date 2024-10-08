<script lang="ts" setup>
import { ref, onMounted, computed, watch } from 'vue';
import { useUsersStore } from '@/stores/userStore';
import { useRoute, useRouter } from 'vue-router';
import { useChatsStore } from '@/stores/chatStore';
import PostCard from '@/shared/ui/ThePostCard.vue';
import SubscribersPopup from '@/pages/profile/ui/TheSubscribersPopup.vue';
import type { Subscriber, Subscribtion } from '@/shared/types';
import type { Ref } from 'vue';
import type { TypeSub } from '@/shared/types';

const route = useRoute()
const router = useRouter();
const store = useUsersStore()
const chatStore = useChatsStore()
const showImgSettings: Ref<boolean> = ref(false);
const showSubscribers: Ref<boolean> = ref(false);
const popupDataType: Ref<string> = ref("");

const userId = computed((): number => +route.params.id);

const isMyProfile = computed((): boolean => {
  if (store.user) {
    return store.user.id === Number(route.params.id);
  }
  return false;
});

const popupData = computed((): Subscriber[] | Subscribtion[] => {
  return popupDataType.value === "subscribers"
    ? store.profile?.subscribers || []
    : store.profile?.subscribtions || [];
});

const isSubscribed = computed((): boolean => {
  return (
    store.profile?.subscribers.findIndex(
      (sub: Subscriber) => sub.subscriber_id === store.user?.id
    ) !== -1
  );
});

const createChat = async () => {
  const res = await chatStore.createChat(userId.value, "New chat");
  if (res.success) {
    goToChats();
  }
};

const openSubPopup = (type: TypeSub) => {
  popupDataType.value = type;
  showSubscribers.value = true;
};

const goToChats = (): void => { router.push("/chats") }
const following = (): void => { store.subscribeToUser(userId.value) }
const closePopup = (): void => { showSubscribers.value = false }
const removeFollowing = (): void => { store.deleteSubscription(userId.value) }

const handleImgSettings = (): void => {
  showImgSettings.value = !showImgSettings.value;
};

const handleImageChange = async (event: Event) => {
  try {
    const target = event.target as HTMLInputElement;
    const file = target.files?.[0];
    const formData = new FormData();

    if (!file) throw new Error("Error");
    formData.append("img", file);
    await store.changeProfileImg(formData);
    handleImgSettings();
  } catch (error) {
    console.error("Error on change img:", error);
  }
};

onMounted(() => store.getUserInfo(userId.value));

watch(
  userId,
  (newUserId) => {
    store.getUserInfo(newUserId);
    closePopup();
  }
);

</script>


<template>
  <div class="profile-container">
    <div class="profile-banner"></div>
    <div class="profile-content">
      <div class="profile-header">
        <div class="profile-avatar">
          <img v-if="store.profile?.user?.img" :src="`http://localhost:3000/${store.profile.user.img}`"
            alt="Profile Image" />
          <img v-else src="@/assets/images/default-user-img.jpg" alt="Profile Image" />
          <button v-if="isMyProfile" @click="handleImgSettings" class="profile-avatar-settings">
            <img src="@/assets/icons/settings.svg" alt="settings img" />
          </button>
          <div class="avatar-settings-list" v-if="showImgSettings">
            <input ref="inputImg" id="input-file" multiple type="file" accept="image/jpeg, image/png ,image/jpg"
              @change="handleImageChange" />
          </div>
        </div>
        <button v-if="isMyProfile" class="profile-edit-button">Edit</button>
      </div>
      <div class="profile-details">
        <div class="profile-info">
          <h3 class="profile-name">{{ store.profile?.user.u_name }}</h3>
        </div>
        <div v-if="!isMyProfile" class="profile-actions">
          <button v-if="!isSubscribed" @click="following" class="profile-action-btn following-btn">
            Following
          </button>
          <button v-else @click="removeFollowing" class="profile-action-btn following-btn">
            Unfollowing
          </button>
          <button class="profile-action-btn message-btn" @click="createChat">
            Message
          </button>
        </div>
      </div>
      <div class="profile-stats">
        <div class="profile-stat-item">
          <span class="profile-stat-number">{{
            store.profile?.posts.length
            }}</span>
          <span class="profile-stat-label">Posts</span>
        </div>
        <div class="profile-stat-item">
          <span class="profile-stat-number">{{
            store.profile?.subscribers.length
            }}</span>
          <button @click="() => openSubPopup('subscribers')" class="profile-stat-label">
            Followers
          </button>
        </div>
        <div class="profile-stat-item">
          <span class="profile-stat-number">{{
            store.profile?.subscribtions.length
            }}</span>
          <button @click="() => openSubPopup('subscribtions')" class="profile-stat-label">
            Following
          </button>
        </div>
      </div>
    </div>
    <div class="posts" v-if="store.profile !== null">
      <PostCard :post="post" v-for="post in store.profile.posts" :key="post.id" />
    </div>
    <SubscribersPopup v-if="showSubscribers" :data="popupData" :type="popupDataType" @close-popup="closePopup" />
  </div>
</template>


<style scoped>
.profile-container {
  padding: 0 10px;
}

.profile-banner {
  height: 200px;
  background: var(--c-2);
  border-radius: 10px;
}

.profile-content {
  padding: 0 20px;
  margin-top: -70px;
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.profile-header {
  display: flex;
}

.profile-avatar {
  width: 150px;
  position: relative;
}

.profile-avatar img {
  width: 100%;
  border-radius: 50%;
  aspect-ratio: 1 / 1;
  object-fit: cover;
}

.profile-edit-button {
  align-self: flex-end;
  margin-left: auto;
}

.profile-name {
  font-size: 1.4em;
}

.profile-location {
  font-size: 1em;
  opacity: 0.5;
}

.profile-stats {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.profile-stat-number {
  margin-right: 5px;
  font-weight: bold;
}

.profile-actions {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 1.4em;
  margin-top: 10px;
}

.profile-avatar-settings {
  position: absolute;
  transition: all 0.4s ease;
}

.profile-avatar-settings:hover {
  transform: rotate(45deg);
}

.profile-avatar-settings img {
  width: 20px;
  height: 20px;
}

.avatar-settings-list {
  position: absolute;
  top: 20px;
  padding: 10px;
  background: var(--white);
}

.profile {
  max-width: 600px;
  margin: 0 auto;
}

.error {
  color: red;
}

.posts {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
  padding-inline: 10px;
  margin-top: 20px;
}

@media (max-width: 1040px) {
  .posts {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 800px) {
  .posts {
    grid-template-columns: repeat(1, 1fr);
  }
}
</style>
