<script>
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'Navbar',
})
</script>
<template>
  <nav>
    <h2>Navigation</h2>
    <ul>
      <li><RouterLink to="/dashboard/home">Accueil</RouterLink></li>
      <li><RouterLink to="/dashboard/news">News</RouterLink></li>
    </ul>
  </nav>
</template>
