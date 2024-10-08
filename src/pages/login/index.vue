<script lang="ts" setup>
import { ref } from "vue";
import { useUsersStore } from "../../stores/userStore";

const email = ref("");
const password = ref("");
const store = useUsersStore()

const handleSubmit = () => store.login(email.value, password.value);

</script>
<template>
  <div class="wrapper">
    <h3>Login</h3>
    <form class="form" @submit.prevent="handleSubmit">
      <input v-model="email" autocomplete="email" type="email" placeholder="Enter your email" required />
      <input v-model="password" autocomplete="current-password" type="password" placeholder="Enter your password"
        required />
      <button type="submit">Login</button>
    </form>
    <GoogleLogin :callback="store.checkCredential" />
  </div>
</template>


<style scoped>
.wrapper {
  width: 100%;
  max-width: 500px;
  margin: 0 auto;
  height: calc(100% - 80px);
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 10px;
  padding-inline: 10px;
}

h3 {
  font-size: 1.7em;
  font-weight: 600;
  text-align: center;
}

.form {
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 100%;
  max-width: 500px;
}

.form input {
  padding: 10px;
  border-radius: 5px;
  border: none;
  background: var(--c-1);
  outline: none;
}

button {
  background: var(--c-4);
  border-radius: 5px;
  padding: 10px;
}
</style>
