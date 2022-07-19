import React from 'react'
import { Routes, Route, Router } from 'react-router-dom'

// 导入首页和城市选择两个组件（页面）
import Home from './pages/Home'
import CityList from "./pages/CityList"
import News from './pages/News'

function route() {
  return (
    <Router>
      {/* 配置路由 */}
      <Routes>
        <Route path="/home" element={<Home />}>
          <Route path='news' element={<News />}></Route>
        </Route>
        <Route path="/citylist" element={<CityList />}></Route>
      </Routes>
    </Router>
  )
}

export default route