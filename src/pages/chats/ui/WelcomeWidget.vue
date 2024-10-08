<script lang="ts" setup>

</script>
<template>
  <div class="welcome-page">
    <div class="welcome-container">
      <h1 class="welcome-title">
        Welcome to the chat of blog!
      </h1>
      <p class="welcome-message">
        Here you can chat with friends and acquaintances. Choose a chat and
        start a conversation!
      </p>
    </div>
  </div>
</template>
<style scoped>
.welcome-page {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-grow: 1;
  text-align: center;
}

.welcome-container {
  max-width: 500px;
  margin: 0 auto;
}

.welcome-title {
  color: var(--c-4);
}

.welcome-message {
  font-size: 1.3em;
  color: var(--c-3);
  margin-block: 10px;
}
</style>
