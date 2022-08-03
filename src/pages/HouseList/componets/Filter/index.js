import React from "react"
import { Spring, animated } from 'react-spring'
import { API } from '../../../../utils/api'
import { gerCurrentCity } from '../../../../utils'

import FilterTitle from "../FilterTitle"
import FilterPicker from "../FilterPicker"
import FilterMore from "../FilterMore"

import styles from './index.module.scss'

/*
  控制 FilterPicker 组件的显示和隐藏：

  1. 在 Filter 组件中，提供控制对话框显示和隐藏的状态： openType(表示展示的对话框类型)
  2. 在 render 中判断 openType 值为 area/rentType/price 时，就展示 FilterPicker 组件，以及遮罩层
  3. 在 onTitleClick 方法中，修改状态 openType 为当前 type，展示对话框
  4. 在 Filter 组件中，提供 onCancel 方法，作为取消按钮和遮罩层的事件处理程序
  5. 在 onCancel 方法中，修改状态 openType 为空，隐藏对话框
  6. 将 onCancel 通过 props 传递给 FilterPicker 组件，在取消按钮的单击事件中调用该方法
  7. 在 Filter 组件中，提供 onSave 方法，作为确定按钮的事件处理程序，逻辑同上
*/

// 标题高亮状态
// true 表示高亮； false 表示不高亮
const titleSelectedStatus = {
  area: false,
  rentType: false,
  price: false,
  more: false
}

const openType3 = ['area', 'rentType', 'price']

// FilterPicker 和 FilterMore 组件的选中值
const selectedValues = {
  area: ['area', 'null'],
  rentType: ['null'],
  price: ['null'],
  more: []
}

export default class Filter extends React.Component {
  htmlBody = null
  state = {
    // 控制标题的高亮
    titleSelectedStatus,
    // 控制 FilterPicker 或 FilterMore 组件的展示或隐藏
    openType: '',
    // 所有筛选条件数据
    filtersData: {},
    // 筛选条件的选中值
    selectedValues
  }

  componentDidMount() {
    // 获取 body
    this.htmlBody = document.body

    this.getFiltersData()
  }

  // 封装获取所有筛选条件的方法
  async getFiltersData() {
    // 获取当前定位城市 id
    const { value } = await gerCurrentCity()

    const { data: res } = await API.get(`/houses/condition?id=${value}`)
    this.setState({
      filtersData: res.body
    })
  }

  // 点击标题菜单实现高亮
  // 待完成
  onTitleClick = (type) => {

    // 给 body 添加样式
    this.htmlBody.className = 'body-fixed'

    const { titleSelectedStatus, selectedValues } = this.state
    // 创建新的标题选中状态对象
    const newTitleSelectedStatus = { ...titleSelectedStatus }

    // 遍历标题选中状态对象
    Object.keys(titleSelectedStatus).forEach(item => {
      const selecrVal = selectedValues[item]
      if (item === type) {
        // 当前标题
        newTitleSelectedStatus[type] = true
      } else if (item === 'area' && (selecrVal.length !== 2 || selecrVal[0] !== 'area')) {
        // 其他标题
        newTitleSelectedStatus[item] = true
      } else if ((item === 'rentType' || item === 'price') && selecrVal[0] !== 'null') {
        newTitleSelectedStatus[item] = true
      } else if (item === 'more' && selecrVal.length !== 0) {
        // 更多选择
        newTitleSelectedStatus[item] = true
      } else {
        newTitleSelectedStatus[item] = false
      }
    })

    this.setState((prevState) => {
      return {
        titleSelectedStatus: newTitleSelectedStatus,
        // 展示对话框
        openType: type
      }
    })
  }

  // 取消（隐藏对话框）
  onCancel = (type) => {
    // 给 body 添加样式
    this.htmlBody.className = ''

    const { titleSelectedStatus, selectedValues } = this.state
    // 创建新的标题选中状态对象
    const newTitleSelectedStatus = { ...titleSelectedStatus }

    const selecrVal = selectedValues[type]
    if (type === 'area' && (selecrVal.length !== 2 || selecrVal[0] !== 'area')) {
      // 其他标题
      newTitleSelectedStatus[type] = true
    } else if ((type === 'rentType' || type === 'price') && selecrVal[0] !== 'null') {
      newTitleSelectedStatus[type] = true
    } else if (type === 'more' && selecrVal.length !== 0) {
      // 更多选择
      newTitleSelectedStatus[type] = true
    } else {
      newTitleSelectedStatus[type] = false
    }

    this.setState({
      openType: '',
      titleSelectedStatus: newTitleSelectedStatus
    })
  }

