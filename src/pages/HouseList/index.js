import React from "react"
import SearchHeader from "../../components/SearchHeader"
import { gerCurrentCity } from '../../utils'
import withHook from "../../utils/withHook"
import { API } from '../../utils/api.js'
import { List, AutoSizer, WindowScroller, InfiniteLoader } from 'react-virtualized'
import { Toast } from 'antd-mobile'
import HouseItem from '../../components/HouseItem'
import { BASE_URL } from '../../utils/url.js'

import Filter from "./componets/Filter"
import Sticky from "../../components/Sticky"
import NoHouse from '../../components/NoHouse'

import styles from './index.module.scss'



class HouseList extends React.Component {
  // 初始化实例属性
  filters = {}

  // 初始化默认值
  label = ''
  value = ''

  state = {
    // 列表数据
    list: [],
    // 总条数
    count: 0,
    // 数据是否加载中
    isLoading: false
  }

  async componentDidMount() {
    const { label, value } = await gerCurrentCity()
    this.label = label
    this.value = value

    this.searcheHouseList()
  }

  // 用来获取房屋列表数据
  async searcheHouseList() {

    this.setState({
      isLoading: true
    })

    const toast = Toast.show({ content: '加载中...', icon: 'loading' })
    const { data: res } = await API.get('./houses', {
      params: {
        cityId: this.value,
        ...this.filters,
        start: 1,
        end: 20
      }
    })
    console.log(res);
    const { list, count } = res.body
    this.setState({
      list,
      count,
      isLoading: false
    })
    toast.close()
    if (count !== 0) {
      Toast.show({ content: `共找到 ${count} 套房源` })
    }
  }

  // 接收 Filter 组件中筛选条件数据
  onFilter = (filters) => {
    // 返回页面顶部
    window.scrollTo(0, 0)
    this.filters = filters

    console.log('filters', this.filters);

    // 获取房屋数据的方法
    this.searcheHouseList()
  }

  // 渲染每一行数据的函数
  renderHouseList = ({
    key, // Unique key within array of rows
    index, // Index of row within collection
    style, // Style object to be applied to row (to position it) 一定要给每一行数据添加样式，这是必须项
  }) => {
    // 根据索引号获取当前这一行的房屋数据
    const { list } = this.state
    const house = list[index]

    if (!house) {
      return (
        <div
          key={key}
          style={style}
        >
          <p className={styles.loading}>加载中...</p>
        </div>
      )
    }

    const { houseImg, title, desc, price, tags, houseCode } = house
    return (
      <HouseItem
        key={key}
        onClick={() => this.props.to(`/detail/${houseCode}`)}
        style={style}
        src={BASE_URL + houseImg}
        title={title}
        desc={desc}
        tags={tags}
        price={price}
      />
    );
  }

  // 判断列表中的每一行是否加载完成
  isRowLoaded = ({ index }) => {
    return !!this.state.list[index];
  }

  // 用来获取更多房屋列表数据
  // 注意：方法的返回值是一个 Promise 对象，并且，这个对象应该在数据加载完成时，来调用 resolve 让 Promise 对象的状态变为已完成
  loadMoreRows = ({ startIndex, stopIndex }) => {
    return new Promise(resolve => {
      API.get('./houses', {
        params: {
          cityId: this.value,
          ...this.filters,
          start: startIndex,
          end: stopIndex
        }
      }).then(res => {
        this.setState({
          list: [...this.state.list, ...res.data.body.list]
        })
        // 数据加载完成时，调用 resolve 方法
        resolve()
      })

    })
  }

  // 渲染列表数据
  renderList() {
    const { count, isLoading } = this.state
    // 关键点：在数据加载完成后，再进行 count 的判断
    // 解决方式：如果数据加载中，则不展示 NoHouse 组件；而，但数据加载完成后，再展示 NoHouse 组件
    if (count === 0 && !isLoading) {
      return <NoHouse>没有找到房源，请您换个搜索条件吧~</NoHouse>
    }

    return <InfiniteLoader
      isRowLoaded={this.isRowLoaded}
      loadMoreRows={this.loadMoreRows}
      rowCount={count}
    >
      {({ onRowsRendered, registerChild }) => (
        <WindowScroller>
          {({ height, isScrolling, scrollTop }) => (
            <AutoSizer>
              {({ width }) => {
                return (
                  <List
                    autoHeight // 设置高度为最终渲染的高度
                    width={width}
                    height={height}
                    onRowsRendered={onRowsRendered}
                    ref={registerChild}
                    rowCount={count}
                    rowHeight={120}
                    rowRenderer={this.renderHouseList}
                    isScrolling={isScrolling}
                    scrollTop={scrollTop}
                  />
                )
              }}
            </AutoSizer>
          )}
        </WindowScroller>
      )}
    </InfiniteLoader>
  }

  render() {
    return (
      <div className={styles.houseList}>
        <div className={styles.header}>
          <i
            className="iconfont icon-back"
            onClick={() => this.props.to(-1)}
          />
          <SearchHeader cityName={this.label} className={styles.searchHeader} ></SearchHeader>
        </div>

        {/* 条件筛选 */}
        <Sticky>
          <Filter onFilter={this.onFilter}></Filter>
        </Sticky>

        {/* 房屋列表 */}
        <div className={styles.houseItems}>{this.renderList()}</div>
      </div>
    )
  }
}


export default withHook(HouseList)