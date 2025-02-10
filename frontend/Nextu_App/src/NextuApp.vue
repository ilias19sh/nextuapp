<script>
import { defineComponent } from "vue";
import { RouterView } from "vue-router";
import Header from "./components/Header.vue";

export default defineComponent({
  name: "NextuAppView",
  components: { Header },
});
</script>
<template>
  <RouterView />
</template>
