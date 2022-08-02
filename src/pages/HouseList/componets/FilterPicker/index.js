import React from "react"
import { CascadePickerView } from 'antd-mobile'
import FilterFooter from "../../../../components/FilterFooter"
// import styles from './index.module.scss'


/*
  1. 点击前三个标题展示该组件，点击取消按钮或空白区域隐藏该组件
  2. 使用 CascadePickerView  组件展示筛选条件数据
  3. 获取到 CascadePickerView  中选中的筛选条件值
  4. 点击确定按钮，隐藏该组件，将获取到的筛选条件值传递该父组件
  5. 显示或隐藏对话框的状态：由父组件提供（状态提升），通过 props 传递给子组件
  5. 筛选条件数据：由父组件提供（因为所有筛选条件是通过一个接口获取的），通过 props 传递给子组件
*/

export default class FilterPicker extends React.Component {
  state = {
    value: this.props.defaultVlaue
  }
  render() {
    const { onCancel, onSave, data, type } = this.props
    const { value } = this.state
    return (
      <>
        {/* 选择器组件 */}
        <CascadePickerView options={data} value={value} onChange={val => {
          let newVal = val.filter(n => n)
          // console.log(val);
          this.setState({
            value: newVal
          })
        }} />

        {/* 底部按钮 */}
        <FilterFooter onCancel={() => onCancel(type)} onOk={() => onSave(value, type)} />
      </>
    )
  }
}