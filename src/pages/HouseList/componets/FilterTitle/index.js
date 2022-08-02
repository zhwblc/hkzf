import React from "react"
import styles from './index.module.scss'

// 条件筛选栏标题数组：
const titleList = [
  { title: '区域', type: 'area' },
  { title: '方式', type: 'rentType' },
  { title: '租金', type: 'price' },
  { title: '筛选', type: 'more' }
]

/*
  1. 通过 props 接收，高亮状态对象 titleSelectedStatus
  2. 遍历 titleList 数组，渲染标题列表
  3. 判断高亮对象中当前标题是否高亮，如果是，则添加高亮类

  4. 给标题绑定单击事件，在事件中调用父组件出传过来的方法 onClick
  5. 将当前标题 type，通过 onCilck 的参数，传递给父组件
  6. 父组件中接收当前 type， 修改该标题选中状态为 true
*/

export default class FilterTitle extends React.Component {
  render() {
    const { titleSelectedStatus, onClick } = this.props
    return (
      <div className={styles.root}>

        {titleList.map(item => {
          // item.type => area  
          const isSelected = titleSelectedStatus[item.type]
          // {/* 选中的类名：selected */ }
          return <span className={[styles.dropdown, isSelected ? styles.selected : ''].join(' ')} key={item.type} onClick={() => onClick(item.type)}>
            <span>{item.title}</span>
            <i className="iconfont icon-arrow" />
          </span>
        })}

      </div>
    )
  }
}