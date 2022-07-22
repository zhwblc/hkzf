import React from "react"
import withHook from "../../utils/withHook"
// 导入 axios
import axios from 'axios'
import { Swiper, Grid } from 'antd-mobile'
import './index.css'

import Nav1 from '../../assets/images/nav-1.png'
import Nav2 from '../../assets/images/nav-2.png'
import Nav3 from '../../assets/images/nav-3.png'
import Nav4 from '../../assets/images/nav-4.png'

import SearchHeader from '../../components/SearchHeader'

// 导航菜单数据
const navs = [
  {
    id: 1,
    img: Nav1,
    title: '整租',
    path: '/home/list'
  },
  {
    id: 2,
    img: Nav2,
    title: '合租',
    path: '/home/list'
  },
  {
    id: 3,
    img: Nav3,
    title: '地图找房',
    path: '/map'
  },
  {
    id: 4,
    img: Nav4,
    title: '去出租',
    path: '/rent/add'
  }
]

class Index extends React.Component {

  state = {
    // 轮播图数据
    swipers: [],
    isSwiperLoaded: false,

    // 租房小组数据
    groups: [],

    // 最新资讯数据
    news: [],

    // 当前名称
    curCityName: '上海'
  }

  // 获取轮播图数据的方法
  async getSwipers() {
    const { data: res } = await axios.get('http://localhost:8080/home/swiper')
    // console.log('轮播图数据：', res);
    this.setState(() => {
      return {
        swipers: res.body,
        isSwiperLoaded: true
      }
    })
  }

  // 获取租房小组数据
  async getGroups() {
    const { data: res } = await axios.get('http://localhost:8080/home/groups', {
      params: {
        area: 'AREA%7C88cff55c-aaa4-e2e0'
      }
    })
    this.setState(() => {
      return {
        groups: res.body,
      }
    })
  }

  // 获取最新资讯数据
  async getNews() {
    const { data: res } = await axios.get('http://localhost:8080/home/news', {
      params: {
        area: 'AREA%7C88cff55c-aaa4-e2e0'
      }
    })
    // console.log(res);
    this.setState(() => {
      return {
        news: res.body
      }
    })
  }

  componentDidMount() {
    this.getSwipers()
    this.getGroups()
    this.getNews()

    // 通过 IP 定位获取当前城市名称
    var myCity = new window.BMapGL.LocalCity();
    myCity.get(async res => {
      var cityName = res.name;
      const { data: result } = await axios.get(`http://localhost:8080/area/info?name=${cityName}`)
      this.setState(() => {
        return {
          curCityName: result.body.label
        }
      })
    });
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

  // 渲染导航菜单
  renderNavs() {
    return navs.map(item => <Grid.Item key={item.id} onClick={() => this.props.to(item.path)}>
      <div>
        <img src={item.img} alt="" />
        <h2>{item.title}</h2>
      </div>
    </Grid.Item>)
  }

  // 渲染租房小组宫格组件
  renderGroups() {
    return this.state.groups.map(item => <Grid.Item key={item.id}>
      <div className="group-item">
        <div className="desc">
          <p className="title">{item.title}</p>
          <span className="info">{item.desc}</span>
        </div>
        <img
          src={`http://localhost:8080${item.imgSrc}`}
          alt=""
        />
      </div>
    </Grid.Item>)

  }

  // 渲染最新资讯
  renderNews() {
    return this.state.news.map(item => <li key={item.id} className="news-content">
      <div className="left">
        <img
          src={`http://localhost:8080${item.imgSrc}`}
          alt=""
        />
      </div>
      <div className="right">
        <h4>{item.title}</h4>
        <p>
          <span>{item.from}</span>
          <span>{item.date}</span>
        </p>
      </div>
    </li>)
  }

  render() {
    return (
      <div>
        {/* 轮播图 */}
        <div className="swiper">
          {this.state.isSwiperLoaded ? (<Swiper autoplay loop>{this.renderSwipers()}</Swiper>) : ('')}
          <SearchHeader cityName={this.state.curCityName} />
        </div>

        {/* 导航菜单 */}
        <Grid columns={4} gap={8} className="nav">
          {this.renderNavs()}
        </Grid>

        {/* 租房小组 */}
        <div className="group">
          <h3 className="group-title">
            租房小组 <span className="more">更多</span>
          </h3>

          <Grid columns={2} gap={5}>{this.renderGroups()}</Grid>
        </div>

        {/* 最新资讯 */}
        <div className="news">
          <h3 className="news-title">最新资讯</h3>
          <ul className="news-list">
            {this.renderNews()}
          </ul>
        </div>
      </div>
    )
  }
}

export default withHook(Index)