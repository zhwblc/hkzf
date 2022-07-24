import React from "react"
import NavBarHeader from '../../components/NavBarHeader'
// import withHook from '../../utils/withHook.js'
import './index.css'

export default class Map extends React.Component {
  componentDidMount() {
    // 初始化地图实例
    // 全局对象需要用window访问
    const map = new window.BMapGL.Map("container");
    const point = new window.BMapGL.Point(116.404, 39.915);
    map.centerAndZoom(point, 15);
  }
  render() {
    return <div className="map">
      {/* 顶部导航 */}
      <NavBarHeader className="navbar">城市选择</NavBarHeader>

      {/* 地图容器 */}
      <div id="container"></div>
    </div>
  }
}
