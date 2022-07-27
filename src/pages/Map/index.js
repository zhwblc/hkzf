// import axios from "axios"
import { API } from '../../utils/api.js'
import React from "react"
import { Toast } from 'antd-mobile'
import { Link } from "react-router-dom"
import NavBarHeader from '../../components/NavBarHeader'
import HouseItem from '../../components/HouseItem'
import withHook from "../../utils/withHook"
// import withHook from '../../utils/withHook.js'
import styles from './index.module.scss'

// 导入BASE_URL
import { BASE_URL } from '../../utils/url'

const BMapGL = window.BMapGL

// 覆盖物样式
const labelStyle = {
  cursor: 'pointer',
  border: '0px solid rgb(255, 0, 0)',
  padding: '0px',
  whiteSpace: 'nowrap',
  fontSize: '12px',
  color: 'rgb(255, 255, 255)',
  textAlign: 'center'
}

class Map extends React.Component {
  state = {
    // 小区下的房源列表
    housesList: [],
    // 表示是否展示房源列表
    isShowList: false
  }
  componentDidMount() {
    this.initMap()
  }

  // 初始化地图
  initMap() {
    // 获取当前定位城市
    const { label, value } = JSON.parse(localStorage.getItem('hkzf_city'))

    // 初始化地图实例
    // 全局对象需要用window访问
    const map = new BMapGL.Map("container");
    // 作用能够在其他方法中调用map对象
    this.map = map
    // const point = new BMapGL.Point(116.404, 39.915);
    // map.centerAndZoom(point, 15);

    //创建地址解析器实例
    var myGeo = new BMapGL.Geocoder();
    // 将地址解析结果显示在地图上，并调整地图视野
    myGeo.getPoint(label, async (point) => {
      if (point) {
        map.centerAndZoom(point, 11);
        // map.addOverlay(new BMapGL.Marker(point, { title: label }))

        // 添加常用控件
        map.addControl(new BMapGL.ScaleControl())
        map.addControl(new BMapGL.ZoomControl())

        this.renderOverLays(value)

        // // 获取房源数据
        // const { data: res } = await axios.get(`http://localhost:8080/area/map?id=${value}`)
        // res.body.forEach(item => {
        //   // 为每一条数据创建覆盖物
        //   // 创建文本覆盖物
        //   const { coord: { latitude, longitude },
        //     label: areaName,
        //     count,
        //     value: id } = item

        //   const areaPoint = new BMapGL.Point(longitude, latitude)
        //   const opts = {
        //     position: areaPoint, // 指定文本标注所在的地理位置
        //     offset: new BMapGL.Size(-35, -35) // 设置文本偏移量
        //   }
        //   // 创建文本标注对象 设置 setContent 后，第一个参数就被覆盖了
        //   const label = new BMapGL.Label('', opts)

        //   // 给label 对象一个唯一标识
        //   label.id = id

        //   // 设置房源覆盖物内容
        //   label.setContent(`
        //   <div class="${styles.bubble}">
        //     <p class="${styles.name}">${areaName}</p>
        //     <p>${count}套</p>
        //   </div>
        //  `)
        //   // 自定义文本标注样式
        //   label.setStyle(labelStyle)
        //   label.addEventListener('click', () => {
        //     console.log('房源覆盖物被点击了');
        //     console.log(label.id);
        //     // 放大地图
        //     map.centerAndZoom(areaPoint, 13);
        //     // 清除当前覆盖物信息
        //     map.clearOverlays()
        //   })
        //   map.addOverlay(label)
        // })


      }
    }, label)

    // 给地图绑定移动事件
    map.addEventListener('movestart', () => {
      // console.log('movestart')
      if (this.state.isShowList) {
        this.setState({
          isShowList: false
        })
      }
    })
  }

  // 渲染覆盖物的入口
  async renderOverLays(id) {
    try {
      // 开启loading
      const toast = Toast.show({ content: '加载中...' })
      const { data: res } = await API.get(`/area/map?id=${id}`)

      toast.close()

      const { nextZoom, type } = this.getTypeAndZoom()

      res.body.forEach(item => {
        // 创建覆盖物
        this.createOverlays(item, nextZoom, type)
      })
    } catch (err) {
      console.log(err);
      Toast.clear()
    }
  }

  // 获取地图缩放级别
  // 区 11
  // 镇 13
  // 小区 15
  getTypeAndZoom() {
    // 调用地图的 getZoom() 方法，获取当前的缩放级别
    const zoom = this.map.getZoom()
    let nextZoom, type
    // console.log(zoom);
    if (zoom >= 10 && zoom <= 12) {
      // 区
      // 下一个缩放级别
      nextZoom = 13
      // circle 表示绘制圆形覆盖物
      type = 'circle'
    } else if (zoom >= 12 && zoom <= 14) {
      // 镇
      nextZoom = 15
      type = 'circle'
    } else if (zoom >= 14 && zoom <= 16) {
      // 小区
      type = 'rect'
    }

    return { nextZoom, type }
  }

