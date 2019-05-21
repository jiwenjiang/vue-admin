/**
 * Created by j_bleach on 2019/5/16 0016.
 */
import Layout from '@/layout'

const personalRouter = {
  path: '/personal',
  component: Layout,
  redirect: 'noRedirect',
  name: 'personal',
  meta: {
    title: '个人中心',
    icon: 'component'
  },
  children: [
    {
      path: 'blueTooth',
      component: () => import('@/views/personal/personal'),
      name: 'blueTooth',
      meta: { title: '个人中心' }
    }
  ]
}

export default personalRouter
