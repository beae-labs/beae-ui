<script setup lang="ts">
import { Checkbox, CheckboxGroup } from "@beae-ui/vue"
import { ref } from "vue";

const checkbox = ref(["hello", "hi"])

const onChangeFromCheckboxGroup = (value: Array<string | number>) => {
  console.log("checkboxGroup from App: ", value)
}
</script>

<template>
  <div>
    <h1>Demo</h1>
    <CheckboxGroup v-model="checkbox"
      @change="onChangeFromCheckboxGroup">
      <Checkbox value="hello" colorScheme="red">
        Naruto</Checkbox>
      <Checkbox value="hi" colorScheme="orange"
        @change="($event) => console.log($event.target.checked)">
        Sasuke</Checkbox>
      <Checkbox value="greet" colorScheme="blue">
        Kakashi</Checkbox>
    </CheckboxGroup>
    Hello ca nha
    <pre>{{ checkbox }}</pre>
  </div>
</template>
