import React from "react"
// 导入 axios
import axios from 'axios'
import { Swiper, Grid } from 'antd-mobile'
import './index.css'

import Nav1 from '../../assets/images/nav-1.png'
import Nav2 from '../../assets/images/nav-2.png'
import Nav3 from '../../assets/images/nav-3.png'
import Nav4 from '../../assets/images/nav-4.png'


export default class Index extends React.Component {

  state = {
    // 轮播图数据
    swipers: []
  }

  // 获取轮播图数据的方法
  async getSwipers() {
    const { data: res } = await axios.get('http://localhost:8080/home/swiper')
    console.log('轮播图数据：', res);
    this.setState(() => {
      return {
        swipers: res.body
      }
    })
  }

  componentDidMount() {
    this.getSwipers()
  }

  // 渲染轮播图结构
  renderSwipers() {
    return this.state.swipers.map((item) => (
      <Swiper.Item key={item.id}>
        <div className="content">
          <img
            className="img"
            src={`http://localhost:8080${item.imgSrc}`}
            alt=""
          />
        </div>
      </Swiper.Item>
    ))
  }

  render() {
    return (
      <div>
        {/* 轮播图 */}
        <Swiper autoplay loop>{this.renderSwipers()}</Swiper>

        {/* 导航菜单 */}
        <Grid columns={4} gap={8}>
          <Grid.Item>
            <div className="grid-demo-item">
              <img src={Nav1} alt="" />
              <h2>整租</h2>
            </div>
          </Grid.Item>
          <Grid.Item>
            <div className="grid-demo-item">
              <img src={Nav2} alt="" />
              <h2>合租</h2>
            </div>
          </Grid.Item>
          <Grid.Item>
            <div className="grid-demo-item">
              <img src={Nav3} alt="" />
              <h2>地图导航</h2>
            </div>
          </Grid.Item>
          <Grid.Item>
            <div className="grid-demo-item">
              <img src={Nav4} alt="" />
              <h2>去出租</h2>
            </div>
          </Grid.Item>
        </Grid>
      </div>
    )
  }
}