import { createRouter, createWebHistory } from 'vue-router'
import HomePage from '../pages/HomePage.vue'
import ChampionsPage from '../pages/ChampionsPage.vue'
import DraftsPage from '../pages/DraftsPage.vue'
import TeamsPage from '../pages/TeamsPage.vue'
import AboutPage from '../pages/AboutPage.vue'

const routes = [
  { path: '/', name: 'Home', component: HomePage },
  { path: '/champions', name: 'Champions', component: ChampionsPage },
  { path: '/drafts', name: 'Drafts', component: DraftsPage },
  { path: '/teams', name: 'Teams', component: TeamsPage },
  { path: '/about', name: 'About', component: AboutPage },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
