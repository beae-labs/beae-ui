<script setup lang="ts">
import { Radio, RadioGroup, Stack } from "@beae-ui/vue"

</script>

<template>
  <div>
    <h1>Demo</h1>
    <RadioGroup value="2">
      <Stack direction='row'>
        <Radio value='1'>First</Radio>
        <Radio value='2'>Second</Radio>
        <Radio value='3'>Third</Radio>
      </Stack>
    </RadioGroup>
  </div>
</template>
