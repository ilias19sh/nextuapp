<script>
import Header from "@/components/Header.vue";
import { defineComponent } from "vue";
import { RouterView } from "vue-router";
import Home from "./HomeView.vue";

export default defineComponent({
  name: "DashView",
  components: { Header, Home },
});
</script>
<template>
  <Header />
  <main>
    <RouterView />
  </main>
</template>
