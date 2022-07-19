import React from 'react'
import { NavBar, TabBar } from 'antd-mobile'
import {
  Outlet,
  Route,
  Routes,
  useNavigate,
  useLocation,
  Navigate
} from 'react-router-dom'
import './index.css'

import News from '../News'


export default class Home extends React.Component {
  render() {
    return (
      <div>
        {/* TabBar */}
        {/* <Router initialEntries={['/home']}> */}
        <div className='app'>
          <div className='top'>
            <NavBar>配合路由使用</NavBar>
          </div>
          <div className='body'>
            {/* 路由 */}
            <Outlet />
            <Routes>
              <Route path='' element={<Navigate to='myhome' />}></Route>
              <Route path='news' element={<News />}></Route>
              <Route exact path='myhome' element={<MyHome />}></Route>
              <Route exact path='todo' element={<Todo />}></Route>
              <Route exact path='message' element={<Message />}></Route>
              <Route exact path='me' element={<PersonalCenter />}></Route>
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

const Bottom = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { pathname } = location

  const setRouteActive = (value) => {
    navigate(value)
  }

  const tabs = [
    {
      key: '/home/myhome',
      title: '首页',
      icon: <i className='iconfont icon-ind' />,
    },
    {
      key: '/home/todo',
      title: '找房',
      icon: <i className='iconfont icon-findHouse' />,
    },
    {
      key: '/home/message',
      title: '咨询',
      icon: <i className='iconfont icon-infom' />,
    },
    {
      key: '/home/me',
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

function MyHome() {
  return <div>首页</div>
}

function Todo() {
  return <div>我的待办</div>
}

function Message() {
  return <div>我的消息</div>
}

function PersonalCenter() {
  return <div>个人中心</div>
}