/**
 * Created by j_bleach on 2019/5/16 0016.
 */
import Layout from '@/layout'

const feedbackRouter = {
  path: '/feedback',
  component: Layout,
  redirect: 'noRedirect',
  name: 'feedback',
  meta: {
    title: '使用反馈',
    icon: 'component'
  },
  children: [
    {
      path: 'navEvaluate',
      component: () => import('@/views/feedback/navEvaluate'),
      name: 'navEvaluate',
      meta: { title: '导航评价' }
    },
    {
      path: 'opinionFB',
      component: () => import('@/views/feedback/opinionFB'),
      name: 'opinionFB',
      meta: { title: '意见反馈' }
    }
  ]
}

export default feedbackRouter
