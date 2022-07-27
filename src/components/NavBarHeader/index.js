import { NavBar } from 'antd-mobile'
import { useNavigate } from 'react-router-dom'
import PropTypes from 'prop-types'

import styles from './index.module.scss'

const NavBarHeader = ({ children, onBack }) => {
  const navigate = useNavigate()

  // 默认点击行为
  const defaultHandler = () => navigate(-1)

  return (
    // 顶部导航
    <NavBar onBack={onBack || defaultHandler} className={styles.navbar}>{children}</NavBar>
  )
}

// props校验
NavBarHeader.prototypes = {
  children: PropTypes.string.isRequired,
  onBack: PropTypes.func
}

export default NavBarHeader
