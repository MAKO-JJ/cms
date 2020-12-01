import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)                (是否隐藏于Sidebar侧边栏)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb  
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */
/**
  hidden: true                      是否隐藏于Sidebar侧边栏       
  alwaysShow: true					是否显示在根菜单
  redirect: noRedirect				Breadcrumb中重定向的path
  name: 'router-name'				用于keep-alive的Name
  meta: {
	roles: ['admin', 'editor'],		当前路由的访问所需要权限
	title: 'title',					Sidebar和Breadcrumb的title
	icon: 'svg-name',				Sibebar的icon
	noCache: true					是否设置不缓存
	breadcrumb: true				是否显示在Breadcrumb上
	activeMenu: '/example/list'		Sidebar高亮时的显示path
  }
**/

//权限列表.CHIEF-科长 CUSTOMHOUSE-科员 APPLICANT-申请人
export const constantRoutes = [{
    path: '/login_ems',
    name: 'login',
    component: () => import('@/views/login_ems/index'),
    hidden: true
  },
  {
    path: '/login_customs',
    name: 'login',
    component: () => import('@/views/login_customs/index'),
    hidden: true
  },
  {
    path: '/404',
    name: '404',
    component: () => import('@/views/404'),
    hidden: true
  },
]

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const asyncRoutes = [{
    path: '/',
    component: Layout,
    redirect: '/index/list',
    meta: {
      title: '重投申请',
      icon: 'dashboard'
    },
    children: [{
        path: '/index/list',
        component: () => import('@/views/apply/list'),
        name: 'index_list',
        meta: {
          title: '重投申请列表',
          icon: 'form',
          linkType: '100'
        }
      },
      {
        path: '/index/form_100',
        component: () => import('@/views/apply/form'),
        name: 'form_100',
        // 申请表格分类型：100为 重投申请类型
        meta: {
          title: '重投申请',
          icon: 'example',
          roles: ['APPLICANT'],
          linkType: 100
        }
      }
    ]
  },
  {
    path: '/chargeback',
    component: Layout,
    meta: {
      title: '退单申请',
      icon: 'nested'
    },
    children: [{
        path: '/chargeback/list',
        component: () => import('@/views/apply/list'),
        name: 'chargeback_list',
        meta: {
          title: '退单申请列表',
          icon: 'drag',
          linkType: '110,115'
        }
      },
      {
        path: '/chargeback/form_110',
        component: () => import('@/views/apply/form'),
        name: 'form_110',
        meta: {
          title: '外交邮件退单申请',
          icon: 'user',
          roles: ['APPLICANT'],
          linkType: 110
        }
      },
      {
        path: '/chargeback/form_115',
        component: () => import('@/views/apply/form'),
        name: 'form_115',
        meta: {
          title: '补录信息退单申请',
          icon: 'table',
          roles: ['APPLICANT'],
          linkType: 115
        }
      }
    ]
  },
  {
    path: '/eject',
    component: Layout,
    // redirect的使用:点击父级菜单，返回默认页
    redirect: '/eject/list',
    meta: {
      title: '货物报关出仓申请',
      icon: 'chart'
    },
    children: [{
        path: '/eject/list',
        component: () => import('@/views/apply/list'),
        name: 'eject_list',
        meta: {
          title: '货物报关出仓列表',
          icon: 'edit',
          linkType: '120'
        }
      },
      {
        path: '/eject/form_120',
        component: () => import('@/views/eject/form'),
        name: 'form_120',
        meta: {
          title: '货物报关出仓申请',
          icon: 'clipboard',
          roles: ['APPLICANT'],
          linkType: 120
        }
      }
    ]
  },
  {
    path: '/overdue',
    component: Layout,
    redirect: '/overdue/list',
    meta: {
      title: '逾期邮件出仓申请',
      icon: 'dashboard'
    },
    children: [{
        path: '/overdue/list',
        component: () => import('@/views/apply/list'),
        name: 'overdue_list',
        meta: {
          title: '逾期邮件出仓列表',
          icon: 'documentation',
          linkType: '125'
        }
      },
      {
        path: '/overdue/form_125',
        component: () => import('@/views/eject/form'),
        name: 'form_125',
        meta: {
          title: '逾期邮件出仓申请',
          icon: 'clipboard',
          roles: ['APPLICANT'],
          linkType: 125
        }
      }
    ]
  },
  {
    path: '/involved',
    component: Layout,
    redirect: '/involved/list',
    meta: {
      title: '涉案移交出仓申请',
      icon: 'bug'
    },
    children: [{
        path: '/involved/list',
        component: () => import('@/views/apply/list'),
        name: 'involved_list',
        meta: {
          title: '涉案移交出仓列表',
          icon: 'education',
          linkType: '130'
        }
      },
      {
        path: '/involved/form_130',
        component: () => import('@/views/eject/form'),
        name: 'form_130',
        meta: {
          title: '涉案移交出仓申请',
          icon: 'clipboard',
          roles: ['APPLICANT'],
          linkType: 130
        }
      }
    ]
  },
  {
    path: '/quarantine',
    component: Layout,
    redirect: '/quarantine/list',
    meta: {
      title: '检疫移交出仓申请',
      icon: 'excel'
    },
    children: [{
        path: '/quarantine/list',
        component: () => import('@/views/apply/list'),
        name: 'quarantine_list',
        meta: {
          title: '检疫移交出仓列表',
          icon: 'exit-fullscreen',
          linkType: '135'
        }
      },
      {
        path: '/quarantine/form_135',
        component: () => import('@/views/eject/form'),
        name: 'form_135',
        meta: {
          title: '检疫移交出仓申请',
          icon: 'clipboard',
          roles: ['APPLICANT'],
          linkType: 135
        }
      }
    ]
  },
  {
    path: '/supplement',
    component: Layout,
    redirect: '/supplement/list',
    meta: {
      title: '补充申报申请',
      icon: 'excel'
    },
    children: [{
        path: '/supplement/list',
        component: () => import('@/views/apply/list'),
        name: 'supplement_list',
        meta: {
          title: '补充申报列表',
          icon: 'exit-fullscreen',
          linkType: '140,145'
        }
      },
      {
        path: '/supplement/form_140',
        component: () => import('@/views/supplement/form'),
        name: 'form_140',
        meta: {
          title: '补充申报审核表',
          icon: 'clipboard',
          roles: ['APPLICANT'],
          linkType: 140
        }
      },
      {
        path: '/supplement/form_145',
        component: () => import('@/views/eject/form'),
        name: 'form_145',
        meta: {
          title: '补充申报出仓表',
          icon: 'clipboard',
          roles: ['APPLICANT'],
          linkType: 145
        }
      }
    ]
  },
  {
    path: '/transfer',
    component: Layout,
    redirect: '/transfer/list',
    meta: {
      title: '音像制品移交申请',
      icon: 'excel'
    },
    children: [{
        path: '/transfer/list',
        component: () => import('@/views/apply/list'),
        name: 'transfer_list',
        meta: {
          title: '音像制品移交申列表',
          icon: 'exit-fullscreen',
          linkType: '150,155'
        }
      },
      {
        path: '/transfer/form_150',
        component: () => import('@/views/transfer/form'),
        name: 'form_150',
        meta: {
          title: '音像制品移交审核表',
          icon: 'clipboard',
          roles: ['APPLICANT'],
          linkType: 150
        }
      },
      {
        path: '/transfer/form_155',
        component: () => import('@/views/eject/form'),
        name: 'form_155',
        meta: {
          title: '音像制品移交出仓表',
          icon: 'clipboard',
          roles: ['APPLICANT'],
          linkType: 155
        }
      }
    ]
  },
  {
    path: '/user',
    component: Layout,
    redirect: '/user/setting',
    hidden: true,
    children: [{
      path: '/user/setting',
      component: () => import('@/views/user/index'),
      name: 'user',
      meta: {
        title: '用户设置',
        icon: 'user',
      }
    }]
  },

  // 404 page must be placed at the end !!!
  {
    path: '*',
    redirect: '/404',
    hidden: true
  }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  // 现在要求点击浏览器“前进/后退”按钮，页面滚动条要记录上一次的位置，这时需要设置它的的滚动行为
  scrollBehavior: () => ({
    y: 0
  }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
// 通过新建一个全新的 Router，然后将新的 Router.matcher 赋给当前页面的管理 Router，以达到更新路由配置的目的。
// matcher 匹配器
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
