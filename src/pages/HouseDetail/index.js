import React, { Component } from 'react'

import { Swiper, Dialog, Toast } from 'antd-mobile'
import withHook from '../../utils/withHook'

import NavHeader from '../../components/NavBarHeader'
import HouseItem from '../../components/HouseItem'
import HousePackage from '../../components/HousePackage'

// import { BASE_URL } from '../../utils/url'
// import { API } from '../../utils/api'
import { BASE_URL, API, isAuth } from '../../utils'


import styles from './index.module.css'

// 猜你喜欢
const recommendHouses = [
  {
    id: 1,
    src: BASE_URL + '/img/message/1.png',
    desc: '72.32㎡/南 北/低楼层',
    title: '安贞西里 3室1厅',
    price: 4500,
    tags: ['随时看房']
  },
  {
    id: 2,
    src: BASE_URL + '/img/message/2.png',
    desc: '83㎡/南/高楼层',
    title: '天居园 2室1厅',
    price: 7200,
    tags: ['近地铁']
  },
  {
    id: 3,
    src: BASE_URL + '/img/message/3.png',
    desc: '52㎡/西南/低楼层',
    title: '角门甲4号院 1室1厅',
    price: 4300,
    tags: ['集中供暖']
  }
]

// 百度地图
const BMap = window.BMapGL

const labelStyle = {
  position: 'absolute',
  zIndex: -7982820,
  backgroundColor: 'rgb(238, 93, 91)',
  color: 'rgb(255, 255, 255)',
  height: 25,
  padding: '5px 10px',
  lineHeight: '14px',
  borderRadius: 3,
  boxShadow: 'rgb(204, 204, 204) 2px 2px 2px',
  whiteSpace: 'nowrap',
  fontSize: 12,
  userSelect: 'none'
}

// const alert = Modal.alert

class HouseDetail extends Component {
  state = {
    // 数据加载中状态
    isLoading: false,

    // 房屋详情
    houseInfo: {
      // 房屋图片
      houseImg: [],
      // 标题
      title: '',
      // 标签
      tags: [],
      // 租金
      price: 0,
      // 房型
      roomType: '',
      // 房屋面积
      size: 0,
      // 朝向
      oriented: [],
      // 楼层
      floor: '',
      // 小区名称
      community: '',
      // 地理位置
      coord: {
        latitude: '39.928033',
        longitude: '116.529466'
      },
      // 房屋配套
      supporting: [],
      // 房屋标识
      houseCode: '',
      // 房屋描述
      description: ''
    },

    // 表示房源是否收藏
    isFavorite: false
  }

  componentDidMount() {
    // 获取配置好的路由参数：
    // console.log('路由参数对象：', this.props.match.params)
    // console.log(this.props);


    // 获取房屋数据
    this.getHouseDetail()

    // 检查房源是否收藏
    this.checkFavorite()

    window.scrollTo(0, 0)
  }

  // 检查房源是否收藏：
  async checkFavorite() {
    const isLogin = isAuth()

    if (!isLogin) {
      // 没有登陆
      return
    } else {
      // 已登录
      const { id } = this.props.params
      const { data: { status, body } } = await API.get(`/user/favorites/${id}`)
      if (status === 200) {
        // 表示请求已经成功，需要更新 isFavorite 的值
        this.setState({
          isFavorite: body.isFavorite
        })
      }
    }
  }

  /* 
    收藏房源：

    1 给收藏按钮绑定单击事件，创建方法 handleFavorite 作为事件处理程序。
    2 调用 isAuth 方法，判断是否登录。
    3 如果未登录，则使用 Modal.alert 提示用户是否去登录。
    4 如果点击取消，则不做任何操作。
    5 如果点击去登录，就跳转到登录页面，同时传递 state（登录后，再回到房源收藏页面）。
    
    6 根据 isFavorite 判断，当前房源是否收藏。
    7 如果未收藏，就调用添加收藏接口，添加收藏。
    8 如果已收藏，就调用删除收藏接口，去除收藏。

    alert('提示', '登录后才能收藏房源，是否去登录?', [
      { text: '取消' },
      {
        text: '去登录',
        onPress: () => {}
      }
    ])
  */

