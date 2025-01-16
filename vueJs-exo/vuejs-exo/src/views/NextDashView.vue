<script>
import { defineComponent } from 'vue'
import Navbar from '@/components/Navbar.vue';
import Header from '@/components/Header.vue';
import { RouterView } from 'vue-router';
export default defineComponent({
  name: 'NextDashView',
  components : {Navbar, Header}
})
</script>
<template>
  <Header />
  <div class="container">
    <Navbar />
    <main><RouterView /></main>
  </div>
</template>
