<script>
import { defineComponent } from 'vue'
import ChildOne from './views/childrenView.vue'
import ChildTwo from './views/childtwoView.vue'

export default defineComponent({
  name: 'ParentComponent',
  components: { ChildOne, ChildTwo },
})
</script>
<template>
  <ChildOne />
  <ChildTwo />
</template>
