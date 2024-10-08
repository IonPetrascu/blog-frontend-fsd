<script lang="ts" setup>
import TheHeader from '../shared/ui/TheHeader.vue';
import { useUsersStore } from '../stores/userStore';
import { ref, watch, onMounted } from 'vue';
import { useRoute } from "vue-router";
import type { Ref } from 'vue';


const store = useUsersStore()
const transitionName: Ref<string> = ref("fade");
const route = useRoute();

onMounted(() => {
  store.getMyInfo();
})

watch(
  () => route.path,
  (newPath) => {
    if (newPath.split("/")[1] === "post") {
      transitionName.value = "slide";
    } else {
      transitionName.value = "fade";
    }
  },
  { immediate: true }
);

</script>
<template>
  <main class="main">
    <TheHeader />
    <router-view v-slot="{ Component }">
      <transition :name="transitionName" mode="out-in">
        <component :is="Component" />
      </transition>
    </router-view>
  </main>
</template>
<style scoped>
.main {
  background: var(--white);
  background-size: cover;
  height: 100vh;
  max-width: 1320px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
}

.fade-enter-active,
.fade-leave-active {
  transition: all 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: scale(0.97);
}

.slide-enter-active,
.slide-leave-active {
  transition: all 0.5s ease;
}

.slide-enter-from,
.slide-leave-to {
  opacity: 0;
  transform: scale(0.9);
}
</style>
