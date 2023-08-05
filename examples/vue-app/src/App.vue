<script setup lang="ts">
import { Radio, RadioGroup } from "@beae-ui/vue"
import { ref } from "vue";

const radio = ref("hello")

const onChangeFromRadioGroup = (event: Event) => {
  console.log("radioGroup from App: ", (event.target as HTMLInputElement).value)
}
</script>

<template>
  <div>
    <h1>Demo</h1>
    <RadioGroup colorScheme="green" v-model="radio" @change="onChangeFromRadioGroup">
      <Radio value="hello">Naruto</Radio>
      <Radio value="hi" @change="($event) => console.log($event)">Sasuke</Radio>
      <Radio value="greet">Kakashi</Radio>
    </RadioGroup>
    Hello ca nha <pre>{{ radio }}</pre>
  </div>
</template>
