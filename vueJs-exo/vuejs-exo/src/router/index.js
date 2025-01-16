import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import NextHomeView from '@/views/NextHomeView.vue'
import NotFoundView from '@/views/NotFoundView.vue'
import NextLoginView from '@/views/NextLoginView.vue'
import NextDashView from '@/views/NextDashView.vue'
import NextNewsView from '@/views/NextNewsView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'login',
      component: NextLoginView,
    },
    {
      path : '/dashboard',
      component : NextDashView,
      children :[
        {
          path: 'home',
          name: 'home',
          component: NextHomeView,
        },
        {
          path: 'news',
          name: 'news',
          component: NextNewsView,
        }
      ]
    },
    
    {
      path: '/:pathMatch(.*)*',
      name: 'NotFound',
      component: NotFoundView,
    }
  ],
})

router.beforeEach(async (to) => {
  const isAuthenticated = localStorage.getItem('isAuthenticated')
  if (
    !isAuthenticated &&
    to.name !== 'login'
  ) {
    return {name : 'login'}
  }
});

export default router
