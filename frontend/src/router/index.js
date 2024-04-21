import { createRouter, createWebHistory } from 'vue-router'
import Reader from '@/views/Reader.vue'
import Home from '../views/Home.vue'
import Publisher from '@/views/Publisher.vue'
import Book from '@/views/Book.vue'
import Staff from '@/views/Staff.vue'
import Borrow from '@/views/Borrow.vue'

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path:'/',
            name:'home',
            component: Home,
        },
        {
            path:"/:pathMatch(.*)*",
            name:'notfound',
            component: () => import("@/views/NotFound.vue"),
        },
        {
            path:'/reader',
            name:'reader',
            component: Reader
        },
        {
            path: '/book',
            name:'book',
            component: Book
          },
          {
            path: '/staff',
            name: 'staff',
            component: Staff
          },
          {
            path: '/publisher',
            name: 'publisher',
            component: Publisher
          },
          {
            path:'/borrow',
            name:'borrow',
            component: Borrow
          } 
    ]
});

export default router;