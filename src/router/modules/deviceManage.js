import Layout from '@/layout'

const deviceManageRouter = {
  path: '/deviceManage',
  component: Layout,
  redirect: 'noRedirect',
  name: 'deviceManage',
  meta: {
    title: '设备管理',
    icon: 'component'
  },
  children: [
    {
      path: 'blueTooth',
      component: () => import('@/views/deviceManage/blueTooth'),
      name: 'blueTooth',
      meta: { title: '蓝牙管理' }
    }
  ]
}

export default deviceManageRouter
