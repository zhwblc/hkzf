import React from "react"
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'

// 导入首页和城市选择两个组件（页面）
import Home from './pages/Home'
import CityList from "./pages/CityList"

function App() {
  return (
    <Router>
      <div className="App">
        {/* 配置路由 */}
        <Routes>
          <Route path="/" element={<Navigate to="/home" />}></Route>
          <Route path="/home/*" element={<Home />}></Route>
          <Route path="/citylist" element={<CityList />}></Route>
        </Routes>
      </div>
    </Router>
  );
}

export default App;
