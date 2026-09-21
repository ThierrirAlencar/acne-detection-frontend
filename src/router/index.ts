import { createRouter, createWebHistory } from 'vue-router'
import Home from "../pages/main.vue"
import Statistics from "../pages/data.vue"
import Landing from '@/pages/landing.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {path:"/",name:"hero",component:Landing},
    {path:"/home",name:"home",component:Home},
    {path:"/data",name:"data",component:Statistics}
  ],
})

export default router
