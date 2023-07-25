<script setup lang="ts">
import {ref} from 'vue';
import { Checkbox } from "@beae-ui/vue"

const checked = ref<boolean>(false);
function handleChange() {
    checked.value = !checked.value
  }
</script>

<template>
  <div class="relative bg-gray-700">
    <checkbox
      label="Basic checkbox"
      :checked="checked"
      :onChange="handleChange"
    />
  </div>
</template>

<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
