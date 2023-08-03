<script setup lang="ts">
import { Checkbox, CheckboxGroup } from "@beae-ui/vue"
import { ref } from "vue";

const checkboxData = ref(["hello", "hi"])
</script>

<template>
  <div>
    <h1>Demo</h1>
    <CheckboxGroup colorScheme="green" v-model="checkboxData">
      <Checkbox value="hello">Naruto</Checkbox>
      <Checkbox value="hi">Sasuke</Checkbox>
      <Checkbox value="greet">Kakashi</Checkbox>
    </CheckboxGroup>
  </div>
</template>
