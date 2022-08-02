import React from "react"
import { useNavigate } from 'react-router-dom'
import PropTypes from 'prop-types'

import './index.css'

const SearchHeader = ({ cityName, className }) => {
  const navigate = useNavigate()
  return (
    <div className={["search-box", className || ''].join(' ')}>
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

SearchHeader.propTypes = {
  cityName: PropTypes.string.isRequired
}

export default SearchHeader