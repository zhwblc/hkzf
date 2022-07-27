import React from "react"
import { Toast } from 'antd-mobile'
import withHook from "../../utils/withHook"
import axios from "axios"

import { AutoSizer, List } from 'react-virtualized'
import NavBarHeader from "../../components/NavBarHeader"

import './index.scss'

// 导入 utils 中获取当前定位城市的方法
import { gerCurrentCity } from '../../utils'

// 索引的高度
const TITLE_HEIGHT = 36
// 每个城市名称的高度
const NAME_HEIGHT = 50

// 有房源的城市
const HOUSE_CITY = ['北京', '上海', '广州', '深圳']

// 所有的行高
let ROW_HEIGHT = []

// 数据格式化的方法
// list: [{}, {}]
const formcityData = (list) => {
  const cityList = {}

  // 1. 遍历list数组
  list.forEach(item => {
    // 2. 获取每一个城市的首字母
    const first = item.short.substr(0, 1)
    // 3. 判断 cityList 是否有该分类
    if (cityList[first]) {
      // 4. 如果有，则直接push数据
      cityList[first].push(item)
    } else {
      // 5. 如果没有，则先创建一个数组，然后把当前信息添加到数组中
      cityList[first] = [item]
    }
  })

  // 获取索引数据
  const cityIndex = Object.keys(cityList).sort()

  return {
    cityList,
    cityIndex
  }
}

// 处理字母索引的方法
function formateCityIndex(letter) {
  switch (letter) {
    case '#':
      return '当前定位'
    case 'hot':
      return '热门城市'

    default:
      return letter.toUpperCase()
  }
}

class CityList extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      cityList: {},
      cityIndex: [],
      // 指定右侧字母索引列表高亮的索引号
      activeIndex: 0
    }

    // 创建ref对象
    this.cityListComponent = React.createRef()
  }

  // 获取城市列表
  async getCityList() {
    const { data: res } = await axios.get('http://localhost:8080/area/city?level=1')
    const { cityList, cityIndex } = formcityData(res.body)

    // 热门城市
    const { data: hotRes } = await axios.get('http://localhost:8080/area/hot')
    // console.log(hotRes);
    cityList['hot'] = hotRes.body
    cityIndex.unshift('hot')

    // 当前城市
    const curCity = await gerCurrentCity()
    cityList['#'] = [curCity]
    cityIndex.unshift('#')

    // console.log(cityList, cityIndex, curCity);
    this.setState(() => {
      return {
        cityList,
        cityIndex
      }
    })
  }

  changeCity({ label, value }) {
    // 判断有没有房源
    if (HOUSE_CITY.indexOf(label) > -1) {
      localStorage.setItem('hkzf_city', JSON.stringify({ label, value }))
      this.props.to(-1)
    } else {
      // 提示用户没有房源信息
      Toast.show({
        content: '没有房源信息',
        duration: 1000
      })
    }
  }

  // 渲染每一行数据的函数
  rowRenderer = ({
    key, // Unique key within array of rows
    index, // Index of row within collection
    isScrolling, // The List is currently being scrolled 当前项是否在滚动中
    isVisible, // This row is visible within the List (eg it is not an overscanned row) 当前项在list中是可见的
    style, // Style object to be applied to row (to position it) 一定要给每一行数据添加样式，这是必须项
  }) => {
    const { cityList, cityIndex } = this.state
    // console.log(cityList);
    const letter = cityIndex[index]
    return (
      <div key={key} style={style} className="city">
        <div className="title">{formateCityIndex(letter)}</div>
        {
          cityList[letter].map(item => <div className="name" key={item.value} onClick={() => { this.changeCity(item) }}>{item.label}</div>)
        }
      </div>
    );
  }

  getRowHeight = ({ index }) => {
    // 索引高度 + 城市名称高度 * 城市名称数量
    const { cityList, cityIndex } = this.state
    return TITLE_HEIGHT + NAME_HEIGHT * cityList[cityIndex[index]].length
  }

  // 渲染右侧索引的方法
  renderCityIndex = () => {
    // console.log(this.state);
    const { cityIndex, activeIndex } = this.state
    return cityIndex.map((item, index) => (
      <li className="city-index-item" key={item} onClick={() => {
        // this.cityListComponent.current.scrollToRow(index)
        let offsetHeight = 0
        for (let i = 0; i < index; i++) {
          offsetHeight += ROW_HEIGHT[i]
        }
        // 避免定位不准的问题
        offsetHeight += 2
        this.cityListComponent.current.scrollToPosition(offsetHeight)
      }}>
        {/* className="index-active" */}
        <span className={activeIndex === index ? 'index-active' : ''}>
          {item === 'hot' ? '热' : item.toUpperCase()}
        </span>
      </li>
    ))
  }

  // 获取list组件中，渲染行的信息
  onRowsRendered = ({ startIndex }) => {
    // console.log(startIndex);
    const { activeIndex } = this.state

    if (activeIndex !== startIndex) {
      this.setState({
        activeIndex: startIndex
      })
    }
  }

  // 获取所有行的高度
  getRowHeightAll = () => {
    const { cityIndex, cityList } = this.state
    cityIndex.forEach((item, index) => {
      // console.log(item, index);
      ROW_HEIGHT[index] = TITLE_HEIGHT + NAME_HEIGHT * cityList[item].length
    })
  }

  async componentDidMount() {
    await this.getCityList()

    // measureAllRows 提前计算list每一行的高度，实现 scrollToRow 的精确跳转
    // 注意：调用这个方法，需要保证 list 组件中已经有数据了！如果没有数据，就报错
    try {
      // 会渲染两遍，第一遍list没有值
      // this.cityListComponent.current.measureAllRows()
      this.getRowHeightAll()
    } catch (res) {
      // console.log(res);
    }
  }

  render() {
    return (
      <div className="citylist">
        {/* 顶部导航 */}
        {/* <NavBar onBack={() => this.props.to(-1)} className="navbar">城市选择</NavBar> */}
        <NavBarHeader className="navbar">城市选择</NavBarHeader>

        {/* 城市列表 */}
        <AutoSizer>
          {({ height, width }) => (
            <List
              ref={this.cityListComponent}
              width={width}
              height={height}
              rowCount={this.state.cityIndex.length}
              rowHeight={this.getRowHeight}
              rowRenderer={this.rowRenderer}
              onRowsRendered={this.onRowsRendered}
              scrollToAlignment='start'
            />
          )}
        </AutoSizer>

        {/* 右侧索引列表 */}
        <ul className="city-index">
          {this.renderCityIndex()}
        </ul>
      </div>
    )
  }
}

export default withHook(CityList)