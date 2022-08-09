import React from "react"
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import RequireAuth from "./components/AuthRoute"

// 导入首页和城市选择两个组件（页面）
import Home from './pages/Home'
import Map from "./pages/Map"
import CityList from "./pages/CityList"

import HouseDetail from './pages/HouseDetail'
import Login from './pages//Login/'
import Registe from "./pages/Registe"

import News from './pages/News'
import Index from './pages/Index'
import HouseList from './pages/HouseList'
import Profile from './pages/Profile'

// 房源发布
import Rent from './pages/Rent'
import RentAdd from './pages/Rent/Add'
import RentSearch from './pages/Rent/Search'

import MyFavorite from "./pages/MyFavorite"

function App() {
  return (
    <Router>
      <div className="App">
        {/* 配置路由 */}
        <Routes>
          <Route exact path="/" element={<Navigate to="/home" />}></Route>

          <Route path="/home/" element={<Home />}>
            <Route path='' element={<Index />}></Route>
            <Route path='list' element={<HouseList />}></Route>
            <Route path='news' element={<News />}></Route>
            <Route path='profile' element={<Profile />}></Route>
          </Route>

          <Route path="/citylist" element={<CityList />}></Route>
          <Route path="/map" element={<Map />}></Route>
          <Route path="/detail/:id" element={<HouseDetail />} />
          <Route path="/login" element={<Login />} />
          <Route path="/registe" element={<Registe />} />

          {/* 配置登录后才能访问的页面 */}
          <Route exact path="/rent" element={<RequireAuth><Rent /></RequireAuth>} />
          <Route path="/rent/add" element={<RequireAuth><RentAdd /></RequireAuth>} />
          <Route path="/rent/search" element={<RequireAuth><RentSearch /></RequireAuth>} />
          {/* myfavorite */}
          <Route exact path="/myfavorite" element={<RequireAuth><MyFavorite /></RequireAuth>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