  handleFavorite = async () => {
    const isLogin = isAuth()

    if (!isLogin) {
      // 未登录
      return Dialog.show(
        {
          content: '是否确定退出?',
          closeOnAction: true,
          actions: [
            [{ key: 'consol', text: '取消' },
            {
              key: 'out',
              text: '去登录',
              onClick: async () => {
                this.props.to('/login', { state: { from: this.props.location } })
              }
            }]
          ]
        }
      )
    }

    // 已登录
    const { isFavorite } = this.state
    const { id } = this.props.params
    if (isFavorite) {
      // 已收藏，应该删除收藏
      const { data: { status } } = await API.delete(`/user/favorites/${id}`)
      this.setState({
        isFavorite: false
      })
      if (status === 200) {
        // 提示用户取消收藏
        Toast.show({ content: '已取消收藏' })
      } else {
        // Token 超时
        Toast.show({ content: '登录超时，请重新登录!' })
      }
    } else {
      // 未收藏，应该添加收藏
      const { data: { status } } = await API.post(`/user/favorites/${id}`)
      if (status === 200) {
        // 添加收藏成功
        Toast.show({ content: '已收藏' })
        this.setState({
          isFavorite: true
        })
      } else {
        // Token 超时
        Toast.show({ content: '登录超时，请重新登录!' })
      }
    }
  }

  // 获取房屋详细信息
  async getHouseDetail() {
    // console.log(this.props);
    const { id } = this.props.params

    // 开启loading
    this.setState({
      isLoading: true
    })

    const res = await API.get(`/houses/${id}`)

    // console.log(res.data.body)

    this.setState({
      houseInfo: res.data.body,
      isLoading: false
    })

    const { community, coord } = res.data.body

    // 渲染地图
    this.renderMap(community, coord)
  }

  // 渲染轮播图结构
  renderSwipers() {
    const {
      houseInfo: { houseImg }
    } = this.state

    return houseImg.map((item, index) => (
      <Swiper.Item key={index}>
        <a href={`${BASE_URL + item}`} target='_blank' rel="noreferrer">
          <img src={BASE_URL + item} alt="" />
        </a>
      </Swiper.Item>
    ))
  }

  // 渲染地图
  renderMap(community, coord) {
    const { latitude, longitude } = coord

    const map = new BMap.Map('map')
    const point = new BMap.Point(longitude, latitude)
    map.centerAndZoom(point, 17)

    const label = new BMap.Label('', {
      position: point,
      offset: new BMap.Size(0, -36)
    })

    label.setStyle(labelStyle)
    label.setContent(`
      <span>${community}</span>
      <div class="${styles.mapArrow}"></div>
    `)
    map.addOverlay(label)
  }

  // 渲染标签
  renderTags() {
    const {
      houseInfo: { tags }
    } = this.state

    return tags.map((item, index) => {
      // 如果标签数量超过3个，后面的标签就都展示位第三个标签的样式
      let tagClass = ''
      if (index > 2) {
        tagClass = 'tag3'
      } else {
        tagClass = 'tag' + (index + 1)
      }

      return (
        <span key={item} className={[styles.tag, styles[tagClass]].join(' ')}>
          {item}
        </span>
      )
    })
  }