  // 确定（隐藏对话框）
  onSave = (value, type) => {

    // 给 body 添加样式
    this.htmlBody.className = ''

    const { titleSelectedStatus, selectedValues } = this.state
    // 创建新的标题选中状态对象
    const newTitleSelectedStatus = { ...titleSelectedStatus }

    // 菜单高亮逻辑处理
    if (type === 'area' && (value.length !== 2 || value[0] !== 'area')) {
      // 其他标题
      newTitleSelectedStatus[type] = true
    } else if ((type === 'rentType' || type === 'price') && value[0] !== 'null') {
      newTitleSelectedStatus[type] = true
    } else if (type === 'more' && value.length !== 0) {
      // 更多选择
      newTitleSelectedStatus[type] = true
    } else {
      newTitleSelectedStatus[type] = false
    }

    // 最新的选中值
    const newSelectedValues = {
      ...selectedValues,
      [type]: value
    }
    const { area, rentType, price, more } = newSelectedValues

    // 筛选条件数据
    const filters = {}

    // 区域
    const areaKey = area[0]
    let areaValue = 'null'
    if (area.length === 3) {
      areaValue = area[2] !== 'null' ? area[2] : area[1]
    } else if (area.length === 4) {
      areaValue = area[3] !== 'null' ? area[3] : area[2]
    }
    filters[areaKey] = areaValue

    // 方式和租金
    filters.rentType = rentType[0]
    filters.price = price[0]

    // 更多
    filters.more = more.join(',')

    // console.log(filters);

    // 调用父组件中的方法，来将筛选数据传递给父组件
    this.props.onFilter(filters)

    this.setState(prevState => {
      return {
        openType: '',
        selectedValues: newSelectedValues,
        titleSelectedStatus: newTitleSelectedStatus
      }
    })
  }

  // 渲染 FilterPicker 组件
  renderFilterPicker() {
    const { selectedValues, openType, filtersData: { area, subway, rentType, price } } = this.state
    // 根据 openType 来拿到当前筛选条件数据
    let data = []
    let defaultVlaue = selectedValues[openType]
    switch (openType) {
      case 'area':
        // 获取到 区域数据
        data = [area, subway]
        break;
      case 'rentType':
        // 获取到 方式数据
        data = rentType
        break;
      case 'price':
        // 获取到 方式数据
        data = price
        break;
      default:
        break;
    }

    // 为了每一次切换都重新创建组件，对组件进行初始化，添加 key 值
    return openType3.includes(openType)
      ? <FilterPicker
        onCancel={this.onCancel}
        onSave={this.onSave}
        data={data}
        type={openType}
        defaultVlaue={defaultVlaue}
        key={openType} />
      : ''
  }

  // 渲染 FilterMore 组件
  renderFilterMore() {
    const { selectedValues, openType, filtersData: { roomType, oriented, floor, characteristic } } = this.state

    const data = { roomType, oriented, floor, characteristic }

    const defaultValue = selectedValues.more

    return (
      openType === 'more'
        ? <FilterMore
          data={data}
          onSave={this.onSave}
          type={openType}
          defaultValue={defaultValue}
          onCancel={this.onCancel}
        />
        : ''
    )
  }

  // 渲染遮罩层div
  renderMask() {
    const { openType } = this.state
    const toggel = [...openType3].includes(openType)
    return <Spring
      // from={{ opacity: 0 }}
      // to={{ opacity: 1 }}
      to={{ opacity: toggel ? 1 : 0, display: toggel ? 'block' : 'none' }}
    >
      {
        props => (
          <animated.div
            style={props}
            className={styles.mask}
            onClick={() => this.onCancel(openType)}
          ></animated.div>
        )
      }
    </Spring>
  }

  render() {
    const { titleSelectedStatus } = this.state
    return (
      <div className={styles.root}>
        {/* 前三个菜单的遮罩层 */}
        {
          this.renderMask()
        }

        <div className={styles.content}>
          {/* 标题栏 */}
          <FilterTitle titleSelectedStatus={titleSelectedStatus} onClick={this.onTitleClick} />

          {/* 前三个菜单对应的内容 */}
          {
            this.renderFilterPicker()
          }

          {/* 最后一个菜单对应的内容 */}
          {this.renderFilterMore()}
        </div>
      </div>
    )
  }
}