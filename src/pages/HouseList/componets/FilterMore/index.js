import React from "react"

import FilterFooter from "../../../../components/FilterFooter"

import styles from './index.module.scss'

export default class FilterMore extends React.Component {
  state = {
    selectedValues: this.props.defaultValue
  }

  onTagClick(value) {
    const { selectedValues } = this.state
    const newSelectedValues = [...selectedValues]
    if (selectedValues.indexOf(value) <= -1) {
      // 没有当前项的值
      newSelectedValues.push(value)
    } else {
      const index = newSelectedValues.findIndex(item => item === value)
      newSelectedValues.splice(index, 1)
    }

    this.setState({
      selectedValues: newSelectedValues
    })
  }

  // 取消按钮的处理
  onCancel = () => {
    this.setState({
      selectedValues: []
    })
  }

  onOk = () => {
    const { type, onSave } = this.props
    onSave(this.state.selectedValues, type)
  }

  // 渲染标签
  renderFilters(data) {
    const { selectedValues } = this.state
    return data.map(item => {
      const isSelected = selectedValues.indexOf(item.value) > -1
      return (
        <span
          className={[styles.tag, isSelected ? styles.tagActive : ''].join(' ')}
          key={item.value}
          onClick={() => this.onTagClick(item.value)}
        >
          {item.label}
        </span>
      )
    })
  }

  render() {
    const { type, onCancel, data: { roomType, oriented, floor, characteristic } } = this.props
    return (
      <div className={styles.root}>
        {/* 遮罩层 */}
        <div className={styles.mask} onClick={() => onCancel(type)}></div>

        {/* 条件内容 */}
        <div className={styles.tags}>
          <dl className={styles.dl}>
            <dt className={styles.dt}>户型</dt>
            <dd className={styles.dd}>{this.renderFilters(roomType)}</dd>

            <dt className={styles.dt}>朝向</dt>
            <dd className={styles.dd}>{this.renderFilters(oriented)}</dd>

            <dt className={styles.dt}>楼层</dt>
            <dd className={styles.dd}>{this.renderFilters(floor)}</dd>

            <dt className={styles.dt}>房屋亮点</dt>
            <dd className={styles.dd}>{this.renderFilters(characteristic)}</dd>
          </dl>
        </div>

        {/* 底部按钮 */}
        <FilterFooter
          className={styles.footer}
          cancelText="清除"
          onCancel={this.onCancel}
          onOk={this.onOk}
        ></FilterFooter>
      </div>
    )
  }
}