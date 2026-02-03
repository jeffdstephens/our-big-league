import { createRouter, createWebHistory } from 'vue-router'
import HomePage from '../pages/HomePage.vue'
import ChampionsPage from '../pages/ChampionsPage.vue'
import DraftsPage from '../pages/DraftsPage.vue'
import DraftDetailPage from '../pages/DraftDetailPage.vue'
import TeamsPage from '../pages/TeamsPage.vue'
import AboutPage from '../pages/AboutPage.vue'
import AdminPage from '../pages/AdminPage.vue'
import EditTeamPage from '../pages/EditTeamPage.vue'
import { useAuth } from '../composables/useAuth'

const routes = [
  { path: '/', name: 'Home', component: HomePage },
  { path: '/champions', name: 'Champions', component: ChampionsPage },
  { path: '/drafts', name: 'Drafts', component: DraftsPage },
  { path: '/drafts/:year', name: 'DraftDetail', component: DraftDetailPage },
  { path: '/teams', name: 'Teams', component: TeamsPage },
  { path: '/about', name: 'About', component: AboutPage },
  {
    path: '/admin',
    name: 'Admin',
    component: AdminPage,
    meta: { requiresAuth: true, requiresAdmin: true }
  },
  {
    path: '/admin/teams/:id',
    name: 'EditTeam',
    component: EditTeamPage,
    meta: { requiresAuth: true, requiresAdmin: true }
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

// Navigation guard for protected routes
router.beforeEach((to, from, next) => {
  const { isAuthenticated, isAdmin, loading } = useAuth()

  // Check if route requires authentication
  if (to.meta.requiresAuth) {
    // Wait for auth to initialize if still loading
    if (loading.value) {
      // Auth still initializing, allow navigation (component will handle redirect)
      next()
      return
    }

    if (!isAuthenticated.value) {
      // Not authenticated, redirect to home
      next({ name: 'Home' })
      return
    }

    // Check if route requires admin
    if (to.meta.requiresAdmin && !isAdmin.value) {
      // Not admin, redirect to home
      next({ name: 'Home' })
      return
    }
  }

  next()
})

export default router
