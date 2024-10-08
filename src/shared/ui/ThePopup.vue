<script lang="ts" setup>

defineProps<{
  show: boolean,
  title: string
}>()

const emit = defineEmits<{
  (e: 'closePopup'): void
  (e: 'actionOfPopup'): void
}>()


</script>
<template>
  <Transition>
    <div @click.self="emit('closePopup')" v-if="show" class="overlay">
      <div class="wrapper-popup">
        <span>Delete</span>
        <h4 class="title-popup">{{ title }}</h4>
        <p>
          You are about to delete the post. Make sure this is exactly what you
          want to do.
        </p>
        <div class="buttons">
          <button class="btn-delete" @click="emit('actionOfPopup')">Delete</button>
          <button class="btn-close" @click="emit('closePopup')">Close</button>
        </div>
      </div>
    </div>
  </Transition>
</template>
<style scoped>
.overlay {
  position: fixed;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  z-index: 1;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100vw;
  height: 100vh;
  z-index: 1000;
}

.wrapper-popup {
  background: var(--white);
  max-width: 400px;
  padding: 10px;
  border-radius: 10px;
}

.title-popup {
  font-weight: 500;
}

.buttons {
  display: flex;
  align-items: center;
  justify-content: space-evenly;
  margin-top: 20px;
}

.btn-delete {
  background: rgba(255, 0, 0, 0.596);
  padding: 5px 10px;
}

.btn-close {
  background: var(--c-3);
  padding: 5px 10px;
}

@keyframes gb-popup-scale-blur {
  0% {
    opacity: 0;
    transform-origin: 50% 50%;
    transform: scale(2, 2);
    filter: blur(90px);
  }

  100% {
    opacity: 1;
    transform-origin: 50% 50%;
    transform: scale(1, 1);
    filter: blur(0px);
  }
}

.v-enter-active {
  animation: gb-popup-scale-blur 0.3s both;
}

.v-leave-active {
  animation: gb-popup-scale-blur 0.3s reverse both;
}
</style>
