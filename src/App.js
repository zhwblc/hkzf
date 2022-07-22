import React from "react"
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'

// 导入首页和城市选择两个组件（页面）
import Home from './pages/Home'
import Map from "./pages/Map"
import CityList from "./pages/CityList"

// import News from './pages/News'
// import Index from './pages/Index'
// import HouseList from './pages/HouseList'
// import Profile from './pages/Profile'

function App() {
  return (
    <Router>
      <div className="App">
        {/* 配置路由 */}
        <Routes>
          <Route exact path="/" element={<Navigate to="/home" />}></Route>
          <Route path="/home/*" element={<Home />}></Route>
          <Route path="/citylist" element={<CityList />}></Route>
          <Route path="/map" element={<Map />}></Route>
        </Routes>
      </div>
    </Router>
  );
}

export default App;
