import React from "react"
import { useNavigate } from 'react-router-dom'
import './index.css'

const SearchHeader = ({ cityName }) => {
  const navigate = useNavigate()
  return (
    <div className="search-box">
      <div className="search-content">
        <div className="location" onClick={() => navigate('/citylist')}>
          <span className="name">{cityName}</span>
          <i className="iconfont icon-arrow" />
        </div>
        <div className="form" onClick={() => navigate('/search')}>
          <i className="iconfont icon-seach" />
          <span className="text">请输入小区或地址</span>
        </div>
      </div>
      <i className="iconfont icon-map" onClick={() => navigate('/map')}></i>
    </div>
  )
}

export default SearchHeader