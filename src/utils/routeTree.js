/**
 * Created by j_bleach on 2019/5/21 0021.
 */
import Layout from '@/layout'

const transform = (data) => {
  return data.map(v => {
    if (v.parentId) {
      return {
        authorityId: v.authorityId,
        parentId: v.parentId,
        path: v.content,
        // component: () => import(`../views/systemManage/partner`),
        component: () => import(`../views/${v.route}`),
        name: v.content,
        meta: { title: v.name }
      }
    } else {
      return {
        authorityId: v.authorityId,
        parentId: v.parentId,
        path: v.route,
        component: Layout,
        redirect: 'noRedirect',
        name: v.content,
        meta: {
          title: v.name,
          icon: 'component'
        }
      }
    }
  })
}

const treeData = (list) => {
  const temp = list
  // 以id为键，当前对象为值，存入一个新的对象中
  const tempObj = {}
  for (const i in temp) {
    tempObj[temp[i].authorityId] = temp[i]
  }
  return temp.filter(father => {
    // 把当前节点的所有子节点找到
    const childArr = temp.filter(child => father.authorityId === child.parentId)
    childArr.length > 0 ? father.children = childArr : ''
    // 只返回第一级数据；如果当前节点的fatherId不为空，但是在父节点不存在，也为一级数据
    return father.parentId === null || !tempObj[father.parentId]
  })
}

const handleTree = (data) => {
  const result = transform(data)
  const transTree = treeData(result)
  return transTree
}

export default handleTree
