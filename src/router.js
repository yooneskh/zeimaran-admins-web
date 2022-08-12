import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/auth',
      component: () => import('./views/auth/auth-page.vue' /* webpackChunkName: 'auth-page' */)
    },
    {
      path: '/',
      component: () => import('./views/core/main-base.vue' /* webpackChunkName: 'main-base' */),
      children: [

        /* home */
        {
          path: '/',
          component: () => import('./views/home/home-page.vue' /* webpackChunkName: 'home-page' */)
        },

        /* profile */
        {
          path: '/profile',
          component: () => import('./views/profile/profile-base.vue' /* webpackChunkName: 'profile-base' */),
          children: [
            {
              path: '/',
              component: () => import('./views/profile/profile-part-information.vue' /* webpackChunkName: 'profile-part-information' */)
            },
            {
              path: '/profile/tickets/new',
              component: () => import('./views/profile/profile-part-tickets-new.vue' /* webpackChunkName: 'profile-part-tickets-new' */)
            },
            {
              path: '/profile/tickets',
              component: () => import('./views/profile/profile-part-tickets-list.vue' /* webpackChunkName: 'profile-part-tickets-list' */)
            },
            {
              path: '/profile/tickets/:ticketId',
              component: () => import('./views/profile/profile-part-tickets-single.vue' /* webpackChunkName: 'profile-part-tickets-single' */)
            }
          ]
        },

        /* management */
        {
          path: 'settings/live-registration',
          component: () => import('./views/manage/manage-setting-page.vue' /* webpackChunkName: 'manage-setting-page' */),
          meta: {
            icon: 'mdi-cog-play',
            title: 'تنظیمات ثبت‌نام لایو',
            model: 'LiveRegistrationSettings',
            pathSuffix: '/settings/live-registration'
          }
        },
        {
          path: 'live-registrations',
          component: () => import('./views/manage/manage-resource-page.vue' /* webpackChunkName: 'manage-resource-page' */),
          meta: {
            title: 'مدیریت ثبت‌نام‌های لایو',
            icon: 'mdi-play',
            model: 'LiveRegistration'
          }
        },
        {
          path: 'users',
          component: () => import('./views/manage/manage-resource-page.vue' /* webpackChunkName: 'manage-resource-page' */),
          meta: {
            title: 'مدیریت کاربران',
            icon: 'mdi-account',
            model: 'User'
          }
        },
        {
          path: 'authorization-tokens',
          component: () => import('./views/manage/manage-resource-page.vue' /* webpackChunkName: 'manage-resource-page' */),
          meta: {
            title: 'مدیریت بلیط ورود',
            icon: 'mdi-ticket',
            model: 'AuthorizationToken'
          }
        },
        {
          path: 'authorization-roles',
          component: () => import('./views/manage/manage-resource-page.vue' /* webpackChunkName: 'manage-resource-page' */),
          meta: {
            title: 'مدیریت سطح دسترسی',
            icon: 'mdi-ticket',
            model: 'AuthorizationRole'
          }
        },
        {
          path: 'factors',
          component: () => import('./views/manage/manage-resource-page.vue' /* webpackChunkName: 'manage-resource-page' */),
          meta: {
            title: 'مدیریت فاکتورها',
            icon: 'mdi-cash',
            model: 'Factor'
          }
        },

      ]
    },
    {
      path: '*',
      component: () => import('./views/error/404-page' /* webpackChunkName: '404-page' */)
    }
  ],
  scrollBehavior(to, _from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    }
    else if (to.hash) {
      return {
        selector: to.hash,
        offset: {
          x: 0,
          y: 10
        }
      }
    }
    else {
      return { x: 0, y: 0 }
    }
  }
});
