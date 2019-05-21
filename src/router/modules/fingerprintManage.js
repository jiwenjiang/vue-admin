/**
 * Created by j_bleach on 2019/5/16 0016.
 */
import Layout from '@/layout'

const fingerprintManageRouter = {
  path: '/fingerprintManage',
  component: Layout,
  redirect: 'noRedirect',
  name: 'fingerprintManage',
  meta: {
    title: '指纹管理',
    icon: 'component'
  },
  children: [
    {
      path: 'fingerprint',
      component: () => import('@/views/fingerprintManage/fingerprint'),
      name: 'fingerprint',
      meta: { title: '指纹管理' }
    },
    {
      path: 'fingerprintDB',
      component: () => import('@/views/fingerprintManage/fingerprintDB'),
      name: 'fingerprintDB',
      meta: { title: '指纹库管理' }
    }
  ]
}

export default fingerprintManageRouter
