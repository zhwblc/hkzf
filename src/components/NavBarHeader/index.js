import { NavBar } from 'antd-mobile'
import { useNavigate } from 'react-router-dom'

import './index.css'

const NavBarHeader = ({ children, onBack }) => {
  const navigate = useNavigate()

  // 默认点击行为
  const defaultHandler = () => navigate(-1)

  return (
    // 顶部导航
    <NavBar onBack={onBack || defaultHandler} className="navbar">{children}</NavBar>
  )
}

export default NavBarHeader
