<script lang="ts" setup>
import { ref } from "vue";
import { useUsersStore } from "../../stores/userStore";

import { isValidEmail, isValidPassword, validatePasswordComplexity } from "@/shared/utils/validators";
const startValidation = ref(false)
const email = ref("");
const password = ref("");
const store = useUsersStore()
const errorMessage = ref('');

const handleSubmit = async () => {
  startValidation.value = true;

  if (isValidEmail(email.value)) {
    const passwordError = validatePasswordComplexity(password.value);
    if (passwordError) {
      errorMessage.value = passwordError;
      return;
    }

    try {
      await store.login(email.value, password.value);
      errorMessage.value = "";
    } catch (error) {
      errorMessage.value = error;
    }
  } else {
    errorMessage.value = "Invalid email";
  }
}

</script>
<template>
  <div class="wrapper">
    <h3>Login</h3>
    <form class="form" @submit.prevent="handleSubmit">
      <input class="input" v-model="email" autocomplete="email" type="email" placeholder="Enter your email" required />
      <input class="input" v-model="password" autocomplete="current-password" type="password"
        placeholder="Enter your password" required />
      <div class="error-message">{{ errorMessage }}</div>
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

.input {
  padding: 10px;
  border-radius: 5px;
  border: none;
  background-color: var(--c-1);
  outline: none;
}

button {
  background-color: var(--c-4);
  border-radius: 5px;
  padding: 10px;
}

.invalid {
  background-color: var(--rose) !important;
}

/* input:-webkit-autofill,
input:-webkit-autofill:focus {
  transition: background-color 0s 600000s, color 0s 600000s !important;
} */

input:-webkit-autofill {
  -webkit-box-shadow: 0 0 0px 1000px var(--c-1) inset;
}

input.invalid:-webkit-autofill {
  -webkit-box-shadow: 0 0 0px 1000px var(--rose) inset;
}
</style>
