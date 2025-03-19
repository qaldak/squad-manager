import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import ScheduleListView from '../views/ScheduleListView.vue'
import PlayerEngagementList from '@/components/playerEngagements/PlayerEngagementList.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('@/views/AboutView.vue')
    },
    {
      path: '/players',
      name: 'Players',
      component: () => import('@/views/PlayerListView.vue')
    },
    {
      path: '/players/:id',
      name: 'Player information',
      component: () => import('@/components/players/PlayerDetail.vue'),
      props: true
    },
    {
      // static import for more performance
      path: '/schedules',
      name: 'Schedules',
      component: ScheduleListView
    },
    {
      path: '/playerEngagements',
      name: 'Player engagements',
      component: PlayerEngagementList
    }
  ]
})

export default router
