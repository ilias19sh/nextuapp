<script>
import { defineComponent } from 'vue'
export default defineComponent({
  name: 'NextuView',
  data() {
    return {
      message: 'hello',
      user: {
        id: 1,
        name: 'ilias',
        status: false,
        posts: [
          { id: 1, title: 'kbvvsjlvs', description: 'hbkcbcq' },
          { id: 2, title: 'test2', description: 'description2' },
        ],
      },
    }
  },
  methods: {
    sayhello() {
      console.log('hello')
    },
  },
})
</script>
<template>
  <p v-if="user.status">hello {{ user.name }}</p>
  <ul>
    <li v-for="(post, i) in user.posts">
      {{ post.title }}
    </li>
  </ul>

  <div v-on:click="sayhello">say hello</div>
</template>
