/**
 * Created by j_bleach on 2019/5/16 0016.
 */
import Layout from '@/layout'

const dataManageRouter = {
  path: '/dataManage',
  component: Layout,
  redirect: 'noRedirect',
  name: 'dataManage',
  meta: {
    title: '数据管理',
    icon: 'component'
  },
  children: [
    {
      path: 'mini',
      component: () => import('@/views/dataManage/miniManage'),
      name: 'mini',
      meta: { title: '小程序管理' }
    },
    {
      path: 'mapArea',
      component: () => import('@/views/dataManage/mapAreaManage'),
      name: 'mapArea',
      meta: { title: '地图区域管理' }
    },
    {
      path: 'homeType',
      component: () => import('@/views/dataManage/homeType'),
      name: 'homeType',
      meta: { title: '首页类别管理' }
    },
    {
      path: 'homeData',
      component: () => import('@/views/dataManage/homeData'),
      name: 'homeData',
      meta: { title: '首页数据管理' }
    }
  ]
}

export default dataManageRouter
