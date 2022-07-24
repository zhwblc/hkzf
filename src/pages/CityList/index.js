import React from "react"

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
  state = {
    cityList: {},
    cityIndex: []
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
          cityList[letter].map(item => <div className="name" key={item.value}>{item.label}</div>)
        }
      </div>
    );
  }

  getRowHeight(index) {
    console.log(index);
    return 100
  }

  componentDidMount() {
    this.getCityList()
  }

  render() {
    return (
      <div>这是城市选择页面</div>
    )
  }
}