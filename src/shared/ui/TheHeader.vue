<script lang="ts" setup>
import { useUsersStore } from '@/stores/userStore';

const store = useUsersStore()

</script>
<template>
  <header class="header">
    <router-link to="/">
      <div class="logo">Blog</div>
    </router-link>
    <nav v-if="!store.isAuthenticated" class="nav">
      <RouterLink class="link" to="/register">Registration</RouterLink>
      <RouterLink class="link" to="/login">Authorisation</RouterLink>
    </nav>
    <nav v-else class="nav">
      <RouterLink class="link" to="/">Posts</RouterLink>
      <RouterLink class="link" to="/post-write">Create post</RouterLink>
      <RouterLink class="link" :to="`/profile/${store.user?.id}`">Profile</RouterLink>
      <RouterLink class="link" to="/chats">Chats</RouterLink>
      <button class="exit-btn" @click="store.logout">
        <img src="@/assets/icons/exit.svg" alt="exit" />
      </button>
    </nav>
  </header>
</template>
<style scoped>
.logo {
  color: var(--c-4);
  font-size: 2em;
  font-weight: 700;
}

.header {
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px;
  position: relative;
  color: var(--black);
}

.header::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: inherit;
  filter: blur(5px);
  z-index: -1;
}

.nav {
  display: flex;
  gap: 15px;
}

.link {
  font-size: 1.2em;
  color: var(--c-4);
  font-weight: 500;
}

.link:hover {
  color: var(--rose);
}

.exit-btn {
  width: 20px;
}

.exit-btn img {
  width: 100%;
}

:root {
  --blue: #180161;
  --violet: #4f1787;
  --rose: #eb3678;
  --orange: #fb773c;
  --white: #ffffff;
  --black: #0c0c0c;
  --gray: #d3d1d1;

  --c-1: #e5d9f2;
  --c-2: #f5efff;
  --c-3: #cdc1ff;
  --c-4: #a594f9;
}

#app {
  min-height: 100vh;
}

.router-link-active {
  color: var(--rose) !important;
}
</style>
