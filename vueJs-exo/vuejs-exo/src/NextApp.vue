<script>
import { defineComponent } from 'vue'
import NextuView from './views/NextuView.vue'
import Header from './components/Header.vue'
import Navbar from './components/Navbar.vue'
import { RouterView } from 'vue-router'
export default defineComponent({
  name: 'NextAppview',
  components: { Header, Navbar },
})
</script>
<template>
  <RouterView />
</template>
