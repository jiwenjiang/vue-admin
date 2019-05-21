/**
 * Created by j_bleach on 2019/5/16 0016.
 */
import Layout from '@/layout'

const systemManageRouter = {
  path: '/systemManage',
  component: Layout,
  redirect: 'noRedirect',
  name: 'deviceManage',
  meta: {
    title: '系统管理',
    icon: 'component'
  },
  children: [
    {
      path: 'user',
      component: () => import('@/views/systemManage/user'),
      name: 'user',
      meta: { title: '用户管理' }
    },
    {
      path: 'role',
      component: () => import('@/views/systemManage/role'),
      name: 'role',
      meta: { title: '角色管理' }
    },
    {
      path: 'partner',
      component: () => import('@/views/systemManage/partner'),
      name: 'partner',
      meta: { title: '合作方管理' }
    },
    {
      path: 'official',
      component: () => import('@/views/systemManage/official'),
      name: 'official',
      meta: { title: '公众号管理' }
    },
    {
      path: 'run',
      component: () => import('@/views/systemManage/run'),
      name: 'run',
      meta: { title: '运行配置' }
    },
    {
      path: 'log',
      component: () => import('@/views/systemManage/log'),
      name: 'log',
      meta: { title: '系统日志' }
    },
    {
      path: 'run3',
      component: () => import('@/views/systemManage/run'),
      name: 'run3',
      meta: { title: '运行配置3' }
    }
  ]
}

export default systemManageRouter