  render() {
    const {
      isLoading,
      houseInfo: {
        community,
        title,
        price,
        roomType,
        size,
        floor,
        oriented,
        supporting,
        description
      },
      isFavorite
    } = this.state
    return (
      <div className={styles.root}>
        {/* 导航栏 */}
        <NavHeader
          className={styles.navHeader}
          rightContent={[<i key="share" className="iconfont icon-share" />]}
        >
          {community}
        </NavHeader>

        {/* 轮播图 */}
        <div className={styles.slides}>
          {!isLoading ? <Swiper autoplay loop autoplayInterval={5000}>
            {this.renderSwipers()}
          </Swiper >
            : ''}
        </div>

        {/* 房屋基础信息 */}
        <div className={styles.info}>
          <h3 className={styles.infoTitle}>{title}</h3>
          <div className={styles.tags}>
            <div>{this.renderTags()}</div>
          </div>

          <div className={styles.infoPrice}>
            <div className={styles.infoPriceItem}>
              <div>
                {price}
                <span className={styles.month}>/月</span>
              </div>
              <div>租金</div>
            </div>
            <div className={styles.infoPriceItem}>
              <div>{roomType}</div>
              <div>房型</div>
            </div>
            <div className={styles.infoPriceItem}>
              <div>{size}平米</div>
              <div>面积</div>
            </div>
          </div>

          <div className={styles.infoBasic}>
            <div className={styles.infoBasicItem}>
              <div style={{ flex: 1 }}>
                <span className={styles.title}>装修：</span>
                精装
              </div>
              <div style={{ flex: 1 }}>
                <span className={styles.title}>楼层：</span>
                {floor}
              </div>
            </div>
            <div className={styles.infoBasicItem}>
              <div style={{ flex: 1 }}>
                <span className={styles.title}>朝向：</span>
                {oriented.join('、')}
              </div>
              <div style={{ flex: 1 }}>
                <span className={styles.title}>类型：</span>普通住宅
              </div>
            </div>
          </div>
        </div>

        {/* 地图位置 */}
        <div className={styles.map}>
          <div className={styles.mapTitle}>
            小区：
            <span>{community}</span>
          </div>
          <div className={styles.mapContainer} id="map">
            地图
          </div>
        </div>

        {/* 房屋配套 */}
        <div className={styles.about}>
          <div className={styles.houseTitle}>房屋配套</div>
          {/* <HousePackage list={supporting} /> */}
          {/* <div className="title-empty">暂无数据</div> */}

          {supporting.length === 0 ? (
            <div className={styles.titleEmpty}>暂无数据</div>
          ) : (
            <HousePackage list={supporting} />
          )}
        </div>

        {/* 房屋概况 */}
        <div className={styles.set}>
          <div className={styles.houseTitle}>房源概况</div>
          <div>
            <div className={styles.contact}>
              <div className={styles.user}>
                <img src={BASE_URL + '/img/avatar.png'} alt="头像" />
                <div className={styles.useInfo}>
                  <div>王女士</div>
                  <div className={styles.userAuth}>
                    <i className="iconfont icon-auth" />
                    已认证房主
                  </div>
                </div>
              </div>
              <span className={styles.userMsg}>发消息</span>
            </div>

            <div className={styles.descText}>
              {description || '暂无房屋描述'}
            </div>
          </div>
        </div>

        {/* 推荐 */}
        <div className={styles.recommend}>
          <div className={styles.houseTitle}>猜你喜欢</div>
          <div className={styles.items}>
            {recommendHouses.map(item => (
              <HouseItem {...item} key={item.id} />
            ))}
          </div>
        </div>

        {/* 底部收藏按钮 */}
        <div className={styles.fixedBottom}>
          <div onClick={this.handleFavorite}>
            <img
              src={
                BASE_URL + (isFavorite ? '/img/star.png' : '/img/unstar.png')
              }
              className={styles.favoriteImg}
              alt="收藏"
            />
            <span className={styles.favorite}>
              {isFavorite ? '已收藏' : '收藏'}
            </span>
          </div>
          <div>在线咨询</div>
          <div>
            <a href="tel:400-618-4000" className={styles.telephone}>
              电话预约
            </a>
          </div>
        </div>
      </div>
    )
  }
}

export default withHook(HouseDetail)