  // 创建覆盖物
  createOverlays(data, zoom, type) {

    const { coord: { latitude, longitude },
      label: areaName,
      count,
      value: id } = data

    const areaPoint = new BMapGL.Point(longitude, latitude)

    if (type === 'circle') {
      // 区或镇
      this.createCircle(areaPoint, areaName, count, id, zoom)
    } else {
      // 小区
      this.createRect(areaPoint, areaName, count, id, zoom)
    }
  }

  // 区或镇
  createCircle(areaPoint, areaName, count, id, zoom) {
    const opts = {
      position: areaPoint, // 指定文本标注所在的地理位置
      offset: new BMapGL.Size(-35, -35) // 设置文本偏移量
    }
    // 创建文本标注对象 设置 setContent 后，第一个参数就被覆盖了
    const label = new BMapGL.Label('', opts)

    // 给label 对象一个唯一标识
    label.id = id

    // 设置房源覆盖物内容
    label.setContent(`
          <div class="${styles.bubble}">
            <p class="${styles.name}">${areaName}</p>
            <p>${count}套</p>
          </div>
         `)
    // 自定义文本标注样式
    label.setStyle(labelStyle)
    label.addEventListener('click', () => {
      // 渲染下一级
      this.renderOverLays(id)
      // 放大地图
      this.map.centerAndZoom(areaPoint, zoom);
      // 清除当前覆盖物信息
      this.map.clearOverlays()

    })
    this.map.addOverlay(label)
  }

  // 小区
  createRect(areaPoint, areaName, count, id, zoom) {
    const opts = {
      position: areaPoint, // 指定文本标注所在的地理位置
      offset: new BMapGL.Size(-50, -28) // 设置文本偏移量
    }
    // 创建文本标注对象 设置 setContent 后，第一个参数就被覆盖了
    const label = new BMapGL.Label('', opts)

    // 给label 对象一个唯一标识
    label.id = id

    // 设置房源覆盖物内容
    label.setContent(`
          <div class="${styles.rect}">
            <span class="${styles.housename}">${areaName}</span>
            <span class="${styles.housenum}">${count}套</span>
            <i class="${styles.arrow}"></i>
          </div>
         `)
    // 自定义文本标注样式
    label.setStyle(labelStyle)
    label.addEventListener('click', (e) => {
      this.getHouseList(id)
      // 获取当前被点击项
      const target = e.domEvent.changedTouches[0]
      this.map.panBy(
        window.innerWidth / 2 - target.clientX,
        (window.innerHeight - 330) / 2 - target.clientY
      )
    })
    this.map.addOverlay(label)
  }

  // 获取小区房源数据
  async getHouseList(id) {
    try {
      // 开启loading
      const toast = Toast.show({ content: '加载中...' })

      const { data: res } = await API.get(`/houses?cityId=${id}`)
      console.log(res);
      // 关闭 loading
      toast.close()

      this.setState({
        housesList: res.body.list,
        // 展示房源列表
        isShowList: true
      })
    } catch (err) {
      // 关闭 loading
      // toast.close()
      console.log(err);
      Toast.clear()
    }
  }

  // 渲染房屋列表的方法
  renderHousesList() {
    return this.state.housesList.map(item => (
      <HouseItem
        onClick={() => this.props.to(`/detail/${item.houseCode}`)}
        key={item.houseCode}
        src={BASE_URL + item.houseImg}
        title={item.title}
        desc={item.desc}
        tags={item.tags}
        price={item.price}
      />
    ))
  }

  render() {
    return <div className={styles.map}>
      {/* 顶部导航 */}
      <NavBarHeader>城市选择</NavBarHeader>

      {/* 地图容器 */}
      <div id="container" className={styles.container}></div>

      {/* 房源列表 */}
      {/* 添加 styles.show 展示房屋列表 */}
      <div
        className={[
          styles.houseList,
          this.state.isShowList ? styles.show : ''
        ].join(' ')}
      >
        <div className={styles.titleWrap}>
          <h1 className={styles.listTitle}>房屋列表</h1>
          <Link className={styles.titleMore} to="/home/list">
            更多房源
          </Link>
        </div>

        <div className={styles.houseItems}>
          {/* 房屋结构 */}
          {this.renderHousesList()}
        </div>
      </div>
    </div>
  }
}

export default withHook(Map)
