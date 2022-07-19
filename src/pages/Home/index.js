import React from 'react'
import { TabBar } from 'antd-mobile'

import {
  Route,
  Routes,
  useNavigate,
  useLocation
} from 'react-router-dom'
import './index.css'

// const News = lazy(() => import('../News'))
// const Index = lazy(() => import('../Index'))
// const HouseList = lazy(() => import('../HouseList'))
// const Profile = lazy(() => import('../Profile'))

import News from '../News'
import Index from '../Index'
import HouseList from '../HouseList'
import Profile from '../Profile'



export default class Home extends React.Component {


  render() {
    return (
      <div>
        <div className='app'>
          <div className='body'>
            {/* 路由 */}
            <Routes>
              <Route exact path='' element={<Index />}></Route>
              <Route exact path='list' element={<HouseList />}></Route>
              <Route exact path='news' element={<News />}></Route>
              <Route exact path='profile' element={<Profile />}></Route>
            </Routes>
          </div>
          <div className='bottom'>
            <Bottom />
          </div>
        </div>
        {/* </Router> */}
      </div>
    )
  }
}

// TabBar
const Bottom = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { pathname } = location

  const setRouteActive = (value) => {
    navigate(value)
  }

  const tabs = [
    {
      key: '/home',
      title: '首页',
      icon: <i className='iconfont icon-ind' />,
    },
    {
      key: '/home/list',
      title: '找房',
      icon: <i className='iconfont icon-findHouse' />,
    },
    {
      key: '/home/news',
      title: '资讯',
      icon: <i className='iconfont icon-infom' />,
    },
    {
      key: '/home/profile',
      title: '我的',
      icon: <i className='iconfont icon-my' />,
    },
  ]

  return (
    <TabBar activeKey={pathname} onChange={value => setRouteActive(value)}>
      {tabs.map(item => (
        <TabBar.Item key={item.key} icon={item.icon} title={item.title} />
      ))}
    </TabBar>
  )
}
