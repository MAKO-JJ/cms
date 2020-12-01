import router from './router'
import store from './store'
import { Message } from 'element-ui'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import { getToken,getType } from '@/utils/auth' // get token from cookie
import getPageTitle from '@/utils/get-page-title'

NProgress.configure({ showSpinner: false }) // NProgress Configuration

const whiteList = ['login'] // 登录白名单

router.beforeEach(async (to, from, next) => {
  // 进度条开启
  NProgress.start();

  // set page title
  document.title = getPageTitle(to.meta.title);

  //权限列表.CHIEF-科长 CUSTOMHOUSE-科员 APPLICANT-申请人
  // 路由拦截，获取token
  const hasToken = getToken()
  // 代表已经登陆过了
  if (hasToken) {
    if (to.path === '/login_ems' || to.path === '/login_customs') {
      // if is logged in, redirect to the home page
      next({path: '/'});

      NProgress.done()
    } else {
      const hasRoles = store.getters.roles && store.getters.roles.length > 0
      if (hasRoles) {
        next() // 记得放行
      } else {
        try {
          // 获取用户路由权限
          const { roles } = await store.dispatch('user/getInfo');

          // 过滤路由表
          const accessRoutes = await store.dispatch('permission/generateRoutes', roles);

          // 动态添加路由前，要加上这一步，保证 addRoutes() 生效
          router.options.routes = accessRoutes;

          // 动态添加路由
          router.addRoutes(accessRoutes);

          // 设置replace:true，这样导航就不会留下历史记录
          next({ ...to, replace: true });
        } catch (error) {
          // remove token and go to login page to re-login
          await store.dispatch('user/resetToken')
          Message.error(error || 'Has Error')
          let path = getType();
          next(`${path}?redirect=${to.path}`)
          NProgress.done()
        }
      }
    }
  } else {
    /* has no token*/
    // 在免费登录白名单中，直接进入
    if (whiteList.indexOf(to.name) !== -1) {
      next()
      NProgress.done();
    } else {
      // 不在白名单中的页面，重定向到登录页面，需要有token，并且获取用户信息，
      // next(`/login?type=${to.query.type}`);
      NProgress.done();
    }
  }
})

router.afterEach(() => {
  // 进度条关闭
  NProgress.done()
})
