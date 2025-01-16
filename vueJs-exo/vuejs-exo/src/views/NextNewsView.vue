<script>
import { defineComponent } from 'vue';
import { getNews, getPost } from '@/api/NewsApi';
export default defineComponent({
  name: 'nextnews',
  data() {
    return {
      news : [],
      posts : [],
    }
  },
  async mounted() {
    this.news = await getNews();
    this.posts = await getPost();
    console.log(this.posts)
  }

})
</script>
<template>
  <div  v-for="(nw,i) in news">
        <h1>{{nw.title}}</h1>
        <h2>{{nw.description}}</h2>
        <img :src = "nw.urlToImage"/>
        </div>
</template>
<style>
.news-container {
    max-width: 800px;
    margin: 0 auto;
    padding: 20px;
}
.news-item {
    border-bottom: 1px solid #ccc;
    padding: 15px 0;
}
.news-item img {
    max-width: 100%;
    height: auto;
}
</style>
