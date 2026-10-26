import { createRouter, createWebHistory } from 'vue-router'
import { whenElement } from '@/utils/whenElement'
import { prefetchHero } from '@/utils/heroPrefetch'

// Lazy load routes for code splitting
const Home = () => import('@/pages/Home.vue')
const Products = () => import('@/pages/Products.vue')
const ProductDetail = () => import('@/pages/ProductDetail.vue')
const About = () => import('@/pages/About.vue')
const Contact = () => import('@/pages/Contact.vue')
const Privacy = () => import('@/pages/Privacy.vue')
const Blog = () => import('@/pages/Blog.vue')
const BlogDetail = () => import('@/pages/BlogDetail.vue')
const CaseStudies = () => import('@/pages/CaseStudies.vue')
const CaseStudyDetail = () => import('@/pages/CaseStudyDetail.vue')
const NotFound = () => import('@/pages/NotFound.vue')

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home,
    },
    {
      path: '/products',
      name: 'Products',
      component: Products,
    },
    {
      path: '/products/:slug',
      name: 'ProductDetail',
      component: ProductDetail,
    },
    {
      path: '/about',
      name: 'About',
      component: About,
    },
    {
      path: '/contact',
      name: 'Contact',
      component: Contact,
    },
    {
      path: '/privacy',
      name: 'Privacy',
      component: Privacy,
    },
    {
      path: '/blog',
      name: 'Blog',
      component: Blog,
    },
    {
      path: '/blog/:slug',
      name: 'BlogDetail',
      component: BlogDetail,
    },
    {
      path: '/studi-kasus',
      name: 'CaseStudies',
      component: CaseStudies,
    },
    {
      path: '/studi-kasus/:slug',
      name: 'CaseStudyDetail',
      component: CaseStudyDetail,
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'NotFound',
      component: NotFound,
    },
  ],
  scrollBehavior(to) {
    // /#portfolio etc.: wait for the (lazy) section, then glide to it
    if (to.hash) {
      return whenElement(to.hash).then((el) =>
        el ? { el: to.hash, top: 0, behavior: 'smooth' as const } : { top: 0 },
      )
    }
    return { top: 0 }
  },
})

router.beforeEach((to) => {
  prefetchHero(to.path)
})

export default router


